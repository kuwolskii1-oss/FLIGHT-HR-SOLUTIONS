const { chromium } = require('playwright'); const fs = require('fs');
const dir = process.argv[2];
(async () => {
  const { swoosh, plane } = JSON.parse(fs.readFileSync(dir + '/mark-paths.json', 'utf8'));
  const { d: centre, length: L, end } = JSON.parse(fs.readFileSync(dir + '/centreline.json', 'utf8'));
  const html = `<!doctype html><html><body style="margin:0;background:#fff;font-family:sans-serif">
  <svg id="ident" xmlns="http://www.w3.org/2000/svg" viewBox="288 -8 272 130" width="1088" height="520" style="display:block">
    <defs><clipPath id="sw"><path d="${swoosh}"/></clipPath></defs>
    <g clip-path="url(#sw)"><path id="trail" d="${centre}" fill="none" stroke="#EE7203" stroke-width="12" stroke-linecap="round" stroke-dasharray="${L.toFixed(1)}" stroke-dashoffset="${L.toFixed(1)}"/></g>
    <path id="plane" d="${plane}" fill="#1C205C"/>
  </svg>
  <script>
    const trail = document.getElementById('trail'), planeEl = document.getElementById('plane');
    const L = ${L}; const A = [${end[0]}, ${end[1]}];
    // LUT of points + tangent angles
    const N = 240, pts = [];
    for (let i = 0; i <= N; i++) { const q = trail.getPointAtLength(L * i / N); pts.push([q.x, q.y]); }
    const ang = pts.map((q, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)]; return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; });
    const restAng = ang[N];
    window.setP = (p) => { p = Math.max(0, Math.min(1, p)); trail.setAttribute('stroke-dashoffset', (L * (1 - p)).toFixed(2));
      const f = p * N, i = Math.floor(f), t = f - i, j = Math.min(N, i + 1);
      const x = pts[i][0] + (pts[j][0] - pts[i][0]) * t, y = pts[i][1] + (pts[j][1] - pts[i][1]) * t;
      let a = ang[i] + (ang[j] - ang[i]) * t; const rot = a - restAng;
      planeEl.setAttribute('transform', 'translate(' + (x - A[0]).toFixed(2) + ' ' + (y - A[1]).toFixed(2) + ') rotate(' + rot.toFixed(2) + ' ' + A[0] + ' ' + A[1] + ')'); };
    setP(0);
  </script></body></html>`;
  fs.writeFileSync(dir + '/ident-proto.html', html);
  const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1088, height: 520 } });
  await p.setContent(html);
  const frames = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];
  for (const f of frames) { await p.evaluate((v) => window.setP(v), f); await p.screenshot({ path: `${dir}/ident-${String(Math.round(f * 100)).padStart(3, '0')}.png` }); }
  // contact sheet: 2 columns x 4 rows scaled to 544x260 each
  await p.setViewportSize({ width: 1088, height: 1040 });
  const imgs = frames.map(f => `${dir}/ident-${String(Math.round(f * 100)).padStart(3, '0')}.png`).map(fp => 'data:image/png;base64,' + fs.readFileSync(fp).toString('base64'));
  await p.setContent(`<body style="margin:0;background:#ddd;display:grid;grid-template-columns:1fr 1fr;gap:0">${imgs.map((s, i) => `<div style="position:relative"><img src="${s}" style="width:544px;height:260px;display:block"><span style="position:absolute;left:6px;top:4px;font:12px sans-serif;color:#333">p=${frames[i]}</span></div>`).join('')}</body>`);
  await p.screenshot({ path: dir + '/ident-sheet.png' }); await b.close(); console.log('ok');
})();
