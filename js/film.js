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
  const SKY = { invite: "#fcad84", court: "#fddaab", savedate: "#fddaad", bairana: "#fcb48f", mehndi: "#fdd779", haldi: "#fdda7f", reception: "#fdb27b", baraat: "#fcb28c", wedding: "#fab894", closing: "#fcb48d" };
  const SHORT = { residence: "Teela Jamalpura, Bhopal", brideResidence: "Fefartal, Narmadapuram", resort: "Khajoori Sadak, Bhopal" };

  /* optional painted assets: used when present */
  const ASSET = {};
  ["ornament.webp", "ganesha.png", "curtain.webp", "petal.png", "feather.png", "garland.png", "diya.png"].forEach((f) => {
    const im = new Image(); im.onload = () => { ASSET[f] = im.src; if (f === "ornament.webp") stage.style.setProperty("--ornament", `url(${im.src})`); if (f === "curtain.webp") $("curtain").classList.add("has-img"), $("curtain").style.backgroundImage = `url(${im.src})`; };
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
  function reveal(el) {
    const script = /t-title|t-name|t-big/.test(el.className);
    if (script) return anim(el, [{ opacity: 1, clipPath: "inset(-30% 100% -30% -6%)" }, { opacity: 1, clipPath: "inset(-30% -6% -30% -6%)" }], { duration: 1700, easing: "cubic-bezier(.45,0,.25,1)" });
    return anim(el, [{ opacity: 0, transform: "translateY(1.6cqw)", filter: "blur(5px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }], { duration: 1000 });
  }
  async function play(els, step) { for (const el of els) { reveal(el); await wait(step || 620); } }
  async function clearText(ms = 600) {
    const els = [...txt.children]; if (!els.length) return;
    els.forEach((el) => anim(el, [{ opacity: getComputedStyle(el).opacity }, { opacity: 0, transform: "translateY(-1cqw)" }], { duration: ms }));
    await wait(ms); txt.innerHTML = "";
  }

  /* ---------- painted backgrounds: crossfade with a slow drift ---------- */
  let front = $("bgA"), back = $("bgB"), curBg = "invite";
  function setBg(name, instant) {
    win.style.setProperty("--sky", SKY[name] || "#f6e6cf");
    $("bd").src = `scenes/${name}.webp`;
    if (name === curBg && front.classList.contains("on")) { drift(front); return; }
    curBg = name; back.src = `scenes/${name}.webp`;
    const go = () => {
      back.classList.add("on"); front.classList.remove("on");
      if (!instant && !reduce) { back.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1100, easing: "ease" }); front.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1100, easing: "ease" }); }
      drift(back); [front, back] = [back, front];
    };
    back.complete && back.naturalWidth ? go() : (back.onload = () => { back.onload = null; go(); });
  }
  function drift(el) { if (!reduce) el.animate([{ transform: "scale(1.07)" }, { transform: "scale(1)" }], { duration: 9000, easing: "cubic-bezier(.25,.1,.25,1)", fill: "forwards" }); }

  /* ---------- the hanging garland that drops into the arch on every celebration ---------- */
  const garland = $("garland"); let garlandOn = false;
  function setGarland(on) {
    if (on === garlandOn) return; garlandOn = on;
    win.classList.toggle("has-garland", on);
    anim(garland, on ? [{ transform: "translateY(-110%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }], { duration: on ? 1400 : 500, easing: on ? "cubic-bezier(.3,1.25,.5,1)" : "ease" });
  }

  /* ---------- ambience ---------- */
  function setAmbient(kind) {
    ambient.innerHTML = ""; if (!kind || reduce) return;
    const PAL = { pink: ["#f4a1bb", "#e9638e", "#f8c9d6", "#c9234a"], yellow: ["#ffd23f", "#ffb000", "#ffe580"], marigold: ["#ff9f1c", "#f26b1d", "#ffbf3f"], red: ["#c9234a", "#a3132f", "#e9638e"] };
    if (kind === "glow") { for (let i = 0; i < 14; i++) ambient.insertAdjacentHTML("beforeend", `<b style="left:${(i * 7.3) % 96}%;--s:${1 + (i % 3)}cqw;--t:${6 + (i % 4)}s;--d:-${i * 0.6}s"></b>`); return; }
    const pal = PAL[kind];
    if (kind === "red" && ASSET["petal.png"]) { for (let i = 0; i < 12; i++) ambient.insertAdjacentHTML("beforeend", `<img src="${ASSET["petal.png"]}" alt="" style="left:${(i * 8.7 + 3) % 98}%;--s:${2.6 + (i % 3) * 0.9}cqw;--t:${7 + (i % 5)}s;--d:-${i * 0.9}s">`); return; }
    for (let i = 0; i < 12; i++) ambient.insertAdjacentHTML("beforeend", `<i style="left:${(i * 8.7 + 3) % 98}%;--s:${1.8 + (i % 3) * 0.7}cqw;--t:${7 + (i % 5)}s;--d:-${i * 0.9}s;--c:${pal[i % pal.length]}"></i>`);
  }

  /* ---------- full-screen transitions, like the reference video ---------- */
  const rnd = (a, b) => a + Math.random() * (b - a);
  function featherZoom() { // the painted peacock-feather frame closes in, then the camera flies through its opening
    if (reduce) return Promise.resolve();
    const im = document.createElement("img"); im.src = "scenes/feathers.webp";
    Object.assign(im.style, { left: "-2%", top: "-2%", width: "104%", height: "104%", objectFit: "cover", objectPosition: "50% 42%", transformOrigin: "50% 42%" });
    fx.appendChild(im);
    im.animate([{ opacity: 0, transform: "scale(1.6)" }, { opacity: 1, transform: "scale(1)", offset: 0.35 }, { opacity: 1, transform: "scale(1)", offset: 0.5 }, { opacity: 0, transform: "scale(7)" }], { duration: 2600, easing: "cubic-bezier(.55,0,.35,1)", fill: "forwards" }).finished.then(() => im.remove());
    return wait(1250);
  }
  function flowers(src, n, sizeA, sizeB) { // big flowers tumble across the screen from the bottom right
    if (reduce) return Promise.resolve();
    for (let i = 0; i < n; i++) {
      const im = document.createElement("img"); im.src = src; const s = rnd(sizeA, sizeB);
      Object.assign(im.style, { width: s + "cqw", left: rnd(-10, 100) + "%", top: rnd(-10, 100) + "%" });
      fx.appendChild(im);
      const dx = rnd(-90, -60), dy = rnd(-120, -80), r0 = rnd(0, 180);
      im.animate([{ transform: `translate(${-dx}cqw,${-dy}cqh) rotate(${r0}deg)`, opacity: 1 }, { transform: `translate(${dx * 1.4}cqw,${dy * 1.3}cqh) rotate(${r0 + rnd(160, 320)}deg)`, opacity: 1 }], { duration: rnd(1900, 2600), delay: rnd(0, 450), easing: "cubic-bezier(.3,.1,.4,1)", fill: "both" }).finished.then(() => im.remove());
    }
    return wait(900);
  }
  function petals(colors, n, big) { // a burst of petals falling with a sway
    if (reduce) return Promise.resolve();
    const usePetal = ASSET["petal.png"] && colors === "red";
    const pal = { red: ["#c9234a", "#a3132f", "#e9638e", "#f4a1bb"], pink: ["#f4a1bb", "#e9638e", "#f8c9d6", "#ffffff"], gold: ["#f6d47c", "#e6c57c", "#fff1c4", "#d9a441"], marigold: ["#ff9f1c", "#f26b1d", "#ffbf3f"] }[colors];
    for (let i = 0; i < n; i++) {
      const s = big ? rnd(4, 11) : rnd(1.5, 3.5);
      let el;
      if (usePetal) { el = document.createElement("img"); el.src = ASSET["petal.png"]; el.style.width = s + "cqw"; }
      else { el = document.createElement("i"); Object.assign(el.style, { width: s + "cqw", height: s * 0.7 + "cqw", background: pal[i % pal.length] }); if (colors === "gold") { el.style.borderRadius = "50%"; el.style.boxShadow = "0 0 6px #ffe9a8"; } }
      el.style.left = rnd(-5, 100) + "%"; el.style.top = "-12%"; fx.appendChild(el);
      const sway = rnd(-25, 25), rot = rnd(-400, 400);
      el.animate([{ transform: "translate(0,0) rotate(0)" }, { transform: `translate(${sway}cqw,60cqh) rotate(${rot / 2}deg)`, offset: 0.5 }, { transform: `translate(${-sway / 2}cqw,125cqh) rotate(${rot}deg)` }], { duration: rnd(2200, 3600), delay: rnd(0, 700), easing: "cubic-bezier(.35,.1,.5,1)", fill: "both" }).finished.then(() => el.remove());
    }
    return wait(600);
  }

  function diyas(n) { // lit diyas drift up through the frame
    if (reduce || !ASSET["diya.png"]) return Promise.resolve();
    for (let i = 0; i < n; i++) {
      const im = document.createElement("img"); im.src = ASSET["diya.png"]; const s = rnd(7, 13);
      Object.assign(im.style, { width: s + "cqw", left: rnd(2, 88) + "%", top: "100%", filter: "drop-shadow(0 0 10px rgba(255,190,80,.8))" });
      fx.appendChild(im);
      im.animate([{ transform: "translateY(0) scale(.9)", opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: `translate(${rnd(-6, 6)}cqw,-125cqh) scale(1)`, opacity: 0 }], { duration: rnd(3000, 4200), delay: rnd(0, 900), easing: "cubic-bezier(.3,.2,.5,1)", fill: "both" }).finished.then(() => im.remove());
    }
    return wait(700);
  }

  /* ---------- the scenes ---------- */
  const calUrl = (c, v) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(c.title + " · " + S.first + " & " + S.second)}&dates=${c.start}/${c.end}&ctz=Asia/Kolkata&location=${encodeURIComponent(v.address)}&details=${encodeURIComponent(c.details)}`;
  const pFirst = sideId === "groom" ? W.parents.groom : W.parents.bride;
  const pSecond = sideId === "groom" ? W.parents.bride : W.parents.groom;
  const events = [...S.firstEvents, ...W.sharedEvents];
  const dates = [...new Set(events.map((e) => e.date))];
  const TIN = { bairana: "diyas", mehndi: "feathers", haldi: "marigold", reception: "gold", baraat: "marigold-petals", wedding: "rose" };
  const AMB = { bairana: "glow", mehndi: "pink", haldi: "yellow", reception: "glow", baraat: "marigold", wedding: "red" };

  const SC = [];
  SC.push({ id: "shloka", dur: 7000, async run() {
    setBg("invite"); setAmbient(null); setGarland(false); anim(mono, [{ opacity: 0 }], { duration: 10 });
    const els = lines([[ASSET["ganesha.png"] ? "img" : "t-om", ASSET["ganesha.png"] ? "assets/ganesha.png" : "ॐ"], ["t-shloka", `${W.shloka[0]}<br>${W.shloka[1]}`], ["t-deva", "॥ श्री गणेशाय नमः ॥"]], "13%", "3cqw");
    fit(); await play(els, 900);
  } });
  SC.push({ id: "monogram", dur: 3600, async run() {
    setBg("invite"); await clearText(700);
    // the monogram arrives large in the middle, then glides up to its place
    anim(mono, [{ opacity: 0, transform: "translateY(42cqh) scale(.3)" }, { opacity: 1, transform: "translateY(42cqh) scale(2.2)", offset: 0.35 }, { opacity: 1, transform: "translateY(42cqh) scale(2.2)", offset: 0.62 }, { opacity: 1, transform: "none" }], { duration: 3200, easing: "cubic-bezier(.6,0,.2,1)" });
  } });
  SC.push({ id: "invite", dur: 10500, async run() {
    setBg("invite"); anim(mono, [{ opacity: 1, transform: "none" }], { duration: 10 });
    const els = lines([
      ["t-title", S.family], ["t-it", "cordially invite you to celebrate<br>the union of"],
      ["t-name", pFirst.name], ["t-sm", pFirst.line], ["t-amp", "&amp;"], ["t-name", pSecond.name], ["t-sm", pSecond.line],
      ["t-it", "Join us as they begin their forever"]], "22%", ".5cqw");
    fit(); await play(els, 750);
  } });
  SC.push({ id: "date", dur: 9000, async run() {
    await clearText(500); anim(mono, [{ opacity: 0 }], { duration: 500 });
    await featherZoom(); setBg("savedate"); setAmbient("glow"); setGarland(false);
    const els = lines([["t-k", "Save the date"], ["t-big", `${S.dateShort.replace(" January 2027", "")}<small>January 2027</small>`], ["t-caps", S.place], ["rule", ""], ["count", ""], ["t-it", W.hero.tagline]], "13%", "1.4cqw");
    countEl = els[4]; tick(); fit(); await play(els, 650);
  } });
  events.forEach((ev) => {
    const v = W.venues[ev.venue];
    SC.push({ id: ev.theme, dur: 9500, ev, async run() {
      await clearText(500);
      const t = TIN[ev.theme];
      if (t === "marigold") { const p = flowers("scenes/marigold.png", 30, 20, 40); setTimeout(() => setBg(ev.theme), 650); await p; }
      else if (t === "marigold-petals") { const p = flowers("scenes/marigold.png", 10, 16, 30); petals("marigold", 40, true); setTimeout(() => setBg(ev.theme), 600); await p; }
      else if (t === "rose") { petals("red", 70, true); petals("pink", 40, true); await wait(700); setBg(ev.theme); }
      else if (t === "gold") { petals("gold", 60, false); await wait(400); setBg(ev.theme); }
      else if (t === "diyas") { const p = ASSET["feather.png"] ? flowers(ASSET["feather.png"], 12, 26, 46) : Promise.resolve(); diyas(16); setTimeout(() => setBg(ev.theme), 700); await p; await wait(300); }
      else if (t === "feathers") { const p = ASSET["feather.png"] ? flowers(ASSET["feather.png"], 14, 26, 46) : Promise.resolve(); setTimeout(() => setBg(ev.theme), 700); await p; }
      else { setBg(ev.theme); await wait(300); }
      setAmbient(AMB[ev.theme]); setGarland(true);
      const times = ev.sessions.map((s) => (ev.sessions.length > 1 ? `${s.label} · ` : "") + s.time).join("&nbsp;&nbsp;|&nbsp;&nbsp;");
      const note = ev.sessions.map((s) => s.note).filter(Boolean).join(" · ");
      const spec = [["t-k", `Day ${dates.indexOf(ev.date) + 1}`], ["t-title", ev.title + (ev.amp ? ` <span style="font-size:.5em">${ev.amp}</span>` : "")]];
      if (ev.blurb) spec.push(["t-it", ev.blurb]);
      spec.push(["rule", ""], ["t-caps", ev.date], ["t-time", times]);
      if (note) spec.push(["t-sm", note]);
      spec.push(["t-venue", v.name], ["t-place", SHORT[ev.venue] || ""]);
      const els = lines(spec, "19.5%", ".8cqw"); fit(); await play(els, 560);
    } });
  });
  SC.push({ id: "end", dur: 0, async run() {
    await clearText(500); petals("red", 50, true); await wait(500); setBg("closing"); setAmbient("red"); setGarland(true);
    const els = lines([["t-k", "Join us in celebrating"], ["t-title", `${S.first} <span style="font-size:.6em;color:#c9a052">&amp;</span> ${S.second}`], ["t-it", "as we begin our forever"], ["rule", ""], ["t-caps", S.dateShort], ["t-sm", "Your presence and blessings mean the world to us."], ["t-tag", S.hashtag]], "18%", "1cqw");
    fit(); await play(els, 650); await wait(600);
    $("endbar").hidden = false; anim($("endbar"), [{ opacity: 0, transform: "translateY(3cqw)" }, { opacity: 1, transform: "none" }], { duration: 800 });
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
    if (i <= 2) setBg("invite", true);
    if (i <= 3) setGarland(false);
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

  /* ---------- opening: the flower curtain lifts, the music starts ---------- */
  let cs = ""; for (let i = 0; i < 15; i++) cs += `<span style="--d:${(i % 4) * 0.3}s;--c1:${i % 2 ? "#f6c7d6" : "#e9799f"}"></span>`;
  $("curtain").innerHTML = cs;
  const song = $("song"); let muted = false, started = false;
  $("gate").addEventListener("click", () => {
    if (started) return; started = true;
    $("gate").classList.add("open"); setTimeout(() => $("gate").remove(), 1000);
    song.volume = 0.7; song.play().catch(() => {});
    anim($("curtain"), [{ transform: "translateY(0)" }, { transform: "translateY(-105%)" }], { duration: 2400, easing: "cubic-bezier(.7,0,.25,1)" });
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
