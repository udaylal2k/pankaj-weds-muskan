/* Pankaj & Muskan — the invitation plays like a film: scenes in sequence, words line by line, full-screen transitions. */
(function () {
  const W = window.WEDDING;
  const q = new URLSearchParams(location.search).get("side") || "";
  const sideId = ["muskan", "bride", "m"].includes(q.toLowerCase()) ? "bride" : "groom";
  const S = W.sides[sideId];
  document.title = `${S.first} & ${S.second} — Wedding Invitation`;
  document.getElementById("fav").href = S.favicon;
  document.querySelectorAll("[data-first]").forEach((e) => (e.textContent = S.first));
  document.querySelectorAll("[data-second]").forEach((e) => (e.textContent = S.second));
  const $ = (id) => document.getElementById(id);
  const stage = $("stage"), win = $("win"), txt = $("txt"), fx = $("fx"), mono = $("mono"), ambient = $("ambient");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const EASE = "cubic-bezier(.2,.7,.2,1)";

  /* Each painting's own sky colour, so the words sit on clean sky */
  const SKY = { invite: "#fcf0d6", court: "#8ec8f9", savedate: "#56b7fb", bairana: "#dda5cc", mehndi: "#6eb5b7", haldi: "#2198fd", reception: "#4a5e9e", baraat: "#e698c0", wedding: "#329cfa", closing: "#f6ad82" };
  const SHORT = { residence: "Teela Jamalpura, Bhopal", brideResidence: "Fefartal, Narmadapuram", resort: "Khajoori Sadak, Bhopal" };

  /* optional painted assets: used when present */
  const ASSET = {};
  ["ornament.webp", "ganesha.png", "curtain.webp", "petal.webp", "feather.webp", "marigold.webp", "strand.png", "feather_wall.webp", "hand_left.webp", "hand_right.webp", "glass_left.webp", "glass_right.webp", "garland.png", "diya.png", "ladi.png", "lights.png", "rose.png"].forEach((f) => {
    const im = new Image(); im.onload = () => { ASSET[f] = im.src; if (f === "ornament.webp") stage.style.setProperty("--ornament", `url(${im.src})`); if ((f === "curtain.webp" && !ASSET["strand.png"]) || f === "strand.png") buildCurtain(); };
    im.src = "assets/" + f;
  });
  stage.style.backgroundSize = "";
  const orn = new Image(); orn.onload = () => { stage.style.background = `url(${orn.src}) center/150px auto, #f7efe1`; }; orn.src = "assets/ornament.webp";

  /* ---------- the scalloped gold rim follows the arch at any size ---------- */
  const CAP = "A13.2 13.2 0 0 1 5.8 53.5 A13.4 13.4 0 0 1 21.4 38.4 A15.9 15.9 0 0 1 44.1 26.6 A18.1 18.1 0 0 1 71.2 15.9 A19.3 19.3 0 0 1 100.0 4.0 A19.3 19.3 0 0 1 128.8 15.9 A18.1 18.1 0 0 1 155.9 26.6 A15.9 15.9 0 0 1 178.6 38.4 A13.4 13.4 0 0 1 194.2 53.5 A13.2 13.2 0 0 1 200.0 74.0";
  function rim() {
    const r = win.getBoundingClientRect(); const H = (200 * r.height) / r.width;
    $("rim").setAttribute("viewBox", `0 0 200 ${H.toFixed(2)}`);
    $("rimPath").setAttribute("d", `M0 ${H} L0 74.0 ${CAP} L200 ${H} Z`);
  }
  addEventListener("resize", rim); rim();

  /* ---------- clock: pausable waits, so the whole film can pause and skip ---------- */
  let token = 0, paused = false, sceneElapsed = 0;
  function wait(ms) {
    const my = token;
    return new Promise((res) => {
      let acc = 0, last = performance.now();
      (function f(now) {
        if (my !== token) return;              // scene was skipped: never resolve
        const dt = now - last; last = now;
        if (!paused) { acc += dt; sceneElapsed += dt; }
        if (acc >= ms) res(); else requestAnimationFrame(f);
      })(last);
    });
  }
  const anim = (el, frames, opts) => (reduce ? (Object.assign(el.style, frames[frames.length - 1]), { finished: Promise.resolve() }) : el.animate(frames, Object.assign({ fill: "forwards", easing: EASE }, opts)));

  /* ---------- words ---------- */
  function lines(spec, top, gap) {
    txt.innerHTML = ""; txt.style.setProperty("--top", top || "13%"); txt.style.setProperty("--gap", gap || "1.1cqw");
    return spec.map(([cls, html]) => { const d = document.createElement(cls === "img" ? "img" : "div"); if (cls === "img") { d.src = html; d.className = "l t-ganesha"; d.alt = ""; } else { d.className = "l " + cls; d.innerHTML = html; } txt.appendChild(d); return d; });
  }
  function fit() { // shrink any line that would be cut
    txt.querySelectorAll(".t-title,.t-name,.t-big,.t-shloka").forEach((el) => {
      let fs = parseFloat(getComputedStyle(el).fontSize), max = txt.clientWidth;
      for (let i = 0; i < 30 && el.scrollWidth > max; i++) { fs *= 0.95; el.style.fontSize = fs + "px"; }
    });
  }
  const SOFT = "cubic-bezier(.16,1,.3,1)";   // long, gentle settle
  function reveal(el) {
    const c = el.className;
    if (/t-title|t-name|t-big/.test(c)) {
      return anim(el, [{ opacity: 1, clipPath: "inset(-35% 100% -35% -8%)", transform: "scale(1.04)" }, { opacity: 1, clipPath: "inset(-35% -8% -35% -8%)", transform: "scale(1)" }], { duration: 2000, easing: "cubic-bezier(.45,0,.2,1)" });
    }
    if (/t-ganesha|t-om/.test(c)) return anim(el, [{ opacity: 0, transform: "scale(.82)", filter: "drop-shadow(0 0 0 rgba(255,210,120,0))" }, { opacity: 1, transform: "scale(1)", filter: "drop-shadow(0 0 18px rgba(255,210,120,.9))", offset: .7 }, { opacity: 1, transform: "scale(1)", filter: "drop-shadow(0 0 6px rgba(255,210,120,.5))" }], { duration: 2200, easing: SOFT });
    if (/t-caps|t-k|t-tag|t-time/.test(c)) return anim(el, [{ opacity: 0, letterSpacing: "0.45em", transform: "translateY(1cqw)" }, { opacity: 1, letterSpacing: getComputedStyle(el).letterSpacing, transform: "none" }], { duration: 1500, easing: SOFT });
    if (/rule/.test(c)) return anim(el, [{ opacity: 0, transform: "scaleX(0)" }, { opacity: 1, transform: "scaleX(1)" }], { duration: 1200, easing: SOFT });
    return anim(el, [{ opacity: 0, transform: "translateY(2cqw)" }, { opacity: 1, transform: "none" }], { duration: 1300, easing: SOFT });
  }
  async function play(els, step) { for (const el of els) { reveal(el); await wait(step || 620); } }
  async function clearText(ms = 700) {
    const els = [...txt.children]; if (!els.length) return;
    els.forEach((el, i) => anim(el, [{ opacity: getComputedStyle(el).opacity, transform: "none" }, { opacity: 0, transform: "translateY(-1.5cqw)" }], { duration: ms, delay: i * 25, easing: "cubic-bezier(.4,0,.6,1)" }));
    await wait(ms); txt.innerHTML = "";
  }

  /* ---------- painted backgrounds: a camera push from one scene into the next ---------- */
  let front = $("bgA"), back = $("bgB"), curBg = "invite";
  function bloom() { // a warm wash of light at the moment of a cut
    if (reduce) return;
    const d = document.createElement("div"); d.className = "bloom"; fx.appendChild(d);
    d.animate([{ opacity: 0 }, { opacity: 0.35, offset: 0.4 }, { opacity: 0 }], { duration: 1500, easing: "ease-in-out" }).finished.then(() => d.remove());
  }
  const INK = { haldi: "#55661a", mehndi: "#4f6a24", wedding: "#7a2a5c", reception: "#f3d48c", baraat: "#8a2346", bairana: "#7a2a3e", savedate: "#7a1622", closing: "#7a1622", invite: "#7a1622", court: "#7a1622" };
  function setBg(name, instant) {
    win.style.setProperty("--sky", SKY[name] || "#f6e6cf"); win.style.setProperty("--ink-title", INK[name] || "#7a1622");
    const HAZE = { haldi: .6, wedding: .6, court: .5, savedate: .55, mehndi: .5, reception: 0, invite: 0 };
    win.style.setProperty("--haze", HAZE[name] ?? .3); win.classList.toggle("dark", name === "reception");
    $("bd").src = `scenes/${name}.webp`;
    if (name === curBg && front.classList.contains("on")) return;
    curBg = name; back.src = `scenes/${name}.webp`;
    const go = () => {
      const out = front, inn = back;
      inn.classList.add("on"); out.classList.remove("on");
      out.getAnimations().forEach((a) => a.cancel()); inn.getAnimations().forEach((a) => a.cancel());
      if (instant || reduce) { inn.style.opacity = 1; out.style.opacity = 0; drift(inn); }
      else {
        out.style.opacity = ""; inn.style.opacity = "";
        out.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1300, easing: "ease-in-out", fill: "forwards" });
        inn.animate([{ opacity: 0, transform: "scale(1.025)" }, { opacity: 1, transform: "scale(1)" }], { duration: 1500, easing: "ease-out", fill: "forwards" }).finished.then(() => drift(inn)).catch(() => {});
      }
      [front, back] = [back, front];
    };
    back.complete && back.naturalWidth ? go() : (back.onload = () => { back.onload = null; go(); });
  }
  function drift(el) { if (!reduce) el.animate([{ transform: "scale(1)" }, { transform: "scale(1.03)" }], { duration: 16000, easing: "ease-in-out", fill: "forwards" }); }

  /* ---------- each scene's own decoration (or none) ---------- */
  const deco = $("garland"); let decoKind = null;
  const DECO = { wedding: "garland.png", haldi: "ladi.png", reception: "lights.png" };
  function setDeco(kind) {
    const src = kind && ASSET[DECO[kind]];
    if ((src || null) === decoKind) return;
    const show = () => {
      decoKind = src || null; deco.className = "garland deco-" + (kind || "none");
      if (!src) return;
      deco.src = src;
      anim(deco, [{ transform: "translateY(-115%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: 1600, easing: "cubic-bezier(.3,1.2,.45,1)" });
    };
    if (decoKind) anim(deco, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 }).finished.then(show); else show();
    win.classList.toggle("has-garland", !!src);
  }

  /* ---------- living skies ---------- */
  let ambTimer = null;
  const BIRDS = `<svg class="birds" viewBox="0 0 120 50" aria-hidden="true">${[[10,20,1],[26,12,.8],[40,24,.9],[52,8,.7],[64,18,.85],[78,26,.75],[90,14,.6],[34,34,.7]].map(([x,y,k],i)=>`<path style="animation-delay:-${i*0.13}s" d="M${x} ${y} q${4*k} ${-4*k} ${8*k} 0 q${4*k} ${-4*k} ${8*k} 0"/>`).join("")}</svg>`;
  function setAmbient(kind, birds) {
    clearInterval(ambTimer); ambient.innerHTML = ""; if (reduce) return;
    if (birds) ambient.insertAdjacentHTML("beforeend", BIRDS);
    if (!kind) return;
    const PAL = { pink: ["#f4a1bb", "#e9638e", "#f8c9d6", "#c9234a"], yellow: ["#ffd23f", "#ffb000", "#ffe580"], marigold: ["#ff9f1c", "#f26b1d", "#ffbf3f"], green: ["#7fae55", "#f4c542", "#e46b9b"] };
    if (kind === "glow" || kind === "diyas" || kind === "fireworks") {
      for (let i = 0; i < 12; i++) ambient.insertAdjacentHTML("beforeend", `<b style="left:${(i * 8.3) % 96}%;--s:${1 + (i % 3)}cqw;--t:${7 + (i % 4)}s;--d:-${i * 0.7}s"></b>`);
      if (kind === "diyas" && ASSET["diya.png"]) for (let i = 0; i < 5; i++) ambient.insertAdjacentHTML("beforeend", `<img class="float-diya" src="${ASSET["diya.png"]}" alt="" style="left:${8 + i * 19}%;--t:${13 + (i % 3) * 3}s;--d:-${i * 3.1}s;--s:${6 + (i % 2) * 2}cqw">`);
      if (kind === "fireworks") { firework(); ambTimer = setInterval(() => { if (!paused) firework(); }, 1500); }
      return;
    }
    if (kind === "red" && ASSET["petal.webp"]) { for (let i = 0; i < 12; i++) ambient.insertAdjacentHTML("beforeend", `<img src="${ASSET["petal.webp"]}" alt="" style="left:${(i * 8.7 + 3) % 98}%;--s:${2.6 + (i % 3) * 0.9}cqw;--t:${8 + (i % 5)}s;--d:-${i * 0.9}s">`); return; }
    const pal = PAL[kind];
    for (let i = 0; i < 12; i++) ambient.insertAdjacentHTML("beforeend", `<i style="left:${(i * 8.7 + 3) % 98}%;--s:${1.8 + (i % 3) * 0.7}cqw;--t:${8 + (i % 5)}s;--d:-${i * 0.9}s;--c:${pal[i % pal.length]}"></i>`);
  }
  function firework() { // a soft burst of gold and rose sparks in the evening sky
    const x = rnd(18, 82), y = rnd(10, 30), n = 30, col = ["#ffe39a", "#ffd0dc", "#fff4cf", "#ffb36b"][Math.floor(rnd(0, 4))];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span"); s.className = "spark"; s.style.left = x + "%"; s.style.top = y + "%"; s.style.background = col; ambient.appendChild(s);
      const a = (i / n) * Math.PI * 2, r = rnd(12, 20);
      s.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * r}cqw,${Math.sin(a) * r + 3}cqw) scale(.4)`, opacity: 0 }], { duration: rnd(1300, 1800), easing: "cubic-bezier(.1,.7,.3,1)", fill: "forwards" }).finished.then(() => s.remove());
    }
  }

  /* ---------- transitions that fly out of the screen, towards you ---------- */
  const rnd = (a, b) => a + Math.random() * (b - a);
  function toCamera(make, n, spread = 1, dur = [1500, 2300]) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const el = make(i); el.classList.add("cam"); fx.appendChild(el);
      const ang = rnd(0, Math.PI * 2), dist = rnd(55, 95) * spread;
      const x0 = rnd(-12, 12), y0 = rnd(-14, 10), r0 = rnd(-60, 60), r1 = r0 + rnd(-220, 220), s1 = rnd(2.4, 4.2);
      el.animate([
        { transform: `translate3d(${x0}cqw,${y0}cqh,0) scale(.04) rotate(${r0}deg)`, opacity: 0 },
        { opacity: 1, offset: 0.18 },
        { transform: `translate3d(${x0 + Math.cos(ang) * dist}cqw,${y0 + Math.sin(ang) * dist}cqh,0) scale(${s1}) rotate(${r1}deg)`, opacity: 1 }
      ], { duration: rnd(dur[0], dur[1]), delay: rnd(0, 650), easing: "cubic-bezier(.55,.05,.75,.4)", fill: "both" }).finished.then(() => el.remove());
    }
  }
  const imgEl = (src, w) => () => { const im = document.createElement("img"); im.src = src; im.style.width = w + "cqw"; im.style.marginLeft = -w / 2 + "cqw"; im.style.marginTop = -w / 2 + "cqw"; return im; };
  const dotEl = (cols, w, round) => (i) => { const d = document.createElement("i"); const ww = rnd(w * 0.6, w * 1.2); Object.assign(d.style, { width: ww + "cqw", height: (round ? ww : ww * 0.68) + "cqw", marginLeft: -ww / 2 + "cqw", marginTop: -ww / 2 + "cqw", background: round ? `radial-gradient(circle, ${cols[i % cols.length]} 0 35%, rgba(255,230,160,0) 70%)` : cols[i % cols.length], borderRadius: round ? "50%" : "50% 0 50% 0" }); return d; };
  function featherZoom() { // the painted peacock-feather frame closes in, then the camera flies through its opening
    if (reduce) return Promise.resolve();
    const im = document.createElement("img"); im.src = "scenes/feathers.webp"; im.className = "featherframe";
    fx.appendChild(im);
    im.animate([{ opacity: 0, transform: "scale(1.7) rotate(-4deg)" }, { opacity: 1, transform: "scale(1) rotate(0)", offset: 0.38 }, { opacity: 1, transform: "scale(1)", offset: 0.52 }, { opacity: 0, transform: "scale(8)" }], { duration: 2900, easing: "cubic-bezier(.55,0,.35,1)", fill: "forwards" }).finished.then(() => im.remove());
    return wait(1450);
  }
  function diyasRise(n) { // lit diyas drift up through the frame
    if (reduce || !ASSET["diya.png"]) return;
    for (let i = 0; i < n; i++) {
      const im = document.createElement("img"); im.src = ASSET["diya.png"]; const s = rnd(7, 14);
      Object.assign(im.style, { width: s + "cqw", left: rnd(2, 88) + "%", top: "100%", filter: "drop-shadow(0 0 12px rgba(255,190,80,.9))" });
      fx.appendChild(im);
      im.animate([{ transform: "translate3d(0,0,0) scale(.85)", opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: `translate3d(${rnd(-6, 6)}cqw,-125cqh,0) scale(1.05)`, opacity: 0 }], { duration: rnd(3200, 4400), delay: rnd(0, 900), easing: "cubic-bezier(.3,.2,.5,1)", fill: "both" }).finished.then(() => im.remove());
    }
  }
  const PETAL = () => ASSET["petal.webp"] || null;
  /* A wall of painted objects slides across the whole screen, right to left; the next scene waits behind it. */
  function wall(src, o) {
    if (reduce) return { cover: Promise.resolve(), done: Promise.resolve() };
    const r = stage.getBoundingClientRect(), Wd = r.width, Ht = r.height;
    const span = 1.7, w = document.createElement("div"); w.className = "wall";
    Object.assign(w.style, { width: Wd * span + "px", background: o.ground || "transparent" });
    const cell = Wd * o.cell, cols = Math.ceil((Wd * span) / cell) + 1, rows = Math.ceil(Ht / (cell * (o.rowK || 1))) + 1;
    let k = 0;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const im = document.createElement("img"); im.src = src; const sz = cell * rnd(o.min, o.max);
      Object.assign(im.style, { width: sz + "px", left: x * cell + (y % 2 ? cell / 2 : 0) - sz / 2 + rnd(-cell * 0.12, cell * 0.12) + "px", top: y * cell * (o.rowK || 1) - sz * (o.tall || 1) / 2 + rnd(-cell * 0.12, cell * 0.12) + "px", transform: `rotate(${rnd(-o.rot, o.rot)}deg)`, zIndex: (k++ % 7) });
      w.appendChild(im);
    }
    fx.appendChild(w);
    const dur = o.dur || 2600;
    const a = w.animate([{ transform: `translate3d(${Wd}px,0,0)` }, { transform: `translate3d(${-Wd * span}px,0,0)` }], { duration: dur, easing: "cubic-bezier(.42,0,.58,1)", fill: "forwards" });
    a.finished.then(() => w.remove()).catch(() => w.remove());
    return { cover: wait(dur * 0.5), done: wait(dur) };
  }
  /* Petals start falling, grow denser and bigger until they fill the screen, then fall away. */
  function petalStorm(src) {
    if (reduce) return { cover: Promise.resolve(), done: Promise.resolve() };
    const waves = [[18, 4, 8, 0, 900], [22, 9, 16, 500, 1300], [16, 22, 40, 1000, 1500], [10, 55, 95, 1350, 1100]];
    waves.forEach(([n, s0, s1, t0, spreadT]) => { for (let i = 0; i < n; i++) {
      const im = document.createElement("img"); im.src = src; im.className = "storm"; const s = rnd(s0, s1);
      Object.assign(im.style, { width: s + "cqw", left: rnd(-s * 0.6, 100 - s * 0.3) + "%", top: -s * 1.2 + "cqw" });
      fx.appendChild(im);
      const sway = rnd(-18, 18), rot = rnd(-180, 180), big = s > 40;
      im.animate([{ transform: "translate3d(0,0,0) rotate(0deg)" }, { transform: `translate3d(${sway}cqw,${big ? 70 : 60}cqh,0) rotate(${rot / 2}deg)`, offset: 0.5 }, { transform: `translate3d(${-sway / 2}cqw,${big ? 175 : 135}cqh,0) rotate(${rot}deg)` }], { duration: big ? rnd(2000, 2500) : rnd(2400, 3400), delay: t0 + rnd(0, spreadT), easing: big ? "cubic-bezier(.4,.1,.6,.9)" : "linear", fill: "both" }).finished.then(() => im.remove());
    } });
    return { cover: wait(2050), done: wait(3400) };
  }
  /* The video's signature move: a wall of painted peacock feathers sweeps in, two mehndi hands glide across it, then all of it slides away. */
  async function featherHands(toScene) {
    if (reduce || !ASSET["feather_wall.webp"]) return false;
    const box = document.createElement("div"); box.className = "fh";
    box.innerHTML = `<div class="fh__wall" style="background-image:url(${ASSET["feather_wall.webp"]})"></div>` +
      (ASSET["hand_right.webp"] ? `<img class="fh__r" src="${ASSET["hand_right.webp"]}" alt="">` : "") +
      (ASSET["hand_left.webp"] ? `<img class="fh__l" src="${ASSET["hand_left.webp"]}" alt="">` : "");
    fx.appendChild(box);
    box.animate([{ transform: "translate3d(100%,0,0)" }, { transform: "translate3d(0,0,0)" }], { duration: 850, easing: "cubic-bezier(.2,.7,.25,1)", fill: "forwards" });
    const r = box.querySelector(".fh__r"), l = box.querySelector(".fh__l");
    if (r) r.animate([{ transform: "translate3d(70%,0,0) rotate(-4deg)" }, { transform: "translate3d(0,0,0) rotate(0deg)" }], { duration: 2800, delay: 650, easing: "cubic-bezier(.22,.8,.3,1)", fill: "both" });
    if (l) l.animate([{ transform: "translate3d(-70%,0,0) rotate(4deg)" }, { transform: "translate3d(0,0,0) rotate(0deg)" }], { duration: 2800, delay: 900, easing: "cubic-bezier(.22,.8,.3,1)", fill: "both" });
    await wait(1000); setBg(toScene, true);
    await wait(2900);
    box.getAnimations().forEach((a) => a.commitStyles && a.commitStyles());
    box.animate([{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(-105%,0,0)" }], { duration: 950, easing: "cubic-bezier(.55,0,.75,.3)", fill: "forwards" }).finished.then(() => box.remove());
    await wait(700); return true;
  }
  /* Two hands raise glasses from the bottom corners and clink in the middle. */
  async function glassesClink(toScene) {
    if (reduce || !ASSET["glass_left.webp"] || !ASSET["glass_right.webp"]) return false;
    const box = document.createElement("div"); box.className = "gl";
    box.innerHTML = `<img class="gl__l" src="${ASSET["glass_left.webp"]}" alt=""><img class="gl__r" src="${ASSET["glass_right.webp"]}" alt="">`;
    fx.appendChild(box);
    const [l, r] = box.children;
    l.animate([{ transform: "translate3d(-60%,70%,0) rotate(18deg)" }, { transform: "translate3d(0,0,0) rotate(0deg)" }], { duration: 1500, easing: "cubic-bezier(.2,.8,.3,1)", fill: "both" });
    r.animate([{ transform: "translate3d(60%,70%,0) rotate(-18deg)" }, { transform: "translate3d(0,0,0) rotate(0deg)" }], { duration: 1500, delay: 120, easing: "cubic-bezier(.2,.8,.3,1)", fill: "both" });
    await wait(1600);
    // the clink: a small sparkle where the glasses meet
    for (let i = 0; i < 18; i++) { const sp = document.createElement("span"); sp.className = "spark"; sp.style.left = "50%"; sp.style.top = "38%"; sp.style.background = "#fff2c4"; fx.appendChild(sp);
      const a = (i / 18) * Math.PI * 2, rr = rnd(7, 13); sp.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * rr}cqw,${Math.sin(a) * rr}cqw) scale(.3)`, opacity: 0 }], { duration: 900, easing: "cubic-bezier(.1,.7,.3,1)", fill: "forwards" }).finished.then(() => sp.remove()); }
    await wait(700); setBg(toScene); bloom();
    l.animate([{ opacity: 1 }, { opacity: 0, transform: "translate3d(-30%,40%,0) rotate(10deg)" }], { duration: 1000, easing: "ease-in", fill: "forwards" });
    r.animate([{ opacity: 1 }, { opacity: 0, transform: "translate3d(30%,40%,0) rotate(-10deg)" }], { duration: 1000, easing: "ease-in", fill: "forwards" }).finished.then(() => box.remove());
    await wait(900); return true;
  }
  async function transition(kind, toScene) {
    if (kind === "featherhands" && await featherHands(toScene)) return;
    if (kind === "glasses" && await glassesClink(toScene)) return;
    if (kind === "featherhands") kind = "feathers";
    if (kind === "glasses") kind = "gold";
    const go = () => setBg(toScene, true);
    if (kind === "feathers" && ASSET["feather.webp"]) { const t = wall(ASSET["feather.webp"], { cell: 0.17, min: 1.1, max: 1.5, rot: 22, rowK: 1.55, tall: 2.3, ground: "#2f6b57", dur: 2800 }); await t.cover; go(); await wait(250); return; }
    if (kind === "marigold") { const t = wall(ASSET["marigold.webp"] || "scenes/marigold.png", { cell: 0.27, min: 1.15, max: 1.45, rot: 40, ground: "#e9871c", dur: 2600 }); await t.cover; go(); await wait(250); return; }
    if (kind === "rose") { const t = petalStorm(ASSET["petal.webp"]); await t.cover; go(); await wait(700); return; }
    if (kind === "diyas") { diyasRise(16); await wait(500); setBg(toScene); bloom(); await wait(900); return; }
    if (kind === "gold") { bloom(); await wait(250); setBg(toScene); await wait(900); return; }
    setBg(toScene); bloom(); await wait(800);
  }

  /* ---------- the scenes ---------- */
  const calUrl = (c, v) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(c.title + " · " + S.first + " & " + S.second)}&dates=${c.start}/${c.end}&ctz=Asia/Kolkata&location=${encodeURIComponent(v.address)}&details=${encodeURIComponent(c.details)}`;
  const pFirst = sideId === "groom" ? W.parents.groom : W.parents.bride;
  const pSecond = sideId === "groom" ? W.parents.bride : W.parents.groom;
  const events = [...S.firstEvents, ...W.sharedEvents];
  const dates = [...new Set(events.map((e) => e.date))];
  const TIN = { bairana: "diyas", mehndi: "featherhands", haldi: "marigold", reception: "glasses", baraat: "gold", wedding: "rose" };
  const AMB = { bairana: ["diyas", true], mehndi: ["green", false], haldi: ["yellow", true], reception: ["glow", false], baraat: ["fireworks", false], wedding: ["red", true] };

  const SC = [];
  SC.push({ id: "shloka", dur: 7500, async run() {
    setBg("invite"); setAmbient("glow"); setDeco(null); anim(mono, [{ opacity: 0 }], { duration: 10 });
    const els = lines([[ASSET["ganesha.png"] ? "img" : "t-om", ASSET["ganesha.png"] ? "assets/ganesha.png" : "ॐ"], ["t-shloka", `${W.shloka[0]}<br>${W.shloka[1]}`], ["t-deva", "॥ श्री गणेशाय नमः ॥"]], "13%", "3cqw");
    fit(); await wait(400); await play(els, 1100);
  } });
  SC.push({ id: "monogram", dur: 3800, async run() {
    setBg("invite"); await clearText(800);
    // the monogram arrives large in the middle, glows, then glides up to its place
    anim(mono, [{ opacity: 0, transform: "translateY(42cqh) scale(.3)", filter: "drop-shadow(0 0 0 rgba(255,215,130,0))" }, { opacity: 1, transform: "translateY(42cqh) scale(2.2)", filter: "drop-shadow(0 0 22px rgba(255,215,130,.95))", offset: 0.35 }, { opacity: 1, transform: "translateY(42cqh) scale(2.2)", filter: "drop-shadow(0 0 10px rgba(255,215,130,.6))", offset: 0.62 }, { opacity: 1, transform: "none", filter: "drop-shadow(0 6px 10px rgba(120,80,30,.2))" }], { duration: 3400, easing: "cubic-bezier(.6,0,.2,1)" });

  } });
  SC.push({ id: "invite", dur: 7000, async run() {
    setBg("invite"); anim(mono, [{ opacity: 1, transform: "none" }], { duration: 10 });
    const els = lines([["t-title", S.family], ["rule", ""], ["t-it", "cordially invite you<br>to celebrate the union of"]], "23%", "1.4cqw");
    fit(); await play(els, 900);
  } });
  SC.push({ id: "couple", dur: 10000, async run() {
    await clearText(700); anim(mono, [{ opacity: 1 }, { opacity: 0 }], { duration: 700 });
    setBg("court"); bloom(); setAmbient("glow");
    const els = lines([["t-name", pFirst.name], ["t-sm", pFirst.line], ["t-amp", "&amp;"], ["t-name", pSecond.name], ["t-sm", pSecond.line], ["rule", ""], ["t-it", "Join us as they begin their forever"]], "14%", ".9cqw");
    fit(); await play(els, 850);
  } });
  SC.push({ id: "date", dur: 9500, async run() {
    await clearText(600); setAmbient(null);
    await transition("featherhands", "savedate"); setAmbient("glow"); setDeco(null);
    const els = lines([["t-k", "Save the date"], ["t-big", `${S.dateShort.replace(" January 2027", "")}<small>January 2027</small>`], ["t-caps", S.place], ["rule", ""], ["count", ""], ["t-it", W.hero.tagline]], "13%", "1.4cqw");
    countEl = els[4]; tick(); fit(); await play(els, 700);
  } });
  events.forEach((ev) => {
    const v = W.venues[ev.venue];
    SC.push({ id: ev.theme, dur: 10000, ev, async run() {
      await clearText(600); setDeco(null); setAmbient(null);
      await transition(TIN[ev.theme], ev.theme);
      const [amb, birds] = AMB[ev.theme] || [null, false];
      setAmbient(amb, birds); setDeco(ev.theme);
      const times = ev.sessions.map((s) => (ev.sessions.length > 1 ? `${s.label} · ` : "") + s.time).join("&nbsp;&nbsp;|&nbsp;&nbsp;");
      const note = ev.sessions.map((s) => s.note).filter(Boolean).join(" · ");
      const spec = [["t-k", `Day ${dates.indexOf(ev.date) + 1}`], ["t-title", ev.title + (ev.amp ? ` <span style="font-size:.5em">${ev.amp}</span>` : "")]];
      if (ev.blurb) spec.push(["t-it", ev.blurb]);
      spec.push(["t-date", ev.date.replace(/(\d+) /, "$1<sup>" + ({ 1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd" }[+ev.date.match(/(\d+) /)[1]] || "th") + "</sup> ")], ["t-time", times]);
      if (note) spec.push(["t-sm", note]);
      spec.push(["t-venue", v.name], ["t-place", SHORT[ev.venue] || ""]);
      const top = DECO[ev.theme] && ASSET[DECO[ev.theme]] ? "19.5%" : "13%";
      const els = lines(spec, top, ".8cqw"); fit(); await play(els, 600);
    } });
  });
  SC.push({ id: "end", dur: 0, async run() {
    await clearText(600); setDeco(null); setAmbient(null);
    await transition("soft", "closing"); setAmbient("red", true);
    const els = lines([["t-k", "Join us in celebrating"], ["t-title", `${S.first} <span style="font-size:.6em;color:#c9a052">&amp;</span> ${S.second}`], ["t-it", "as we begin our forever"], ["rule", ""], ["t-caps", S.dateShort], ["t-sm", "Your presence and blessings mean the world to us."], ["t-tag", S.hashtag]], "13%", "1cqw");
    fit(); await play(els, 700); await wait(700);
    $("endbar").hidden = false; anim($("endbar"), [{ opacity: 0, transform: "translateY(3cqw)" }, { opacity: 1, transform: "none" }], { duration: 1000, easing: SOFT });
  } });

  /* ---------- story bars ---------- */
  $("bars").innerHTML = SC.map(() => "<span><i></i></span>").join("");
  const barEls = [...document.querySelectorAll(".bars i")];
  let cur = 0, barAnim = null;
  function bars(i) {
    barEls.forEach((b, k) => { b.getAnimations().forEach((a) => a.cancel()); b.style.transform = `scaleX(${k < i ? 1 : 0})`; });
    if (SC[i].dur) barAnim = barEls[i].animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: SC[i].dur, fill: "forwards", easing: "linear" });
    else barEls[i].style.transform = "scaleX(1)";
  }

  async function run(from) {
    token++; const my = token; paused = false;
    fx.innerHTML = ""; $("endbar").hidden = true;
    txt.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    for (let i = from; i < SC.length; i++) {
      if (my !== token) return;
      cur = i; sceneElapsed = 0; bars(i);
      await SC[i].run();
      if (my !== token) return;
      if (SC[i].dur) await wait(Math.max(0, SC[i].dur - sceneElapsed));
    }
  }
  function jump(i) {
    i = Math.max(0, Math.min(SC.length - 1, i));
    // land on a scene cleanly: set its look at once, then play it
    txt.innerHTML = ""; fx.innerHTML = "";
    if (i <= 2) setBg("invite", true); if (i === 3) setBg("court", true);
    if (i <= 3) setDeco(null);
    if (i === 2) anim(mono, [{ opacity: 1, transform: "none" }], { duration: 10 }); else if (i !== 1) anim(mono, [{ opacity: 0 }], { duration: 10 });
    run(i);
  }
  function setPause(p) {
    paused = p; document.getAnimations().forEach((a) => (p ? a.pause() : a.play()));
    if (p) song.pause(); else if (!muted) song.play().catch(() => {});
  }

  /* ---------- countdown ---------- */
  let countEl = null; const target = new Date(W.iso).getTime();
  function tick() {
    if (!countEl) return;
    let d = Math.max(0, target - Date.now());
    const days = Math.floor(d / 864e5); d -= days * 864e5; const h = Math.floor(d / 36e5); d -= h * 36e5; const m = Math.floor(d / 6e4); const s = Math.floor((d - m * 6e4) / 1000);
    countEl.innerHTML = [[days, "Days"], [h, "Hours"], [m, "Mins"], [s, "Secs"]].map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><span>${l}</span></div>`).join("");
  }
  setInterval(tick, 1000);

  /* ---------- opening: a curtain of hanging flower strands, swaying; on tap they rise one by one ---------- */
  function buildCurtain() {
    if (started) return;
    const c = $("curtain"); c.classList.add("has-img"); c.innerHTML = "";
    const strand = ASSET["strand.png"], N = strand ? 10 : 13;
    for (let i = 0; i < N; i++) {
      const d = document.createElement("div"); d.className = "strand";
      const drop = (i * 37) % 11; // a little variety in length
      d.style.left = (i / (N - 1)) * 100 + "%"; d.style.setProperty("--d", -(i * 0.7) + "s"); d.style.setProperty("--t", 4.5 + (i % 4) * 0.6 + "s"); d.style.top = -drop + "%";
      if (strand) { d.innerHTML = `<img src="${strand}" alt="">`; d.classList.add("strand--img"); }
      else { d.style.backgroundImage = `url(${ASSET["curtain.webp"]})`; d.style.backgroundSize = `${N * 100}% 100%`; d.style.backgroundPosition = `${(i / (N - 1)) * 100}% 0`; }
      c.appendChild(d);
    }
  }
  function liftCurtain() {
    const ss = [...$("curtain").children], mid = (ss.length - 1) / 2;
    if (!ss.length || reduce) { $("curtain").style.opacity = 0; return; }
    ss.forEach((d, i) => d.animate([{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(0,-118%,0)" }], { duration: 1700, delay: Math.abs(i - mid) * 110, easing: "cubic-bezier(.65,0,.3,1)", fill: "forwards" }));
  }
  const song = $("song"); let muted = false, started = false;
  $("gate").addEventListener("click", () => {
    if (started) return; started = true;
    $("gate").classList.add("open"); setTimeout(() => $("gate").remove(), 1000);
    song.volume = 0.7; song.play().catch(() => {});
    liftCurtain();
    stage.classList.add("playing");
    setTimeout(() => run(0), 900);
  });
  $("muteBtn").addEventListener("click", (e) => { e.stopPropagation(); muted = !muted; $("muteBtn").setAttribute("aria-pressed", String(muted)); $("muteBtn").setAttribute("aria-label", muted ? "Play music" : "Mute music"); if (muted) song.pause(); else song.play().catch(() => {}); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) song.pause(); else if (started && !muted && !paused) song.play().catch(() => {}); });

  /* tap right: next scene, tap left: back, press and hold: pause */
  let holdT = null, held = false;
  function bindTap(el, dir) {
    el.addEventListener("pointerdown", () => { held = false; holdT = setTimeout(() => { held = true; setPause(true); }, 280); });
    const up = () => { clearTimeout(holdT); if (held) { setPause(false); return; } };
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up); el.addEventListener("pointerleave", () => { clearTimeout(holdT); if (held) { held = false; setPause(false); } });
    el.addEventListener("click", () => { if (held) { held = false; return; } if (!started) return; if (paused) setPause(false); jump(cur + dir); });
  }
  bindTap($("tapNext"), 1); bindTap($("tapPrev"), -1);
  document.addEventListener("keydown", (e) => {
    if (!started || !$("details").hidden) return;
    if (e.key === "ArrowRight") jump(cur + 1); if (e.key === "ArrowLeft") jump(cur - 1); if (e.key === " ") { e.preventDefault(); setPause(!paused); }
  });

  /* ---------- details booklet ---------- */
  const share = `https://wa.me/?text=${encodeURIComponent(`You're invited to ${S.first} & ${S.second}'s wedding · ${S.dateShort} · ${S.place}\n${location.href.split("#")[0]}`)}`;
  $("shareBtn").href = share;
  $("replayBtn").addEventListener("click", () => { $("endbar").hidden = true; jump(0); });
  const openDetails = () => { setPause(true); $("details").hidden = false; $("details").scrollTop = 0; };
  $("detailsBtn").addEventListener("click", openDetails); $("infoBtn").addEventListener("click", (e) => { e.stopPropagation(); openDetails(); });
  function buildDetails() {
    const famOrder = sideId === "groom" ? ["groom", "bride"] : ["bride", "groom"];
    const faqs = S.faq.map((x) => (typeof x === "string" ? W.faqCommon[x] : x));
    const photos = [...W.moments.map((m) => [m.src, m.alt]), ...W.gallery];
    let h = `<div class="d-head"><b>${S.first} &amp; ${S.second}</b><button class="pill" type="button" id="closeDetails">Back to film</button></div>`;
    h += `<section class="d-sec"><p class="d-k">${S.eventsSubtitle}</p><h2>Celebrations</h2>`;
    events.forEach((ev) => { const v = W.venues[ev.venue]; h += `<div class="d-ev"><h3>${ev.title}${ev.amp ? " " + ev.amp : ""}</h3><p class="when">${ev.date} · ${ev.sessions.map((s) => (ev.sessions.length > 1 ? s.label + " " : "") + s.time).join(", ")}</p>${ev.blurb ? `<p><i>${ev.blurb}</i></p>` : ""}<p><b>${v.name}</b><br>${v.address}</p><div class="d-links"><a class="pill pill--red" href="${v.google}" target="_blank" rel="noopener">Directions</a><a class="pill" href="${calUrl(ev.cal, v)}" target="_blank" rel="noopener">Add to calendar</a></div></div>`; });
    h += `</section><section class="d-sec d-fam"><p class="d-k">With blessings</p><h2>Our Families</h2><p><b>${pFirst.name}</b> · ${pFirst.line}</p><p><b>${pSecond.name}</b> · ${pSecond.line}</p>`;
    famOrder.forEach((k) => { const F = W.families[k]; h += `<h3>${F.heading}</h3><div class="d-photo"><img loading="lazy" src="${F.photo}" alt="Grandparents of ${k === "groom" ? "Pankaj" : "Muskan"}"></div><p><i>${F.blessing}</i></p>${F.groups.map(([t, l]) => `<div class="g"><b>${t}</b>${l.map((x) => esc(x)).join("<br>")}</div>`).join("")}<p class="fine">${F.address}</p>`; });
    h += `</section><section class="d-sec"><p class="d-k">How we began</p><h2>${W.story.title}</h2>${W.story.paragraphs.map((p) => `<p>${p}</p>`).join("")}<div class="d-rail">${photos.map(([src, alt]) => `<img loading="lazy" src="${src}" alt="${esc(alt)}" data-zoom>`).join("")}</div>${W.story.ours.map((l) => `<p><i>${l}</i></p>`).join("")}</section>`;
    h += `<section class="d-sec"><p class="d-k">Getting there</p><h2>Travel</h2><p>${S.travelNote}</p>${S.pins.map((k) => { const v = W.venues[k]; return `<div class="d-ev"><h3 style="font-size:28px">${v.name}</h3><p>${v.address}</p><div class="d-links"><a class="pill pill--red" href="${v.google}" target="_blank" rel="noopener">Google Maps</a><a class="pill" href="${v.apple}" target="_blank" rel="noopener">Apple Maps</a></div></div>`; }).join("")}${S.departure ? `<div class="d-ev"><p class="when">${S.departure.label}</p><p>${S.departure.text}</p><p class="fine">${S.departure.distance} · ${S.departure.route}</p></div>` : ""}<p class="fine">Distances and drive times are approximate and depend on traffic.</p></section>`;
    h += `<section class="d-sec d-faq"><p class="d-k">Good to know</p><h2>Guest FAQ</h2><p><b>${S.faqTip.label}:</b> ${S.faqTip.text}</p>${faqs.map(([qq, a]) => `<details><summary>${qq}</summary><p>${a}</p></details>`).join("")}<div class="d-links"><a class="pill" href="https://wa.me/${S.phone}?text=${encodeURIComponent(`Hello, I have a question about ${S.first} & ${S.second}'s wedding.`)}" target="_blank" rel="noopener">Ask the family on WhatsApp</a></div></section>`;
    h += `<section class="d-sec"><p class="d-k">With love</p><h2>Blessings</h2><p>Leave a few words for the couple — your love is the gift</p><div class="d-bless" id="wall"></div><div class="d-links"><button class="pill pill--red" type="button" id="openForm">Leave your blessing</button></div></section>`;
    h += `<p class="d-foot">Made with love for our families · © 2026 Pankaj &amp; Muskan</p>`;
    $("detailsIn").innerHTML = h;
    $("closeDetails").addEventListener("click", () => { $("details").hidden = true; if (started) setPause(false); });
    const card = (b) => `<figure><blockquote>“${esc(b.message)}”</blockquote><figcaption>— ${esc(b.name)}</figcaption></figure>`;
    $("wall").innerHTML = W.blessingsSeed.map(card).join("");
    fetch("blessings.json").then((r) => r.json()).then((l) => ($("wall").innerHTML += l.map(card).join(""))).catch(() => {});
    $("openForm").addEventListener("click", () => { $("bsheet").hidden = false; });
  }
  buildDetails();
  $("bsheet").addEventListener("click", (e) => { if (e.target === $("bsheet") || e.target.closest("[data-close]")) $("bsheet").hidden = true; });
  $("bform").addEventListener("submit", (e) => {
    e.preventDefault(); const fd = new FormData(e.target), n = String(fd.get("n")).trim(), m = String(fd.get("m")).trim(); if (!n || !m) return;
    window.open(`https://wa.me/${S.phone}?text=${encodeURIComponent(`Blessing for ${S.first} & ${S.second} 💐\n\n“${m}”\n— ${n}`)}`, "_blank", "noopener"); $("bsheet").hidden = true;
  });
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-zoom]"); if (t) { $("lightbox").querySelector("img").src = t.src; $("lightbox").hidden = false; } });
  $("lightbox").addEventListener("click", () => ($("lightbox").hidden = true));

  /* warm the image cache so every scene change is instant */
  Object.keys(SKY).concat(["feathers"]).forEach((n) => { const i = new Image(); i.src = `scenes/${n}.webp`; });
  const mg = new Image(); mg.src = "scenes/marigold.png";
})();
