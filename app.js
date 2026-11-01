const sb = supabase.createClient(
  'https://ysmkrhqemvesxdljtmuq.supabase.co',
  'sb_publishable_sb3iCEI8L7pyOzuBMe1vbA_HIxnLpGE');
const $ = id => document.getElementById(id);
const COL = {red:'#d33', blue:'#36c', yellow:'#e0a800', green:'#2a7'};
const CN = {red:'赤', blue:'青', yellow:'黄', green:'緑'};
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let code = null, room = null, players = [], me = null, myFace = null, uid = null, busy = false, chan = null;

const say = t => { $('msg').textContent = t || ''; };
const bySeat = s => players.find(p => p.seat === s);
const nm = p => p ? `<b style="color:${COL[p.color]}">${esc(p.name)}</b>` : '?';

async function call(fn, args) {
  if (busy) return null;
  busy = true; say('');
  const { data, error } = await sb.rpc(fn, args);
  busy = false;
  if (error) { say(error.message); return null; }
  return data ?? true;
}

async function refresh() {
  if (!code) return;
  const { data: r } = await sb.from('rooms').select('*').eq('code', code).maybeSingle();
  if (!r) return;
  room = r;
  const { data: p } = await sb.from('players').select('*').eq('room_id', r.id).order('seat');
  players = p || [];
  me = players.find(x => x.user_id === uid);
  myFace = null;
  const st = room.state || {};
  if (me && st.phase === 'declare' && st.turn_seat === me.seat) {
    const { data: s } = await sb.from('secret_rolls').select('face').maybeSingle();
    if (s) myFace = s.face;
  }
  render();
}

function enter(c) {
  code = c;
  localStorage.setItem('roomcode', c);
  $('home').hidden = true; $('game').hidden = false;
  refresh().then(() => {
    if (!room) return;
    if (chan) sb.removeChannel(chan);
    chan = sb.channel('room-' + c)
      .on('postgres_changes', {event:'*', schema:'public', table:'rooms', filter:'id=eq.' + room.id}, refresh)
      .on('postgres_changes', {event:'*', schema:'public', table:'players', filter:'room_id=eq.' + room.id}, refresh)
      .subscribe();
  });
}

function bridge() {
  let h = '';
  for (let i = 9; i >= 0; i--) {
    const here = players.filter(p => p.pos === i);
    const label = i === 0 ? 'スタート' : i === 9 ? 'ゴール' : i;
    h += `<div class="cell ${i === 0 ? 's' : i === 9 ? 'g' : ''}"><span class="n">${label}</span>` +
      here.map(p => `<i class="pc" style="background:${COL[p.color]}"></i>`).join('') + '</div>';
  }
  return `<div class="bridge">${h}</div>`;
}

function plist(st) {
  return players.map(p => {
    const left = p.hand + (p.pos !== null ? 1 : 0);
    const tags = (st.turn_seat === p.seat && room.status === 'playing' ? ' ←手番' : '') +
      (st.judge_seat === p.seat && st.phase === 'judge' ? ' ⚖判定者' : '') +
      (me && me.seat === p.seat ? '（あなた）' : '');
    return `<div class="pl ${st.turn_seat === p.seat ? 'turn' : ''}">` +
      `<span class="dot" style="background:${COL[p.color]}"></span>` +
      `<span>${esc(p.name)}${tags}<br>残り${left}個　渡った：${p.ranks.length ? p.ranks.map(r => '①②③④⑤⑥⑦⑧'[r - 1] || r).join('') : 'なし'}</span></div>`;
  }).join('');
}

function hist(st) {
  return (st.history || []).slice().reverse().map(h => {
    const r = bySeat(h.roller), j = h.judge == null ? null : bySeat(h.judge);
    let t = `${h.turn}. ${nm(r)}が「${h.declared}」と宣言`;
    if (!h.accused) t += j ? ` → ${nm(j)}は疑わなかった` : ' → 判定者なし';
    else t += ` → ${nm(j)}「嘘だ！」→ ` +
      (h.result === 'lie' ? `嘘でした（${nm(r)}が落ちた、${nm(j)}が${h.declared}進んだ）` : `本当でした（${nm(j)}が落ちた）`);
    return `<div>${t}</div>`;
  }).join('') || '<div>まだありません</div>';
}

