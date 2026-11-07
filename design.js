(function () {
  /* ===== スタイル ===== */
  const css = document.createElement('style');
  css.textContent = `
body{font-family:"Hiragino Maru Gothic ProN","Hiragino Sans","Yu Gothic",system-ui,sans-serif;background:#e4eaee;color:#2b2f33}
body:has(#game:not([hidden])) h1{display:none}
h1{font-weight:900;letter-spacing:1px}
button{font-family:inherit;font-weight:700;background:#3b4a56;border-radius:12px;box-shadow:0 3px 0 rgba(0,0,0,.28);transition:transform .08s,box-shadow .08s}
button:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(0,0,0,.28)}
button.sub{background:#8a949c}
button.pri{background:#b5651d}
button.lie{background:#b3392f}
.topbar{margin:0 0 6px!important}
.topbar button{padding:6px 10px!important;font-size:13px!important;border-radius:999px;background:#7b8791!important;box-shadow:none}
.topbar button.out{background:#b3392f!important}
#game:not([data-st="lobby"]) > .topbar + div:not([class]){display:none}
#game[data-st="lobby"] > .topbar + div:not([class]){text-align:center;background:#fff;border-radius:12px;padding:10px;font-size:13px;color:#667;margin-bottom:6px}
#game[data-st="lobby"] > .topbar + div:not([class]) b{display:block;font-size:34px;letter-spacing:8px;color:#2b2f33}
#game > div:not([class]):last-child{text-align:center;color:#778;font-size:14px;margin:8px 0}
.box{border-radius:14px;box-shadow:0 2px 8px #0002}
.hist{display:flex;flex-direction:column;gap:4px;max-height:200px;overflow:auto}

/* 上部バー */
.cc-hud{display:flex;gap:6px;align-items:center;margin:2px 0 8px}
.cc-hud>span{background:#33424d;color:#fff;border-radius:999px;padding:7px 12px;font-size:13px;font-weight:700;white-space:nowrap}
.cc-logo{font-size:15px!important;letter-spacing:.5px}
.cc-turn{flex:1;text-align:center;min-width:0;overflow:hidden;text-overflow:ellipsis}
.cc-turn .dot{display:inline-block;width:11px;height:11px;margin-right:6px;vertical-align:-1px;border:2px solid #fff}
.cc-room{background:#5b6b78!important;font-size:12px!important}

/* スコアボード */
.cc-score{display:flex;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px #0002}
.cc-tn{background:#2b3640;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 10px;min-width:54px}
.cc-tn small{font-size:10px;opacity:.7;letter-spacing:1.5px}
.cc-tn b{font-size:28px;line-height:1.05}
.cc-rows{flex:1;min-width:0}
.cc-r{display:grid;grid-template-columns:16px minmax(0,1fr) 22px 58px 40px 26px;align-items:center;gap:4px;padding:5px 8px;font-size:13px;border-bottom:1px solid #e6ebef}
.cc-r:last-child{border-bottom:0}
.cc-r.hd{font-size:10px;color:#8a949c;padding:3px 8px;background:#f3f6f8;letter-spacing:.5px}
.cc-r.hd span:nth-child(n+3){text-align:center}
.cc-r.turn{background:#fff3cf;box-shadow:inset 4px 0 0 var(--c)}
.cc-r .mk{font-size:11px;color:#b5651d}
.cc-r .nmx{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cc-r .nmx .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--c);margin-right:5px}
.cc-r .nmx em{font-style:normal;font-size:9px;background:#33424d;color:#fff;border-radius:6px;padding:1px 4px;margin-left:4px;vertical-align:1px}
.cc-r .ps{text-align:center;font-weight:700}
.cc-r .pp{display:flex;gap:2px;justify-content:center}
.cc-r .pp i{width:6px;height:11px;border-radius:3px;background:#dfe5e9}
.cc-r .pp i.on{background:var(--c)}
.cc-r .cr{text-align:center;font-size:12px;letter-spacing:-1px}
.cc-r .pt{text-align:center;font-weight:900;font-size:15px;border-radius:6px}
.cc-r .pt.lead{background:#f5c542}
.cc-ev{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;background:#2b3640;color:#fff;border-radius:10px;padding:7px 10px;font-size:12px;margin:8px 0;line-height:1.4}
.cc-ev .t,.cc-h .t{background:#fff;color:#2b3640;border-radius:5px;padding:0 5px;font-weight:900;font-size:11px}
.cc-ev .dc,.cc-h .dc{background:#f5c542;color:#222;border-radius:50%;min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:13px}
.cc-ev .tg,.cc-h .tg{background:#566673;border-radius:5px;padding:0 6px;font-weight:700}
.cc-ev .tg.red,.cc-h .tg.red{background:#b3392f}
.cc-ev .tg.ok,.cc-h .tg.ok{background:#2e8b57}
.cc-ev .tg.face,.cc-h .tg.face{background:#fff;color:#2b3640}
.cc-ev em,.cc-h em{font-style:normal;font-weight:900;color:#ffb4a8}
.cc-h{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;font-size:12px;padding:3px 0;border-bottom:1px solid #eef1f3}
.cc-h .tg{color:#fff}.cc-h em{color:#b3392f}
.cc-pn2{display:inline-flex;align-items:center;gap:3px;font-weight:700}
.cc-pn2 .dot,.cc-ev .dot{display:inline-block;width:9px;height:9px;border-radius:50%;flex:none}

/* シーン */
.cc-scene{position:relative;height:480px;border-radius:16px;overflow:hidden;box-shadow:0 4px 14px #0003;margin-bottom:10px}
.cc-bg,.cc-rope{position:absolute;left:0;top:0;width:100%;height:480px}
.cc-rope{pointer-events:none;z-index:3}
.cc-post{position:absolute;width:13px;height:13px;margin:-6px 0 0 -6px;border-radius:50%;z-index:4;background:radial-gradient(circle at 35% 30%,#c9a073,#6a4424 60%,#3b2411);box-shadow:0 3px 3px #0005}
.cc-beam{position:absolute;left:16%;right:16%;height:9px;border-radius:3px;background:linear-gradient(#7a5532,#4b2f17);box-shadow:0 2px 3px #0005;z-index:2}
.cc-deck{position:absolute;top:80px;left:18%;right:18%;z-index:1}
.cc-pl{position:relative;height:34px;margin:3px 0;border-radius:4px;background-color:#b9824a;
  background-image:linear-gradient(180deg,rgba(255,255,255,.25),rgba(0,0,0,0) 32%,rgba(0,0,0,.2)),repeating-linear-gradient(90deg,rgba(0,0,0,.07) 0 2px,transparent 2px 11px);
  box-shadow:0 3px 0 #6e4524,0 6px 8px rgba(0,0,0,.3)}
.cc-pl.v1{background-color:#c4925c}.cc-pl.v2{background-color:#a9743e}
.cc-pl:nth-child(3n+1){margin-left:1px;margin-right:-1px}
.cc-pl:nth-child(3n){margin-left:-1px;margin-right:1px}
.cc-pl::before,.cc-pl::after{content:"";position:absolute;top:50%;width:5px;height:5px;margin-top:-2.5px;border-radius:50%;background:#4a2f18;box-shadow:inset 0 1px 0 #9c7a52}
.cc-pl::before{left:6px}.cc-pl::after{right:6px}
.cc-pn{position:absolute;left:17px;top:50%;transform:translateY(-50%);font-size:11px;font-weight:900;color:rgba(60,35,15,.5)}
.cc-pc{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:2px}
.cc-plat{box-sizing:border-box;position:absolute;left:0;right:0;height:78px;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:6px 8px 8px}
.cc-plat.g{top:0}.cc-plat.s{top:402px;justify-content:center}
.cc-plat .lb{position:absolute;left:10px;top:7px;font-size:10px;font-weight:900;letter-spacing:1px;color:#4f6b36;background:#e9f3d9;border-radius:6px;padding:1px 6px}
.cc-plat.s .lb{top:auto;bottom:7px}
.cc-sls{display:flex;gap:4px;margin-top:auto}
.cc-sl{width:18px;height:18px;border-radius:50%;border:2px dashed #8f7a5c;font-style:normal;font-size:10px;font-weight:900;color:#8f7a5c;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.4)}
.cc-sl.on{border:2px solid #fff;background:var(--c);color:#fff;box-shadow:0 1px 3px #0006}

/* コマ */
.cc-fig{position:relative;display:inline-flex;flex-direction:column;align-items:center;margin:0 1px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.4));z-index:5}
.cc-hd{width:28px;height:28px;border-radius:50%;border:3px solid var(--c);background:#fff center/cover no-repeat;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:12px;font-weight:900;color:var(--c)}
.cc-bd{width:18px;height:11px;margin-top:-3px;border-radius:9px 9px 3px 3px;background:var(--c);border:2px solid rgba(255,255,255,.75);border-top:0;box-sizing:border-box}
.cc-fig.turn{animation:ccbob 1.1s ease-in-out infinite}
.cc-fig.turn .cc-hd{box-shadow:0 0 0 3px #fff,0 0 12px 4px var(--c)}
@keyframes ccbob{50%{transform:translateY(-4px)}}
.cc-nm{position:absolute;bottom:100%;margin-bottom:3px;font-style:normal;font-size:10px;font-weight:700;background:#222;color:#fff;border-radius:6px;padding:1px 6px;white-space:nowrap}
.cc-jd{position:absolute;top:-9px;right:-11px;font-style:normal;font-size:14px}
.cc-ghost{position:absolute;z-index:6;pointer-events:none}

/* 操作エリア */
.cc-act{background:#fff;border-radius:14px;padding:12px;margin:0 0 10px;box-shadow:0 2px 8px #0002;text-align:center}
.cc-act button.big{font-size:20px;padding:14px;width:100%;margin:4px 0 0}
.cc-btns{display:flex;gap:8px;margin-top:6px}
.cc-btns button{flex:1;margin:0;font-size:19px;padding:15px 8px}
.cc-wait{color:#5b6b78;font-size:14px;padding:8px 0}
.cc-dots i{display:inline-block;width:5px;height:5px;border-radius:50%;background:#8a949c;margin-left:3px;animation:ccdot 1.2s infinite}
.cc-dots i:nth-child(2){animation-delay:.2s}.cc-dots i:nth-child(3){animation-delay:.4s}
@keyframes ccdot{0%,80%,100%{opacity:.2}40%{opacity:1}}
.cc-cupwrap{height:104px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:6px}
.cc-cupico{width:80px;height:92px;background:linear-gradient(90deg,#8a2f2f,#c4504a 45%,#8a2f2f);clip-path:polygon(14% 0,86% 0,100% 100%,0 100%)}
#dice.shake{animation:ccshake .7s}
@keyframes ccshake{0%,100%{transform:rotate(0)}20%{transform:rotate(-16deg) translateY(-8px)}40%{transform:rotate(16deg)}60%{transform:rotate(-14deg) translateY(-8px)}80%{transform:rotate(10deg)}}
.cc-mine{font-size:12px;color:#fff;background:#33424d;display:inline-block;border-radius:999px;padding:2px 12px;margin-bottom:8px}
.cc-die{width:84px;height:84px;margin:0 auto 8px;background:#fff;border-radius:16px;border:2px solid #2b3640;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);padding:11px;box-sizing:border-box;box-shadow:0 4px 0 #2b3640}
.cc-die i{border-radius:50%;margin:2px}.cc-die i.on{background:#222}
.cc-die.x{display:flex;align-items:center;justify-content:center;font-size:64px;color:#b3392f;line-height:1;padding:0;font-weight:900}
.cc-hintx{font-size:12px;color:#667;margin-bottom:8px}
.cc-nums{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.cc-nums button{margin:0;font-size:28px;padding:12px 0;background:#fff;color:#2b3640;border:2px solid #2b3640;box-shadow:0 3px 0 #2b3640}
.cc-decl{display:flex;align-items:center;justify-content:center;gap:10px;font-size:14px}
.cc-decl b{background:#f5c542;color:#222;border-radius:14px;min-width:56px;height:56px;display:inline-flex;align-items:center;justify-content:center;font-size:36px}
.cc-judge{margin:8px 0 2px;font-size:14px}
.cc-title{font-weight:900;font-size:16px;margin-bottom:6px}
.cc-vote{font-size:14px;line-height:1.8}
.cc-trophy{font-size:48px}.cc-win{font-size:24px;font-weight:900}.cc-sub{font-size:12px;color:#667;margin-top:4px}

/* ロビー */
.cc-lp{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #eef1f3}
.cc-lp:last-of-type{border-bottom:0}
.cc-av{width:44px;height:44px;border-radius:50%;border:4px solid var(--c);background:#fff center/cover no-repeat;box-sizing:border-box;flex:none;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:900;color:var(--c);font-size:16px}
.cc-lpn{flex:1;font-weight:700;font-size:16px}
.cc-lpn em{font-style:normal;font-size:10px;background:#33424d;color:#fff;border-radius:6px;padding:1px 6px;margin-left:4px}
.cc-lpn em.me{background:#b5651d}
.cc-lp button{width:auto;margin:0;padding:6px 12px;font-size:13px}
.cc-cnt{text-align:right;font-size:12px;color:#778;margin-top:4px}
`;
  document.head.appendChild(css);

  /* ===== 補助 ===== */
  const NUM = '①②③④⑤⑥⑦⑧';
  const avUrl = p => (p && p.avatar_path)
    ? sb.storage.from('avatars').getPublicUrl(p.avatar_path).data.publicUrl : '';
  const bgi = u => u ? ' style=\'background-image:url("' + u + '")\'' : '';
  const ini = p => esc(Array.from(p.name || '?')[0] || '?');
  const score = p => (p.ranks || []).reduce((a, b) => a + b, 0);
  const remain = p => p.hand + (p.pos !== null ? 1 : 0);
  const pn = p => p
    ? '<span class="cc-pn2"><i class="dot" style="background:' + COL[p.color] + '"></i>' + esc(p.name) + '</span>' : '?';
  const POS = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9] };

  function dieFace(f) {
    if (f === 'X') return '<div class="cc-die x">×</div>';
    if (!POS[f]) return '<div class="cc-die x" style="color:#999">?</div>';
    let h = '';
    for (let i = 1; i <= 9; i++) h += '<i' + (POS[f].includes(i) ? ' class="on"' : '') + '></i>';
    return '<div class="cc-die">' + h + '</div>';
  }

  function evt(h) {
    const r = bySeat(h.roller), j = h.judge == null ? null : bySeat(h.judge);
    const face = h.face ? '<span class="tg face">実際 ' + (h.face === 'X' ? '×' : h.face) + '</span>' : '';
    let t = '<span class="t">T' + h.turn + '</span>' + pn(r) + '<b class="dc">' + h.declared + '</b>';
    if (!j) return t + '<span class="tg">判定なし</span>' + face;
    if (!h.accused) return t + '→' + pn(j) + '<span class="tg">疑わず</span>' + face;
    return t + '→' + pn(j) + '<span class="tg red">嘘だ！</span>' + face + (h.result === 'lie'
      ? '<span class="tg ok">嘘</span>' + pn(r) + '<em>✕</em>' + pn(j) + '<em>+' + h.declared + '</em>'
      : '<span class="tg">本当</span>' + pn(j) + '<em>✕</em>');
  }

  function fig(p, st) {
    const turn = room.status === 'playing' && st.turn_seat === p.seat;
    const judge = room.status === 'playing' && st.phase === 'judge' && st.judge_seat === p.seat;
    const u = avUrl(p);
    return '<span class="cc-fig' + (turn ? ' turn' : '') + '" data-seat="' + p.seat + '" data-pos="' + p.pos +
      '" data-rk="' + (p.ranks || []).length + '" style="--c:' + COL[p.color] + '">' +
      (turn ? '<i class="cc-nm">' + esc(p.name) + '</i>' : '') +
      (judge ? '<i class="cc-jd">⚖</i>' : '') +
      '<i class="cc-hd"' + bgi(u) + '>' + (u ? '' : ini(p)) + '</i><i class="cc-bd"></i></span>';
  }

  /* ===== 背景SVG ===== */
  const BG =
    '<svg class="cc-bg" viewBox="0 0 400 480" preserveAspectRatio="none" aria-hidden="true">' +
    '<defs>' +
    '<linearGradient id="ccsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4e6f2"/><stop offset=".55" stop-color="#a6c4da"/><stop offset="1" stop-color="#8aaec9"/></linearGradient>' +
    '<linearGradient id="ccrock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9cbb0"/><stop offset="1" stop-color="#b3a084"/></linearGradient>' +
    '<linearGradient id="ccshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
    '</defs>' +
    '<rect width="400" height="480" fill="url(#ccsky)"/>' +
    '<g fill="#fff" opacity=".9">' +
    '<ellipse cx="70" cy="160" rx="52" ry="13"/><ellipse cx="102" cy="151" rx="32" ry="12"/><ellipse cx="42" cy="153" rx="26" ry="10"/>' +
    '<ellipse cx="330" cy="236" rx="56" ry="14"/><ellipse cx="298" cy="228" rx="30" ry="11"/><ellipse cx="362" cy="230" rx="28" ry="10"/>' +
    '<ellipse cx="96" cy="322" rx="58" ry="14"/><ellipse cx="132" cy="313" rx="30" ry="11"/>' +
    '<ellipse cx="318" cy="352" rx="48" ry="12"/><ellipse cx="346" cy="344" rx="26" ry="10"/>' +
    '</g>' +
    '<g fill="#fff" opacity=".5"><ellipse cx="200" cy="262" rx="150" ry="26"/><ellipse cx="200" cy="196" rx="120" ry="18"/></g>' +
    '<path d="M0 78 L30 96 L20 140 L38 188 L24 240 L42 290 L28 340 L36 386 L0 406Z" fill="#7d6b58"/>' +
    '<path d="M0 78 L16 90 L8 140 L22 188 L10 240 L24 290 L12 340 L18 386 L0 406Z" fill="#9b8770"/>' +
    '<path d="M400 78 L370 96 L380 140 L362 188 L376 240 L358 290 L372 340 L364 386 L400 406Z" fill="#7d6b58"/>' +
    '<path d="M400 78 L384 90 L392 140 L378 188 L390 240 L376 290 L388 340 L382 386 L400 406Z" fill="#9b8770"/>' +
    '<rect x="0" y="0" width="400" height="80" fill="url(#ccrock)"/>' +
    '<rect x="0" y="72" width="400" height="9" fill="#86b560"/>' +
    '<rect x="0" y="81" width="400" height="16" fill="url(#ccshade)"/>' +
    '<rect x="0" y="400" width="400" height="80" fill="url(#ccrock)"/>' +
    '<rect x="0" y="400" width="400" height="9" fill="#86b560"/>' +
    '<g fill="#a08c70" opacity=".6"><circle cx="40" cy="30" r="4"/><circle cx="360" cy="40" r="5"/><circle cx="330" cy="20" r="3"/><circle cx="60" cy="452" r="4"/><circle cx="350" cy="446" r="5"/></g>' +
    '</svg>';

  const ROPE = (function () {
    const mk = x => {
      const out = x < 50 ? x - 1.6 : x + 1.6;
      let d = 'M' + x + ' 80';
      for (let y = 80; y < 400; y += 80) d += ' Q' + out + ' ' + (y + 40) + ' ' + x + ' ' + (y + 80);
      return '<path d="' + d + '" fill="none" stroke="#5b3a1e" stroke-width="4.5" vector-effect="non-scaling-stroke" stroke-linecap="round"/>' +
        '<path d="' + d + '" fill="none" stroke="#e4cf9a" stroke-width="1.6" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/>';
    };
    return '<svg class="cc-rope" viewBox="0 0 100 480" preserveAspectRatio="none" aria-hidden="true">' + mk(15) + mk(85) + '</svg>';
  })();

  function posts() {
    let h = '';
    for (let y = 80; y <= 400; y += 80)
      h += '<i class="cc-post" style="left:15%;top:' + y + 'px"></i><i class="cc-post" style="left:85%;top:' + y + 'px"></i>';
    return h;
  }

  /* ===== 画面部品（app.js の関数を置き換え） ===== */
  function scene(st) {
    const cell = i => players.filter(p => p.pos === i).map(p => fig(p, st)).join('');
    let planks = '';
    for (let i = 8; i >= 1; i--)
      planks += '<div class="cc-pl v' + (i % 3) + '"><span class="cc-pn">' + i + '</span><div class="cc-pc">' + cell(i) + '</div></div>';
    let slots = '';
    for (let n = 1; n <= 8; n++) {
      const o = players.find(p => (p.ranks || []).includes(n));
      slots += '<i class="cc-sl' + (o ? ' on' : '') + '"' + (o ? ' style="--c:' + COL[o.color] + '"' : '') + '>' + n + '</i>';
    }
    return '<div class="cc-scene">' + BG +
      '<div class="cc-plat g"><span class="lb">GOAL</span><div class="cc-pc" style="position:static;height:40px">' + cell(9) + '</div><div class="cc-sls">' + slots + '</div></div>' +
      '<i class="cc-beam" style="top:76px"></i><i class="cc-beam" style="top:396px"></i>' +
      '<div class="cc-deck">' + planks + '</div>' + ROPE + posts() +
      '<div class="cc-plat s"><span class="lb">START</span><div class="cc-pc" style="position:static;height:40px">' + cell(0) + '</div></div>' +
      '</div>';
  }

  function board(st) {
    const sc = players.map(score);
    const mx = Math.max.apply(null, sc.concat([0]));
    const lead = mx > 0 && sc.filter(x => x === mx).length === 1 ? mx : -1;
    const playing = room.status === 'playing';
    const rows = players.map((p, i) => {
      const turn = playing && st.turn_seat === p.seat;
      const judge = playing && st.phase === 'judge' && st.judge_seat === p.seat;
      let pips = '';
      for (let k = 0; k < 7; k++) pips += '<i' + (k < remain(p) ? ' class="on"' : '') + '></i>';
      return '<div class="cc-r' + (turn ? ' turn' : '') + '" style="--c:' + COL[p.color] + '">' +
        '<span class="mk">' + (turn ? '▶' : judge ? '⚖' : '') + '</span>' +
        '<span class="nmx"><i class="dot"></i>' + esc(p.name) + (me && me.seat === p.seat ? '<em>YOU</em>' : '') + '</span>' +
        '<span class="ps">' + (p.pos === null ? '–' : p.pos) + '</span>' +
        '<span class="pp">' + pips + '</span>' +
        '<span class="cr">' + ((p.ranks || []).map(r => NUM[r - 1] || r).join('') || '–') + '</span>' +
        '<span class="pt' + (sc[i] === lead ? ' lead' : '') + '">' + sc[i] + '</span></div>';
    }).join('');
    const hist = st.history || [];
    const last = hist[hist.length - 1];
    return '<div class="cc-score"><div class="cc-tn"><small>TURN</small><b>' + (st.turn_no || 1) + '</b></div>' +
      '<div class="cc-rows"><div class="cc-r hd"><span></span><span>PLAYER</span><span>橋</span><span>残り</span><span>渡った</span><span>点</span></div>' + rows + '</div></div>' +
      '<div class="cc-ev">' + (last ? evt(last) : 'ゲーム開始！ 手番の人がダイスを振ります') + '</div>';
  }

  bridge = function () {
    const st = room.state || {};
    const tp = bySeat(st.turn_seat);
    let who = '';
    if (room.status === 'finished') who = '🏆 ゲーム終了';
    else if (room.status === 'paused') who = '⏸ 中断中';
    else if (tp) who = '<i class="dot" style="background:' + COL[tp.color] + '"></i>' + esc(tp.name) + ' さんの番';
    return '<div class="cc-hud"><span class="cc-logo">Ciao Ciao</span><span class="cc-turn">' + who +
      '</span><span class="cc-room">ルーム ' + esc(room.code) + '</span></div>' + board(st) + scene(st);
  };

  plist = function () {
    if (room.status !== 'lobby') return '';
    return players.map(p => {
      const u = avUrl(p);
      const mine = me && me.seat === p.seat;
      return '<div class="cc-lp" style="--c:' + COL[p.color] + '"><i class="cc-av"' + bgi(u) + '>' + (u ? '' : ini(p)) + '</i>' +
        '<span class="cc-lpn">' + esc(p.name) + (room.host_id === p.user_id ? '<em>ホスト</em>' : '') + (mine ? '<em class="me">あなた</em>' : '') + '</span>' +
        (mine ? '<button onclick="document.getElementById(\'pick\').click()">顔写真</button>' : '') + '</div>';
    }).join('') + '<div class="cc-cnt">' + players.length + ' / 4 人</div>';
  };

  hist = function (st) {
    return (st.history || []).slice(-12).reverse().map(h => '<div class="cc-h">' + evt(h) + '</div>').join('') ||
      '<div class="cc-h">まだありません</div>';
  };

  const wait = (p, t) => '<div class="cc-wait">' + pn(p) + ' が' + t + '<span class="cc-dots"><i></i><i></i><i></i></span></div>';

  actions = function (st) {
    if (!me) return '<div class="cc-act">この部屋の参加者ではありません</div>';
    const tp = bySeat(st.turn_seat);
    if (room.status === 'finished') {
      const ws = st.winners || [];
      const names = ws.map(s => pn(bySeat(s))).join(' ');
      return '<div class="cc-act"><div class="cc-trophy">🏆</div><div class="cc-win">' +
        (ws.length === 0 ? '引き分け' : ws.length > 1 ? '引き分け：' + names : names + ' の勝ち') + '</div>' +
        '<div class="cc-sub">' + (st.reason === 'three' ? '3個を渡りきりました' : '着順マスの合計点で決着') + '</div></div>';
    }
    if (room.status === 'paused') {
      const v = st.resume_votes || {};
      const mine = v[String(me.seat)];
      return '<div class="cc-act"><div class="cc-title">⏸ 中断中</div>' +
        players.map(p => '<div class="cc-vote">' + pn(p) + '：' +
          (v[String(p.seat)] === true ? '同意' : v[String(p.seat)] === false ? '不同意' : '未回答') + '</div>').join('') +
        (mine === true ? '' : '<div class="cc-btns"><button class="pri" onclick="act.vote(true)">再開に同意</button><button class="sub" onclick="act.vote(false)">同意しない</button></div>') +
        '</div>';
    }
    const mineTurn = st.turn_seat === me.seat;
    let h = '<div class="cc-act">';
    if (st.phase === 'roll') {
      h += mineTurn
        ? '<div id="dice" class="cc-cupwrap"><div class="cc-cupico"></div></div><button class="pri big" onclick="act.roll()">ダイスを振る</button>'
        : wait(tp, 'ダイスを振るのを待っています');
    } else if (st.phase === 'declare') {
      if (mineTurn) {
        h += '<div class="cc-mine">あなただけに見えています</div>' + dieFace(myFace) +
          '<div class="cc-hintx">' + (myFace === 'X' ? '×が出ました。必ず嘘の数字を宣言します' : '本当の数字でも、嘘の数字でも宣言できます') + '</div>' +
          '<div class="cc-nums">' + [1, 2, 3, 4].map(n => '<button onclick="act.decl(' + n + ')">' + n + '</button>').join('') + '</div>';
      } else h += wait(tp, '数字を宣言するのを待っています');
    } else if (st.phase === 'judge') {
      const jp = bySeat(st.judge_seat);
      h += '<div class="cc-decl">' + pn(tp) + ' の宣言<b>' + st.declared + '</b></div><div class="cc-judge">⚖ 判定者：' + pn(jp) + '</div>';
      h += me.seat === st.judge_seat
        ? '<div class="cc-btns"><button class="lie" onclick="act.judge(true)">嘘だ！</button><button class="sub" onclick="act.judge(false)">疑わない</button></div>'
        : '<div class="cc-wait">判定を待っています<span class="cc-dots"><i></i><i></i><i></i></span></div>';
    }
    return h + '</div>';
  };

  /* ===== コマの動き ===== */
  let prev = {}, prevRoom = null;

  function ghost(scene, p, crossed) {
    const g = document.createElement('div');
    g.className = 'cc-ghost';
    g.style.left = p.x + 'px';
    g.style.top = p.y + 'px';
    g.innerHTML = p.html;
    scene.appendChild(g);
    const a = crossed
      ? g.animate([{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(-28px) scale(1.5)' }], { duration: 700, easing: 'ease-out' })
      : g.animate([{ opacity: 1, transform: 'translateY(0) rotate(0deg)' }, { opacity: 0, transform: 'translateY(90px) rotate(160deg)' }], { duration: 800, easing: 'ease-in' });
    a.onfinish = () => g.remove();
  }

  function motion() {
    const scene = document.querySelector('.cc-scene');
    if (!scene || !room || document.getElementById('rv')) return;
    if (prevRoom !== room.id) { prevRoom = room.id; prev = {}; }
    const sr = scene.getBoundingClientRect();
    if (!sr.width) return;
    const cur = {};
    scene.querySelectorAll('.cc-fig').forEach(f => {
      const r = f.getBoundingClientRect();
      const o = { x: r.left - sr.left, y: r.top - sr.top, pos: +f.dataset.pos, rk: +f.dataset.rk, html: f.outerHTML };
      cur[f.dataset.seat] = o;
      const p = prev[f.dataset.seat];
      if (!p) return;
      const dx = p.x - o.x, dy = p.y - o.y;
      if (Math.abs(dx) + Math.abs(dy) < 6) return;
      if (o.pos > p.pos) {
        f.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(0,0)' }],
          { duration: 650, easing: 'cubic-bezier(.3,.1,.2,1)' });
      } else {
        f.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
          { duration: 450, delay: 350, easing: 'ease-out', fill: 'backwards' });
        ghost(scene, p, o.rk > p.rk);
      }
    });
    Object.keys(prev).forEach(s => { if (!cur[s]) ghost(scene, prev[s], false); });
    prev = cur;
  }

  const baseRender = render;
  render = function () {
    if (room) $('game').dataset.st = room.status;
    baseRender();
    try { motion(); } catch (e) {}
  };

  // 演出（コップ）が閉じたら、コマの動きを再生するためにもう一度描画する
  new MutationObserver(ms => {
    for (const m of ms) for (const n of m.removedNodes)
      if (n.id === 'rv') setTimeout(() => { if (room) render(); }, 60);
  }).observe(document.body, { childList: true });

  // 画面に紛れ込んだ単独の「p」を消す
  document.body.childNodes.forEach(n => { if (n.nodeType === 3 && n.textContent.trim() === 'p') n.remove(); });
  const mg = document.getElementById('msg');
  if (mg && mg.textContent.trim() === 'p') mg.textContent = '';
})();

