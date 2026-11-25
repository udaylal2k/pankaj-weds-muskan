(function () {
  const W = window.WEDDING, A = window.ART;
  const q = new URLSearchParams(location.search).get("side") || "";
  const sideId = ["muskan", "bride", "m"].includes(q.toLowerCase()) ? "bride" : "groom";
  const S = W.sides[sideId];
  document.documentElement.dataset.side = sideId;
  document.title = `${S.first} & ${S.second} — Wedding`;
  document.getElementById("fav").href = S.favicon;
  document.querySelectorAll("[data-first]").forEach((e) => (e.textContent = S.first));
  document.querySelectorAll("[data-second]").forEach((e) => (e.textContent = S.second));

  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ladis = (n, palette) => {
    let s = "";
    for (let i = 0; i < n; i++) { const dd = Math.abs(i / (n - 1) - 0.5) * 2; s += `<span style="--h:${(4 + dd * dd * 40 + ((i * 7) % 4)).toFixed(1)}%;--d:${(i % 5) * 0.35}s;--c1:${palette[i % palette.length]};--c2:${palette[(i + 1) % palette.length]}"></span>`; }
    return s;
  };
  const mapBtns = (v) => `<div class="btns"><a class="btn" href="${v.google}" target="_blank" rel="noopener">Google Maps</a><a class="btn btn--ghost" href="${v.apple}" target="_blank" rel="noopener">Apple Maps</a></div>`;
  const calUrl = (c, v) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(c.title + " · " + S.first + " & " + S.second)}&dates=${c.start}/${c.end}&ctz=Asia/Kolkata&location=${encodeURIComponent(v.address)}&details=${encodeURIComponent(c.details)}`;

  const scene = (id, theme, inner, art, opts = {}) => `
  <section class="scene scene--${theme}${opts.long ? " scene--long" : ""}" id="${id}" data-petals="${opts.petals || ""}">
    <div class="card">
      <div class="arch-gold" aria-hidden="true"></div>
      <div class="win${opts.img ? " win--paint" : ""}"${opts.img ? ` style="--skyc:${PAINT[opts.img].sky};--ov:${PAINT[opts.img].ov}"` : ""}>
        <div class="sky" aria-hidden="true"></div>
        ${art || ""}
        <div class="content">${inner}</div>
        ${opts.img ? `<img class="paint" src="scenes/${opts.img}.webp" alt="" aria-hidden="true" width="768" height="1344" loading="lazy">` : ""}
      </div>
    </div>
  </section>`;

  /* painted scenes: sky colour behind the text, and how much of the painting's empty top the text may sit on */
  const PAINT = {
    invite: { sky: "#fdf6df", ov: 0.5 }, court: { sky: "#fbf3e2", ov: 0.48 }, bairana: { sky: "#fbf1e2", ov: 0.5 },
    mehndi: { sky: "#f7f8f3", ov: 0.36 }, haldi: { sky: "#cdebe6", ov: 0.5 }, reception: { sky: "#f8e5d4", ov: 0.3 },
    baraat: { sky: "#fbd0e2", ov: 0.36 }, wedding: { sky: "#e3eef1", ov: 0.3 }, closing: { sky: "#fff6e3", ov: 0.44 }
  };
  const pFirst = sideId === "groom" ? W.parents.groom : W.parents.bride;
  const pSecond = sideId === "groom" ? W.parents.bride : W.parents.groom;
  let html = "";

  /* 1. Shloka */
  html += scene("top", "shloka",
    `<div class="ganesh rv" style="--i:0" aria-hidden="true">ॐ</div>
     <p class="shloka rv" style="--i:1">${W.shloka[0]}<br>${W.shloka[1]}</p>
     <p class="kicker rv" style="--i:2">॥ श्री गणेशाय नमः ॥</p>
     <a class="scroll-cue rv" style="--i:3" href="#invite" aria-label="Scroll to the invitation"><span></span></a>`,
    "", { img: "invite" });

  /* 2. Invitation */
  html += scene("invite", "invite",
    `<img class="mono rv" style="--i:0" src="brand/monogram-v2.png" alt="${S.first} and ${S.second} monogram" width="813" height="729">
     <h1 class="script big rv" style="--i:1">${S.family}</h1>
     <p class="lead rv" style="--i:2">${W.hero.tagline}</p>
     <h2 class="script name rv" style="--i:3">${pFirst.name}</h2>
     <p class="parent rv" style="--i:4">${pFirst.line}</p>
     <p class="amp rv" style="--i:5">&amp;</p>
     <h2 class="script name rv" style="--i:6">${pSecond.name}</h2>
     <p class="parent rv" style="--i:7">${pSecond.line}</p>
     <p class="date-line rv" style="--i:8">${S.dateShort}<span>${S.place}</span></p>
     <div class="countdown rv" style="--i:9" id="countdown" aria-live="polite"></div>
     <p class="closing rv" style="--i:10">${W.hero.closing}</p>
     <div class="btns rv" style="--i:11"><a class="btn" href="#events">View schedule</a><a class="btn btn--ghost" href="#travel">Travel info</a></div>`,
    "", { img: "court" });

  /* 3. Peacock feather transition: zoom through the opening in the feathers */
  html += `<section class="peacock" aria-hidden="true"><div class="peacock__stick"><img class="peacock__img" src="scenes/feathers.webp" alt="" width="768" height="1344">
    <p class="peacock__txt"><span class="kicker">The celebrations</span><span class="script">Three days of joy</span></p></div></section>`;

  /* 4. Events */
  const events = [...S.firstEvents, ...W.sharedEvents];
  html += `<div id="events" class="events-head"><p class="kicker">Celebrations</p><p class="sub">${S.eventsSubtitle}</p>
    <a class="btn btn--ghost" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(schedText())}">Send schedule to yourself</a></div>`;
  events.forEach((ev, idx) => {
    const v = W.venues[ev.venue];
    const sessions = ev.sessions.map((s) => `<li><b>${s.label}</b><span>${s.time}</span>${s.note ? `<em>${s.note}</em>` : ""}</li>`).join("");
    const title = `${ev.pre ? `<span class="pre">${ev.pre}</span>` : ""}${ev.title}${ev.amp ? `<span class="post">${ev.amp}</span>` : ""}`;
    const dayNo = [...new Set(events.map((e) => e.date))].indexOf(ev.date) + 1;
    const inner = `<p class="kicker rv" style="--i:0">Day ${dayNo}</p>
      <h2 class="script ev-title rv" style="--i:1">${title}</h2>
      ${ev.blurb ? `<p class="blurb rv" style="--i:2">${ev.blurb}</p>` : ""}
      <p class="ev-date rv" style="--i:3">${ev.date}</p>
      <ul class="sessions rv" style="--i:4">${sessions}</ul>
      <p class="venue rv" style="--i:5"><b>${v.name}</b>${v.address}</p>
      <div class="btns rv" style="--i:6"><a class="btn" href="${v.google}" target="_blank" rel="noopener">Directions</a><a class="btn btn--ghost" href="${calUrl(ev.cal, v)}" target="_blank" rel="noopener">Add to calendar</a></div>`;
    html += scene("ev-" + ev.theme, ev.theme, inner, eventArt(ev.theme), { img: ev.theme, petals: { haldi: "yellow", wedding: "pink", mehndi: "green", bairana: "marigold", baraat: "marigold" }[ev.theme] || "" });
  });

  /* 5. Families */
  const famOrder = sideId === "groom" ? ["groom", "bride"] : ["bride", "groom"];
  let fam = `<p class="kicker rv" style="--i:0">With blessings</p><h2 class="script sec-title rv" style="--i:1">Our Families</h2>
    <div class="parents rv" style="--i:2">
      <div><h3>${pFirst.name}</h3><p>${pFirst.line}</p></div>
      <div><h3>${pSecond.name}</h3><p>${pSecond.line}</p></div>
    </div>`;
  famOrder.forEach((k) => {
    const F = W.families[k];
    fam += `<article class="family rv" style="--i:3">
      <h3 class="family__head">${F.heading}</h3>
      <figure class="arch-photo"><img loading="lazy" src="${F.photo}" alt="Grandparents of ${k === "groom" ? "Pankaj" : "Muskan"}"></figure>
      <p class="blessing">${F.blessing}</p>
      ${F.groups.map(([h, list]) => `<div class="fgroup"><p class="kicker">${h}</p>${list.map((n) => `<p>${n}</p>`).join("")}</div>`).join("")}
      <p class="addr">${F.address}</p>
    </article>`;
  });
  html += scene("family", "family", fam, `<img class="lotus-c lotus-c--l" src="brand/lotus-corner.png" alt="" aria-hidden="true"><img class="lotus-c lotus-c--r" src="brand/lotus-corner.png" alt="" aria-hidden="true">`, { long: true });

  /* 6. Story + moments */
  const st = W.story;
  let story = `<p class="kicker rv" style="--i:0">How we began</p><h2 class="script sec-title rv" style="--i:1">${st.title}</h2><p class="sub rv" style="--i:2">${st.subtitle}</p>
    ${st.paragraphs.map((p, i) => `<p class="para rv" style="--i:${3 + i}">${p}</p>`).join("")}
    <ol class="miles rv" style="--i:6">${st.milestones.map(([d, t]) => `<li><span>${d}</span>${t}</li>`).join("")}</ol>
    <div class="moments">${W.moments.map((m, i) => `<figure class="moment rv" style="--i:${i}"><div class="arch-photo"><img loading="lazy" src="${m.src}" alt="${esc(m.alt)}" data-zoom></div><figcaption><b class="script">${m.title}</b><span>${m.sub}</span></figcaption></figure>`).join("")}</div>
    <blockquote class="ours rv" style="--i:0">${st.ours.map((l) => `<p>${l}</p>`).join("")}<cite>— ${S.first} &amp; ${S.second}</cite></blockquote>`;
  html += scene("story", "story", story, "", { long: true });

  /* 7. Gallery */
  html += `<section class="gallery" id="gallery"><p class="kicker">Our journey</p><h2 class="script sec-title">Moments We Cherish</h2>
    <div class="rail" tabindex="0" aria-label="Photo gallery">${W.gallery.map(([src, alt]) => `<figure class="arch-photo slide"><img loading="lazy" src="${src}" alt="${esc(alt)}" data-zoom></figure>`).join("")}</div>
    <p class="hint">Swipe to see more · tap a photo to open it</p></section>`;

  /* 8. Travel + FAQ */
  let tr = `<p class="kicker rv" style="--i:0">Getting there</p><h2 class="script sec-title rv" style="--i:1">Travel</h2><p class="sub rv" style="--i:2">${S.travelNote}</p>`;
  S.pins.forEach((k, i) => { const v = W.venues[k]; tr += `<div class="pin rv" style="--i:${3 + i}"><h3>${v.name}</h3><p>${v.address}</p>${mapBtns(v)}</div>`; });
  if (S.departure) { const d = S.departure; tr += `<div class="pin pin--dep rv" style="--i:5"><p class="kicker">${d.label}</p><p><b>From</b> ${d.from}</p><p><b>To</b> ${d.to}</p><p>${d.distance}</p><p class="route">${d.route}</p><p>${d.text}</p></div>`; }
  tr += `<p class="note rv" style="--i:6">Distances and drive times are approximate and depend on traffic.</p>`;
  html += scene("travel", "travel", tr, `<div class="art-bottom art-bottom--short">${A.palm(false)}${A.palm(true)}${A.balustrade()}</div>`, { long: true });

  const faqs = S.faq.map((x) => (typeof x === "string" ? W.faqCommon[x] : x));
  let fq = `<p class="kicker rv" style="--i:0">Good to know</p><h2 class="script sec-title rv" style="--i:1">Guest FAQ</h2><p class="sub rv" style="--i:2">${S.faqSubtitle}</p>
    <div class="tip rv" style="--i:3"><p class="kicker">${S.faqTip.label}</p><p>${S.faqTip.text}</p></div>
    <div class="faq rv" style="--i:4">${faqs.map(([qq, a], i) => `<details${i === 0 ? " open" : ""}><summary>${qq}</summary><p>${a}</p></details>`).join("")}</div>
    <a class="btn rv" style="--i:5" href="https://wa.me/${S.phone}?text=${encodeURIComponent(`Hello, I have a question about ${S.first} & ${S.second}'s wedding.`)}" target="_blank" rel="noopener">Ask the family on WhatsApp</a>`;
  html += scene("faq", "faq", fq, `<img class="lotus-c lotus-c--l" src="brand/lotus-corner.png" alt="" aria-hidden="true"><img class="lotus-c lotus-c--r" src="brand/lotus-corner.png" alt="" aria-hidden="true">`, { long: true });

  /* 9. Blessings */
  html += `<section class="bless" id="blessings"><p class="kicker">With love</p><h2 class="script sec-title">Blessings Wall</h2><p class="sub">Leave a few words for the couple — your love is the gift</p>
    <div class="wall" id="wall"></div>
    <form class="bform" id="bform"><h3 class="script">Leave your blessing</h3>
      <label>Your name<input name="n" required maxlength="80" autocomplete="name"></label>
      <label>Message<textarea name="m" required maxlength="600" rows="3"></textarea></label>
      <button class="btn" type="submit">Send blessing</button>
      <p class="fine">Your blessing opens in WhatsApp, addressed to the family.</p>
    </form></section>`;

  /* 10. Closing */
  html += scene("end", "end",
    `<p class="kicker rv" style="--i:0">Join us in celebrating</p>
     <img class="mono mono--sm rv" style="--i:1" src="brand/monogram-v2.png" alt="" width="813" height="729">
     <h2 class="script big rv" style="--i:2">${S.first} &amp; ${S.second}</h2>
     <p class="lead rv" style="--i:3">Join us in celebrating as we begin our forever.</p>
     <p class="date-line rv" style="--i:4">${S.dateShort}</p>
     <p class="lead rv" style="--i:5">Your presence and blessings mean the world to us.</p>
     <p class="tag rv" style="--i:6">${S.hashtag}</p>
     <button class="secret-btn rv" style="--i:7" type="button" id="secretBtn" aria-expanded="false">✦</button>
     <div class="secret" id="secret" hidden><p class="kicker">A note just for you</p><p>${W.secret}</p></div>
     <footer class="foot rv" style="--i:8"><p>Made with love for our families</p><p>© 2026 Pankaj &amp; Muskan</p></footer>`,
    "", { img: "closing", petals: "pink" });

  document.getElementById("main").innerHTML = html;
  document.querySelectorAll(".gate .ladis").forEach((g) => {
    let t = ""; for (let i = 0; i < 9; i++) t += `<span style="--d:${(i % 4) * 0.4}s;--c1:${i % 2 ? "#f6c7d6" : "#e9799f"};--c2:#fffaf2"></span>`; g.innerHTML = t;
  });

  function eventArt(theme) {
    if (theme === "haldi") return `${A.birds()}<div class="ladis-top">${ladis(18, ["#ffcc1f", "#ffa51f", "#ffe066"])}</div>`;
    if (theme === "bairana") return `<div class="ladis-top">${ladis(16, ["#f39a1e", "#ffc83d", "#e8601c"])}</div>`;
    if (theme === "mehndi") return `<div class="ladis-top">${ladis(16, ["#3f8f3a", "#f4c542", "#d94c8a"])}</div>`;
    if (theme === "reception") return `<div class="lights-top">${A.lights()}</div>`;
    if (theme === "baraat") return `${A.birds()}<div class="ladis-top">${ladis(18, ["#ff9f1c", "#ffffff", "#e8601c", "#ffc83d"])}</div>`;
    if (theme === "wedding") return `${A.birds()}<div class="ladis-top">${ladis(18, ["#e46b9b", "#ffffff", "#f7b8cf", "#c93c74"])}</div>`;
    return "";
  }
  function schedText() {
    return `${S.first} & ${S.second} — Wedding · ${S.dateShort}\n` + events.map((e) => `${e.date}: ${e.sessions.map((s) => s.label + " " + s.time).join(", ")} — ${W.venues[e.venue].name}, ${W.venues[e.venue].address}`).join("\n") + `\n${location.href.split("#")[0]}`;
  }
  function ganeshSvg() {
    // Simple line Ganesha: head, ears, trunk, crown
    return `<svg viewBox="0 0 120 120" width="88" height="88" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M60 20 l-10 12 h20 z"/><circle cx="60" cy="16" r="3"/>
      <path d="M44 34 c-24 -6 -36 14 -28 32 c6 12 18 12 24 4"/><path d="M76 34 c24 -6 36 14 28 32 c-6 12 -18 12 -24 4"/>
      <path d="M44 34 c4 -2 28 -2 32 0 c6 8 6 24 -2 34 c-4 6 -6 10 -6 16 c0 10 8 14 14 10 c4 -3 3 -9 -1 -10"/>
      <path d="M44 34 c-6 8 -6 24 2 34 c3 4 6 8 8 12"/>
      <path d="M52 50 q3 -3 6 0"/><path d="M62 50 q3 -3 6 0"/><path d="M55 40 h10"/><path d="M46 70 l-8 10"/></g>
      <path d="M38 100 q22 10 44 0" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;
  }

  /* ---------- Behaviour ---------- */
  // Reveal on scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".rv, .scene, .peacock, .gallery, .bless, .events-head").forEach((el) => io.observe(el));

  // Countdown
  const cd = document.getElementById("countdown"), target = new Date(W.iso).getTime();
  function tick() {
    let d = Math.max(0, target - Date.now());
    const days = Math.floor(d / 864e5); d -= days * 864e5;
    const h = Math.floor(d / 36e5); d -= h * 36e5;
    const m = Math.floor(d / 6e4); const s = Math.floor((d - m * 6e4) / 1000);
    cd.innerHTML = [[days, "Days"], [h, "Hours"], [m, "Minutes"], [s, "Seconds"]].map(([n, l]) => `<div><b>${String(n).padStart(2, "0")}</b><span>${l}</span></div>`).join("") + `<p>days to forever</p>`;
  }
  tick(); setInterval(tick, 1000);

  // Gate + music
  const gate = document.getElementById("gate"), song = document.getElementById("song"), mBtn = document.getElementById("music");
  let playing = false;
  function setPlaying(p) { playing = p; mBtn.setAttribute("aria-pressed", String(p)); mBtn.setAttribute("aria-label", p ? "Mute music" : "Play music"); mBtn.classList.toggle("off", !p); }
  document.getElementById("gateBtn").addEventListener("click", () => {
    gate.classList.add("open"); document.body.classList.remove("locked");
    song.volume = 0.6; song.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    setTimeout(() => gate.remove(), 1900);
  });
  mBtn.addEventListener("click", () => { if (playing) { song.pause(); setPlaying(false); } else { song.play().then(() => setPlaying(true)).catch(() => {}); } });
  document.addEventListener("visibilitychange", () => { if (document.hidden && playing) song.pause(); else if (!document.hidden && playing) song.play().catch(() => {}); });

  // WhatsApp share
  document.getElementById("waShare").href = `https://wa.me/?text=${encodeURIComponent(`You're invited to ${S.first} & ${S.second}'s wedding · ${S.dateShort} · ${S.place}\n${location.href.split("#")[0]}`)}`;

  // Blessings wall: saved messages from the original wall
  const wall = document.getElementById("wall");
  const card = (b) => `<figure class="bcard"><blockquote>“${esc(b.message)}”</blockquote><figcaption>— ${esc(b.name)}</figcaption></figure>`;
  wall.innerHTML = W.blessingsSeed.map(card).join("");
  fetch("blessings.json").then((r) => r.json()).then((list) => { wall.innerHTML += list.map(card).join(""); }).catch(() => {});
  document.getElementById("bform").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target), n = fd.get("n").trim(), m = fd.get("m").trim();
    if (!n || !m) return;
    window.open(`https://wa.me/${S.phone}?text=${encodeURIComponent(`Blessing for ${S.first} & ${S.second} 💐\n\n“${m}”\n— ${n}`)}`, "_blank", "noopener");
  });

  // Secret note
  const sb = document.getElementById("secretBtn"), sn = document.getElementById("secret");
  sb.addEventListener("click", () => { sn.hidden = !sn.hidden; sb.setAttribute("aria-expanded", String(!sn.hidden)); });

  // Lightbox
  const lb = document.getElementById("lightbox"), lbi = lb.querySelector("img");
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-zoom]"); if (!t) return;
    lbi.src = t.src; lbi.alt = t.alt; lb.hidden = false;
  });
  lb.addEventListener("click", () => (lb.hidden = true));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.hidden = true; });

  // Nav: show after the first screen, mark active section
  const nav = document.getElementById("nav");
  const links = [...nav.querySelectorAll("a")];
  const secs = links.map((a) => document.querySelector(a.getAttribute("href")));
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("show", scrollY > innerHeight * 0.6);
      let cur = -1; secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
      links.forEach((a, i) => a.classList.toggle("on", i === cur));
      peacock(); ticking = false;
    });
  }, { passive: true });

  // Peacock feathers part as you scroll through
  const pk = document.querySelector(".peacock");
  function peacock() {
    const b = pk.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -b.top / (b.height - innerHeight)));
    pk.style.setProperty("--p", p.toFixed(3));
  }
  peacock();

  /* Falling petals, coloured by the scene on screen */
  const cv = document.getElementById("petals"), ctx = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PAL = { pink: ["#f49ab8", "#f7c0d2", "#e8638f", "#fde3ec"], yellow: ["#ffd23f", "#ffc21a", "#fff07a", "#ffb000"], marigold: ["#ff9f1c", "#ffbf3f", "#f26b1d"], green: ["#9cc46a", "#f4c542", "#e46b9b"] };
  let mode = "", parts = [], dpr = Math.min(2, devicePixelRatio || 1);
  function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
  size(); addEventListener("resize", size);
  const sceneEls = [...document.querySelectorAll("[data-petals]")];
  function currentMode() {
    let m = ""; sceneEls.forEach((s) => { const b = s.getBoundingClientRect(); if (b.top < innerHeight * 0.55 && b.bottom > innerHeight * 0.45) m = s.dataset.petals; });
    return m;
  }
  function spawn(m) {
    const big = m === "pink";
    return { x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.6, s: (big ? 7 : 4) + Math.random() * (big ? 9 : 5), vy: 0.5 + Math.random() * 1.1, ph: Math.random() * 6.28, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.05, c: PAL[m][Math.floor(Math.random() * PAL[m].length)] };
  }
  function frame() {
    const m = document.body.classList.contains("locked") ? "" : currentMode();
    if (m !== mode) { mode = m; if (m) parts = parts.concat(Array.from({ length: innerWidth < 600 ? 16 : 26 }, () => spawn(m))).slice(-50); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => {
      p.y += p.vy; p.ph += 0.02; p.x += Math.sin(p.ph) * 0.6; p.rot += p.vr;
      if (!mode) { p.al = (p.al ?? 0.85) - 0.02; if (p.al <= 0) return false; }
      if (p.y > innerHeight + 20) { if (mode && PAL[mode]) { Object.assign(p, spawn(mode)); p.y = -20; } else return false; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.globalAlpha = p.al ?? 0.85;
      ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      return true;
    });
    requestAnimationFrame(frame);
  }
  if (!reduce) requestAnimationFrame(frame);
})();