function actions(st) {
  if (!me) return '<div class="box">この部屋の参加者ではありません</div>';
  const tp = bySeat(st.turn_seat);
  if (room.status === 'finished') {
    const w = (st.winners || []).map(s => nm(bySeat(s))).join('、');
    return `<div class="box big">🏆 ${w || '引き分け'}</div>`;
  }
  if (room.status === 'paused') {
    const v = st.resume_votes || {};
    const mine = v[String(me.seat)];
    return `<div class="box"><b>⏸ 中断中</b><br>` +
      players.map(p => `${nm(p)}：${v[String(p.seat)] === true ? '同意' : v[String(p.seat)] === false ? '不同意' : '未回答'}`).join('<br>') +
      (mine === true ? '' : `<div class="row"><button onclick="act.vote(true)">再開に同意</button><button class="sub" onclick="act.vote(false)">同意しない</button></div>`) +
      '</div>';
  }
  const mineTurn = st.turn_seat === me.seat;
  let h = '<div class="box">';
  if (st.phase === 'roll') {
    h += mineTurn ? `<div id="dice" class="big">🎲</div><button onclick="act.roll()">ダイスを振る</button>`
                  : `${nm(tp)}がダイスを振るのを待っています`;
  } else if (st.phase === 'declare') {
    if (mineTurn) {
      h += `<div class="big">${myFace === 'X' ? '×（必ず嘘）' : myFace || '?'}</div>` +
        `<div>あなただけに見えています。宣言する数字を選んでください</div><div class="row">` +
        [1, 2, 3, 4].map(n => `<button onclick="act.decl(${n})">${n}</button>`).join('') + '</div>';
    } else h += `${nm(tp)}が数字を宣言するのを待っています`;
  } else if (st.phase === 'judge') {
    const jp = bySeat(st.judge_seat);
    h += `${nm(tp)}の宣言：<span class="big">${st.declared}</span><br>判定者：${nm(jp)}`;
    if (me.seat === st.judge_seat)
      h += `<div class="row"><button class="warn" onclick="act.judge(true)">嘘だ！</button><button class="sub" onclick="act.judge(false)">疑わない</button></div>`;
    else h += '<br>判定を待っています';
  }
  return h + '</div>';
}

function render() {
  const st = room.state || {};
  let h = `<div>部屋番号：<b>${esc(room.code)}</b></div>`;
  if (room.status === 'lobby') {
    h += `<div class="box">${plist(st)}</div>`;
    if (me && room.host_id === uid)
      h += `<button onclick="act.start()">ゲーム開始（${players.length}人）</button>`;
    else h += '<div>ホストが開始するのを待っています</div>';
  } else {
    h += bridge() + actions(st) + plist(st) +
      `<div class="box"><b>履歴</b><div class="hist">${hist(st)}</div></div>`;
    if (room.status === 'playing') h += '<button class="sub" onclick="act.pause()">中断する</button>';
  }
  $('game').innerHTML = h;
}

const act = {
  async create() {
    const c = await call('create_room', { p_name: $('name').value });
    if (c) enter(c);
  },
  async join() {
    const c = await call('join_room', { p_code: $('code').value, p_name: $('name').value });
    if (c) enter(c);
  },
  async start() { await call('start_game', { p_code: code }); refresh(); },
  async roll() {
    const d = $('dice'); if (d) d.classList.add('shake');
    const [f] = await Promise.all([call('roll_dice', { p_code: code }), new Promise(r => setTimeout(r, 700))]);
    await refresh();
  },
  async decl(n) { await call('declare_number', { p_code: code, p_num: n }); refresh(); },
  async judge(a) { await call('judge_decide', { p_code: code, p_accuse: a }); refresh(); },
  async pause() { await call('pause_game', { p_code: code }); refresh(); },
  async vote(a) { await call('vote_resume', { p_code: code, p_agree: a }); refresh(); }
};

async function init() {
  let { data } = await sb.auth.getSession();
  if (!data.session) {
    const r = await sb.auth.signInAnonymously();
    if (r.error) return say('ログインに失敗：' + r.error.message);
    data = r.data;
  }
  uid = data.session.user.id;
  const saved = localStorage.getItem('roomcode');
  if (saved) {
    $('code').value = saved;
    const { data: r } = await sb.from('rooms').select('code').eq('code', saved).maybeSingle();
    if (r) enter(saved);
  }
  setInterval(refresh, 4000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
init();
