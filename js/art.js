/* Hand-built SVG scenery for the arch scenes. */
window.ART = (function () {
  const f = (n) => n.toFixed(1);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  function palm(flip) {
    seed = flip ? 41 : 7;
    const cx = 92, cy = 92;
    let s = `<svg class="palm${flip ? " palm--r" : ""}" viewBox="0 0 200 420" aria-hidden="true">`;
    // trunk
    s += `<path d="M118 420 C112 320 96 220 ${cx} ${cy}" stroke="#8a6a4a" stroke-width="11" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M118 420 C112 320 96 220 ${cx} ${cy}" stroke="#b08a62" stroke-width="11" fill="none" stroke-dasharray="3 7"/>`;
    const greens = ["#3f7d4e", "#4f9a5a", "#6db36c", "#357045", "#5fa663"];
    const angles = [-178, -158, -140, -118, -96, -74, -52, -30, -8, -128, -64];
    angles.forEach((deg, i) => {
      const a = (deg * Math.PI) / 180, L = 78 + rnd() * 34;
      const ex = cx + Math.cos(a) * L, ey = cy + Math.sin(a) * L + 34 + Math.abs(Math.cos(a)) * 26;
      const qx = cx + Math.cos(a) * L * 0.55, qy = cy + Math.sin(a) * L * 0.55 - 16;
      const col = greens[i % greens.length];
      s += `<path d="M${cx} ${cy} Q${f(qx)} ${f(qy)} ${f(ex)} ${f(ey)}" stroke="#2f5f3a" stroke-width="1.6" fill="none"/>`;
      for (let t = 0.08; t < 0.97; t += 0.045) {
        const px = (1 - t) * (1 - t) * cx + 2 * (1 - t) * t * qx + t * t * ex;
        const py = (1 - t) * (1 - t) * cy + 2 * (1 - t) * t * qy + t * t * ey;
        let tx = 2 * (1 - t) * (qx - cx) + 2 * t * (ex - qx), ty = 2 * (1 - t) * (qy - cy) + 2 * t * (ey - qy);
        const tl = Math.hypot(tx, ty); tx /= tl; ty /= tl;
        const nx = -ty, ny = tx, ll = 26 * (1 - t * 0.72);
        [1, -1].forEach((sg) => {
          let dx = tx * 0.75 + nx * sg, dy = ty * 0.75 + ny * sg + 0.55;
          const dl = Math.hypot(dx, dy); dx /= dl; dy /= dl;
          s += `<path d="M${f(px)} ${f(py)} q${f(dx * ll * 0.5 + 2)} ${f(dy * ll * 0.5 - 2)} ${f(dx * ll)} ${f(dy * ll)}" stroke="${col}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
        });
      }
    });
    s += `<circle cx="${cx}" cy="${cy + 6}" r="7" fill="#7a5a36"/><circle cx="${cx + 8}" cy="${cy + 9}" r="6" fill="#8e6a40"/></svg>`;
    return s;
  }

  function balustrade() {
    let s = `<svg class="balu" viewBox="0 0 600 170" preserveAspectRatio="xMidYMax slice" aria-hidden="true">`;
    seed = 3;
    // hedge
    for (let x = -10; x < 620; x += 13) {
      const r = 12 + rnd() * 10, y = 46 + rnd() * 8;
      const g = ["#3d7a3f", "#4b8b45", "#5b9c4f", "#2f6a36"][Math.floor(rnd() * 4)];
      s += `<circle cx="${x}" cy="${f(y)}" r="${f(r)}" fill="${g}"/>`;
      if (rnd() > 0.55) s += `<circle cx="${f(x + 4)}" cy="${f(y - 8)}" r="2.6" fill="${rnd() > 0.5 ? "#f0c6c6" : "#fff4e0"}"/>`;
    }
    s += `<rect x="0" y="60" width="600" height="14" fill="#b8553f"/><rect x="0" y="60" width="600" height="3" fill="#d77a5f"/>`;
    s += `<rect x="0" y="74" width="600" height="96" fill="#9a3f2f"/>`;
    for (let x = 6; x < 600; x += 22) {
      if (x % 150 < 22) { s += `<rect x="${x - 4}" y="74" width="26" height="96" fill="#b8553f"/><rect x="${x - 4}" y="74" width="5" height="96" fill="#cf6d55"/>`; continue; }
      s += `<path d="M${x + 3} 78 h10 c0 8 6 10 6 26 c0 14 -6 22 -4 34 h-14 c2 -12 -4 -20 -4 -34 c0 -16 6 -18 6 -26z" fill="#c2604a"/>`;
      s += `<path d="M${x + 5} 82 c0 8 -3 12 -3 22" stroke="#e08b6f" stroke-width="2" fill="none"/>`;
    }
    s += `<rect x="0" y="146" width="600" height="24" fill="#b04c38"/><rect x="0" y="146" width="600" height="3" fill="#d77a5f"/></svg>`;
    return s;
  }

  function feather(rot, cls) {
    seed = 11 + Math.round(rot * 3);
    let s = `<svg class="feather ${cls || ""}" viewBox="0 0 160 420" style="--r:${rot}deg" aria-hidden="true"><g>`;
    s += `<path d="M80 418 C78 300 80 180 80 70" stroke="#c9b27a" stroke-width="2.4" fill="none"/>`;
    for (let y = 120; y < 410; y += 4) {
      const k = 1 - (y - 120) / 300, len = 30 + 26 * k;
      const g = `hsl(${105 + rnd() * 30} 45% ${32 + rnd() * 14}%)`;
      s += `<path d="M80 ${y} q${f(-len * 0.6)} ${f(-10 - rnd() * 8)} ${f(-len)} ${f(-28 - k * 8)}" stroke="${g}" stroke-width="1.2" fill="none" opacity=".85"/>`;
      s += `<path d="M80 ${y} q${f(len * 0.6)} ${f(-10 - rnd() * 8)} ${f(len)} ${f(-28 - k * 8)}" stroke="${g}" stroke-width="1.2" fill="none" opacity=".85"/>`;
    }
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2, r1 = 34, r2 = 58 + rnd() * 16;
      s += `<path d="M${f(80 + Math.cos(a) * r1)} ${f(78 + Math.sin(a) * r1 * 1.3)} L${f(80 + Math.cos(a) * r2)} ${f(78 + Math.sin(a) * r2 * 1.25)}" stroke="hsl(${100 + rnd() * 40} 50% ${35 + rnd() * 15}%)" stroke-width="1.3"/>`;
    }
    s += `<ellipse cx="80" cy="80" rx="36" ry="47" fill="#5b8f3e"/><ellipse cx="80" cy="82" rx="29" ry="39" fill="#cfa63c"/><ellipse cx="80" cy="84" rx="23" ry="31" fill="#2a9a8c"/><ellipse cx="80" cy="86" rx="17" ry="23" fill="#8a4a24"/><path d="M80 70 c12 0 14 14 10 22 c-3 7 -7 10 -10 14 c-3 -4 -7 -7 -10 -14 c-4 -8 -2 -22 10 -22z" fill="#1b2b78"/><ellipse cx="76" cy="80" rx="3" ry="5" fill="#3d56c2" opacity=".7"/>`;
    s += `</g></svg>`;
    return s;
  }

  function pillar() {
    seed = 19;
    let s = `<svg class="pillar" viewBox="0 0 90 520" preserveAspectRatio="xMidYMax meet" aria-hidden="true">`;
    s += `<rect x="12" y="0" width="66" height="22" rx="3" fill="#f4efe6"/><rect x="18" y="22" width="54" height="10" fill="#e3dccf"/>`;
    s += `<rect x="24" y="32" width="42" height="440" fill="#faf7f1"/><rect x="24" y="32" width="9" height="440" fill="#e6dfd2"/><rect x="57" y="32" width="9" height="440" fill="#ece6db"/>`;
    s += `<rect x="16" y="472" width="58" height="16" fill="#e8e1d4"/><rect x="10" y="488" width="70" height="32" fill="#f4efe6"/>`;
    for (let y = 40; y < 470; y += 22) {
      const x = 45 + Math.sin(y / 34) * 22;
      s += `<path d="M${f(x)} ${y} q-10 6 -6 16" stroke="#6fa45a" stroke-width="2.4" fill="none"/>`;
      s += `<circle cx="${f(x)}" cy="${y}" r="${f(5 + rnd() * 3)}" fill="${["#e46b9b", "#f4a3c0", "#ffffff", "#d9467f"][Math.floor(rnd() * 4)]}"/>`;
    }
    for (let i = 0; i < 14; i++) s += `<circle cx="${f(10 + rnd() * 70)}" cy="${f(rnd() * 26)}" r="${f(5 + rnd() * 6)}" fill="${["#e46b9b", "#f7b8cf", "#fff", "#c93c74", "#7cb15f"][Math.floor(rnd() * 5)]}"/>`;
    return s + `</svg>`;
  }

  function lights() {
    let s = `<svg class="lights" viewBox="0 0 400 140" preserveAspectRatio="none" aria-hidden="true">`;
    const ropes = [[0, 10, 200, 70, 400, 10], [0, 40, 200, 110, 400, 40], [40, 0, 200, 46, 360, 0]];
    ropes.forEach(([x0, y0, cx, cy, x1, y1], r) => {
      s += `<path d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}" stroke="#8b7a5a" stroke-width=".8" fill="none" opacity=".6"/>`;
      for (let t = 0.03; t < 1; t += 0.045) {
        const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
        const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
        s += `<circle class="tw" style="--d:${f((t * 7 + r) % 3)}s" cx="${f(x)}" cy="${f(y + 3)}" r="2.2" fill="#fff3c4"/>`;
      }
    });
    return s + `</svg>`;
  }

  function birds() {
    let s = `<svg class="birds" viewBox="0 0 120 50" aria-hidden="true">`;
    [[10, 20, 1], [26, 12, .8], [40, 24, .9], [52, 8, .7], [64, 18, .85], [78, 26, .75], [90, 14, .6], [34, 34, .7]].forEach(([x, y, k]) => {
      s += `<path class="wing" d="M${x} ${y} q${4 * k} ${-4 * k} ${8 * k} 0 q${4 * k} ${-4 * k} ${8 * k} 0" stroke="#3b3b4a" stroke-width="1.4" fill="none"/>`;
    });
    return s + `</svg>`;
  }

  function diya(x) {
    return `<svg class="diya" style="left:${x}%" viewBox="0 0 40 40" aria-hidden="true"><ellipse class="flame" cx="20" cy="14" rx="4" ry="9" fill="#ffcf5a"/><ellipse cx="20" cy="16" rx="2" ry="5" fill="#fff4c2"/><path d="M4 24 q16 14 32 0 z" fill="#b3542c"/><path d="M4 24 h32" stroke="#e0915a" stroke-width="2"/></svg>`;
  }

  function mehndiHands() {
    // simple decorative paisley cluster
    return `<svg class="paisley" viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="#7a3b16" stroke-width="1.6"><path d="M60 20 c30 0 44 30 30 56 c-12 22 -44 26 -56 8 c-10 -16 4 -34 20 -28 c12 4 12 20 2 22"/><path d="M60 32 c22 2 30 24 20 42 c-8 14 -30 16 -38 4"/><circle cx="58" cy="64" r="5"/><path d="M40 92 q20 10 44 -4"/></g></svg>`;
  }

  return { palm, balustrade, feather, pillar, lights, birds, diya, mehndiHands };
})();
