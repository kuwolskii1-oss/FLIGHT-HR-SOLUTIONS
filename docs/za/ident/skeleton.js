const { chromium } = require('playwright'); const fs = require('fs');
const dir = process.argv[2];
(async () => {
  const { swoosh, plane } = JSON.parse(fs.readFileSync(dir + '/mark-paths.json', 'utf8'));
  const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1400, height: 520 } });
  await p.setContent(`<canvas id="c" width="1600" height="560"></canvas>`);
  const out = await p.evaluate((swoosh) => {
    const SC = 4, OX = 280, OY = -10, W = 1600, H = 560;
    const c = document.getElementById('c'), g = c.getContext('2d');
    g.setTransform(SC, 0, 0, SC, -OX * SC, -OY * SC); g.fillStyle = '#000'; g.fill(new Path2D(swoosh));
    const img = g.getImageData(0, 0, W, H).data; const inside = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) inside[i] = img[i * 4 + 3] > 127 ? 1 : 0;
    // distance to edge (BFS from boundary, chamfer-ish)
    const dist = new Float32Array(W * H).fill(0); const q = [];
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (!inside[i]) continue; if (!inside[i - 1] || !inside[i + 1] || !inside[i - W] || !inside[i + W]) { dist[i] = 1; q.push(i); } }
    let h = 0; while (h < q.length) { const i = q[h++]; const d = dist[i]; for (const n of [i - 1, i + 1, i - W, i + W]) { if (inside[n] && dist[n] === 0) { dist[n] = d + 1; q.push(n); } } }
    // geodesic farthest points
    function bfs(s) { const D = new Int32Array(W * H).fill(-1); const qq = [s]; D[s] = 0; let hh = 0, far = s; while (hh < qq.length) { const i = qq[hh++]; if (D[i] > D[far]) far = i; for (const n of [i - 1, i + 1, i - W, i + W]) if (inside[n] && D[n] < 0) { D[n] = D[i] + 1; qq.push(n); } } return { D, far }; }
    let seed = -1; for (let i = 0; i < W * H; i++) if (inside[i]) { seed = i; break; }
    const A = bfs(seed).far; const B = bfs(A).far;
    // Dijkstra A->B, cost favours deep pixels
    const cost = new Float64Array(W * H).fill(Infinity); const prev = new Int32Array(W * H).fill(-1); cost[A] = 0;
    // simple binary heap
    const heap = []; const push = (k, i) => { heap.push([k, i]); let j = heap.length - 1; while (j > 0) { const pj = (j - 1) >> 1; if (heap[pj][0] <= heap[j][0]) break; [heap[pj], heap[j]] = [heap[j], heap[pj]]; j = pj; } };
    const pop = () => { const top = heap[0]; const last = heap.pop(); if (heap.length) { heap[0] = last; let j = 0; for (;;) { let l = 2 * j + 1, r = l + 1, m = j; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === j) break; [heap[m], heap[j]] = [heap[j], heap[m]]; j = m; } } return top; };
    push(0, A); let maxD = 0; for (let i = 0; i < W * H; i++) if (dist[i] > maxD) maxD = dist[i];
    while (heap.length) { const [k, i] = pop(); if (k > cost[i]) continue; if (i === B) break; for (const n of [i - 1, i + 1, i - W, i + W]) { if (!inside[n]) continue; const c2 = k + Math.pow((maxD + 1 - dist[n]) / maxD, 3) + 0.01; if (c2 < cost[n]) { cost[n] = c2; prev[n] = i; push(c2, n); } } }
    const path = []; for (let i = B; i !== -1; i = prev[i]) path.push([(i % W) / SC + OX, Math.floor(i / W) / SC + OY]);
    return { path, maxD: maxD / SC, A: [(A % W) / SC + OX, Math.floor(A / W) / SC + OY], B: [(B % W) / SC + OX, Math.floor(B / W) / SC + OY] };
  }, swoosh);
  let P = out.path; // from B to A; orient so it starts at the bottom-left (larger x is the plane end)
  if (P[0][0] > P[P.length - 1][0]) P = P.reverse();
  // resample every ~4 units and smooth
  const rs = [P[0]]; for (const q of P) { const l = rs[rs.length - 1]; if (Math.hypot(q[0] - l[0], q[1] - l[1]) >= 4) rs.push(q); } if (rs[rs.length - 1] !== P[P.length - 1]) rs.push(P[P.length - 1]);
  const sm = rs.map((m, i) => { let sx = 0, sy = 0, n = 0; for (let k = -2; k <= 2; k++) { const q = rs[i + k]; if (q) { sx += q[0]; sy += q[1]; n++; } } return [sx / n, sy / n]; });
  sm[0] = rs[0]; sm[sm.length - 1] = rs[rs.length - 1];
  let d = `M${sm[0][0].toFixed(1)},${sm[0][1].toFixed(1)}`;
  for (let i = 0; i < sm.length - 1; i++) { const p0 = sm[i - 1] || sm[i], p1 = sm[i], p2 = sm[i + 1], p3 = sm[i + 2] || p2; const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]; const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]; d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`; }
  await p.setContent(`<html><body style="margin:0;background:#fff"><svg xmlns="http://www.w3.org/2000/svg" viewBox="280 -10 400 140" width="1400" height="490"><path d="${swoosh}" fill="#ee7203" opacity=".35"/><path d="${plane}" fill="#1c205c" opacity=".35"/><path id="c" d="${d}" fill="none" stroke="#0a0" stroke-width="1"/><path d="${d}" fill="none" stroke="#00f" stroke-width="${(out.maxD * 2.6).toFixed(1)}" opacity=".25" stroke-linecap="round"/></svg></body></html>`);
  const len = await p.$eval('#c', e => e.getTotalLength());
  await p.screenshot({ path: dir + '/overlay3.png' }); await b.close();
  fs.writeFileSync(dir + '/centreline.json', JSON.stringify({ d, length: len, halfWidthMax: out.maxD, points: sm.length, start: sm[0], end: sm[sm.length - 1] }));
  console.log('points', sm.length, 'max half-width', out.maxD.toFixed(2), 'length', len.toFixed(1), 'start', sm[0].map(v => v.toFixed(1)), 'end', sm[sm.length - 1].map(v => v.toFixed(1)), 'dlen', d.length);
})();
