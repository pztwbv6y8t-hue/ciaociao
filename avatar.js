(function () {
  const css = document.createElement('style');
  css.textContent =
    '.fig{display:inline-flex;flex-direction:column;align-items:center;margin:0 2px}' +
    '.fig .f{width:24px;height:24px;border-radius:50%;border:2px solid var(--c);background:#fff center/cover no-repeat}' +
    '.fig .b{width:22px;height:12px;margin-top:-2px;border-radius:9px 9px 3px 3px;background:var(--c)}' +
    '.av{width:40px;height:40px;border-radius:50%;border:3px solid var(--c);background:#ddd center/cover no-repeat;flex:none}' +
    '.cell{min-height:46px}.pl button{width:auto;padding:6px 10px;font-size:13px;margin:0 0 0 auto}';
  document.head.appendChild(css);

  const url = p => p.avatar_path
    ? sb.storage.from('avatars').getPublicUrl(p.avatar_path).data.publicUrl : '';
  const bgi = p => url(p) ? 'background-image:url(' + url(p) + ')' : '';

  bridge = function () {
    let h = '';
    for (let i = 9; i >= 0; i--) {
      const here = players.filter(p => p.pos === i);
      const label = i === 0 ? 'スタート' : i === 9 ? 'ゴール' : i;
      h += '<div class="cell ' + (i === 0 ? 's' : i === 9 ? 'g' : '') + '"><span class="n">' + label + '</span>' +
        here.map(p => '<span class="fig" style="--c:' + COL[p.color] + '"><i class="f" style="' + bgi(p) +
          '"></i><i class="b"></i></span>').join('') + '</div>';
    }
    return '<div class="bridge">' + h + '</div>';
  };

  plist = function (st) {
    return players.map(p => {
      const left = p.hand + (p.pos !== null ? 1 : 0);
      const tags = (st.turn_seat === p.seat && room.status === 'playing' ? ' ←手番' : '') +
        (st.judge_seat === p.seat && st.phase === 'judge' ? ' ⚖判定者' : '') +
        (me && me.seat === p.seat ? '（あなた）' : '');
      const mine = me && me.seat === p.seat;
      return '<div class="pl ' + (st.turn_seat === p.seat ? 'turn' : '') + '">' +
        '<span class="av" style="--c:' + COL[p.color] + ';' + bgi(p) + '"></span>' +
        '<span>' + esc(p.name) + tags + '<br>残り' + left + '個　渡った：' +
        (p.ranks.length ? p.ranks.map(r => '①②③④⑤⑥⑦⑧'[r - 1] || r).join('') : 'なし') + '</span>' +
        (mine ? '<button onclick="document.getElementById(\'pick\').click()">顔写真</button>' : '') +
        '</div>';
    }).join('');
  };

  async function upload(file) {
    try {
      say('画像を処理中…');
      const img = await createImageBitmap(file);
      const s = Math.min(img.width, img.height);
      const c = document.createElement('canvas');
      c.width = 160; c.height = 160;
      const g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, 160, 160);
      g.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 160, 160);
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.8));
      if (!blob || blob.size > 200000) return say('画像が大きすぎます');
      const path = uid + '/' + Date.now() + '.jpg';
      const up = await sb.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg' });
      if (up.error) return say(up.error.message);
      const r = await sb.rpc('set_avatar', { p_code: code, p_path: path });
      if (r.error) return say(r.error.message);
      say('');
      refresh();
    } catch (e) { say('画像を読み込めませんでした'); }
  }

  document.getElementById('pick').addEventListener('change', e => {
    const f = e.target.files[0];
    e.target.value = '';
    if (f) upload(f);
  });
})();
