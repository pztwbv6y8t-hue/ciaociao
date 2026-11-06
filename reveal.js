(function () {
  const css = document.createElement('style');
  css.textContent =
    '#rv{position:fixed;inset:0;background:rgba(20,16,12,.9);z-index:99;display:flex;align-items:center;justify-content:center;animation:rvin .3s}' +
    '@keyframes rvin{from{opacity:0}}' +
    '.rvbox{width:min(340px,92vw);text-align:center;color:#fff}' +
    '.rvtitle{font-size:17px;line-height:1.6;min-height:56px}' +
    '.stage{position:relative;height:250px}' +
    '.rslot{position:absolute;left:50%;bottom:20px;margin-left:-55px;width:110px;height:110px}' +
    '.rdie{width:110px;height:110px;background:#fff;border-radius:18px;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);padding:14px;box-sizing:border-box;box-shadow:0 6px 18px #000a;animation:rpop .45s}' +
    '.rdie i{border-radius:50%;margin:3px}.rdie i.on{background:#222}' +
    '.rdie.x{display:flex;align-items:center;justify-content:center;font-size:84px;color:#c22;line-height:1;padding:0}' +
    '@keyframes rpop{0%{transform:scale(.3);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}' +
    '.cup{position:absolute;left:50%;bottom:10px;margin-left:-70px;width:140px;height:170px;' +
      'background:linear-gradient(90deg,#8a2f2f,#c4504a 45%,#8a2f2f);clip-path:polygon(14% 0,86% 0,100% 100%,0 100%);' +
      'transition:transform .9s cubic-bezier(.3,.1,.2,1),opacity .9s;transform-origin:80% 100%}' +
    '.cup::after{content:"";position:absolute;left:0;right:0;bottom:0;height:14px;background:#5e1d1d}' +
    '.cup.lift{transform:translateY(-170px) rotate(-22deg);opacity:0}' +
    '.cw{position:absolute;left:0;right:0;top:70px;z-index:2}' +
    '.cnt{font-size:96px;font-weight:bold;text-shadow:0 0 18px #000;animation:rpop .5s}' +
    '.rvinfo{margin-top:10px;font-size:19px;line-height:1.7;min-height:90px}' +
    '.rvinfo .lie{color:#ff8b7b;font-size:26px}.rvinfo .truth{color:#8fe08f;font-size:26px}' +
    '.rvhint{font-size:12px;color:#aaa}';
  document.head.appendChild(css);

  const POS = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9] };
  function dieHtml(f) {
    if (f === 'X') return '<div class="rdie x">×</div>';
    let h = '';
    for (let i = 1; i <= 9; i++) h += '<i' + (POS[f].includes(i) ? ' class="on"' : '') + '></i>';
    return '<div class="rdie">' + h + '</div>';
  }

  let baseRoom = null, seen = 0, playing = false;

  function play(h) {
    playing = true;
    const r = bySeat(h.roller), j = bySeat(h.judge);
    const el = document.createElement('div');
    el.id = 'rv';
    el.innerHTML = '<div class="rvbox">' +
    
      '<div class="rvtitle">' + (j ? nm(j) + (h.accused ? 'が「嘘だ！」' : 'は「疑わない」') : '判定者なし') + '<br>' + nm(r) + 'の宣言：<b>' + h.declared + '</b></div>' +

      '<div class="stage"><div class="rslot"></div><div class="cup"></div><div class="cw"></div></div>' +
      '<div class="rvinfo"></div><div class="rvhint"></div></div>';
    document.body.appendChild(el);
    const cw = el.querySelector('.cw'), cup = el.querySelector('.cup'),
      slot = el.querySelector('.rslot'), info = el.querySelector('.rvinfo'),
      hint = el.querySelector('.rvhint');
    const timers = []; let done = false;
    const T = (f, ms) => timers.push(setTimeout(f, ms));
    const close = () => { timers.forEach(clearTimeout); el.remove(); playing = false; };
    el.onclick = () => { if (done) close(); };

    T(() => { cw.innerHTML = '<div class="cnt">3</div>'; }, 300);
    T(() => { cw.innerHTML = '<div class="cnt">2</div>'; }, 1300);
    T(() => { cw.innerHTML = '<div class="cnt">1</div>'; }, 2300);
    T(() => { cw.innerHTML = ''; slot.innerHTML = dieHtml(h.face); cup.classList.add('lift'); }, 3300);
    T(() => {
      const lie = h.face === 'X' || String(h.declared) !== String(h.face);

      info.innerHTML = nm(r) + 'の宣言「' + h.declared + '」→ 実際は <b>' + (h.face === 'X' ? '×' : h.face) + '</b><br>' +
      
        '<b class="' + (lie ? 'lie' : 'truth') + '">' + (h.accused ? (lie ? '嘘でした！' : '本当でした！') : (lie ? '嘘でした（見逃し）' : '本当でした')) + '</b>';

      hint.textContent = 'タップで閉じる';
      done = true;
    }, 4300);
    T(close, 11000);
  }

  function check() {
    if (!room) return;
    const hist = (room.state || {}).history || [];
    const last = hist[hist.length - 1];
    if (baseRoom !== room.id) { baseRoom = room.id; seen = last ? last.turn : 0; return; }
    if (!last) { seen = 0; return; }
    if (last.turn <= seen) return;
    seen = last.turn;
    
    if (last.face && !playing) play(last);

　}
  
  const baseRender = render;
  render = function () { baseRender(); check(); };
})();



