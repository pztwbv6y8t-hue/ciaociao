(function () {
  const css = document.createElement('style');
  css.textContent = '.topbar{display:flex;gap:8px;margin:0 0 8px}' +
    '.topbar button{flex:1;margin:0;padding:8px;font-size:14px;background:#6b7280}' +
    '.topbar button.out{background:#b33}';
  document.head.appendChild(css);

  function toTop() {
    try { if (chan) sb.removeChannel(chan); } catch (e) {}
    chan = null; code = null; room = null; players = []; me = null;
    localStorage.removeItem('roomcode');
    $('code').value = '';
    $('game').hidden = true; $('game').innerHTML = '';
    $('home').hidden = false;
    say('');
  }
  window.toTop = toTop;

  window.leaveNow = async function () {
    if (!confirm('この部屋から退出しますか？')) return;
    const r = await call('leave_room', { p_code: code });
    if (r === null) return;
    toTop();
  };

  const baseRender = render;
  render = function () {
    baseRender();
    if (!room) return;
    const lobby = room.status === 'lobby';
    const bar = document.createElement('div');
    bar.className = 'topbar';
    bar.innerHTML = '<button onclick="toTop()">← トップへ</button>' +
      (lobby ? '<button class="out" onclick="leaveNow()">退出する</button>' : '');
    $('game').prepend(bar);
  };

  // 部屋が消えた・自分が参加者でなくなったときは、自動でトップに戻す
  setInterval(async () => {
    if (!code) return;
    const { data } = await sb.from('rooms').select('id').eq('code', code).maybeSingle();
    if (!data) { toTop(); say('この部屋はもうありません'); }
  }, 5000);
})();
