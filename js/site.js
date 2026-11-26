/* Pankaj & Muskan — a scroll-through invitation, one video-style frame per screen. */
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
  const ladis = (count, pal, max) => {
    let s = "";
    for (let i = 0; i < count; i++) {
      const d = Math.abs(i / (count - 1) - 0.5) * 2;
      s += `<span style="--h:${(3 + d * d * max + ((i * 7) % 4)).toFixed(1)}%;--d:${(i % 5) * 0.35}s;--c1:${pal[i % pal.length]};--c2:${pal[(i + 1) % pal.length]}"></span>`;
    }
    return s;
  };
  const calUrl = (c, v) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(c.title + " · " + S.first + " & " + S.second)}&dates=${c.start}/${c.end}&ctz=Asia/Kolkata&location=${encodeURIComponent(v.address)}&details=${encodeURIComponent(c.details)}`;
  let n = 0;
  const L = (cls, h, tag = "p") => `<${tag} class="ln ${cls}" style="--i:${n++}">${h}</${tag}>`;
  const Lx = (cls, h, tag = "div") => `<${tag} class="ln ${cls}" style="--i:${n++}">${h}</${tag}>`;

  /* Each painting's own top colour, so the text sits on clean sky */
  const SKY = { savedate: "#fddaad", invite: "#fcad84", court: "#fddaab", bairana: "#fcb48f", mehndi: "#fdd779", haldi: "#fdda7f", reception: "#fdb27b", baraat: "#fcb28c", wedding: "#fab894", closing: "#fcb48d" };
  const frame = (id, theme, inner, o = {}) => `
  <section class="frame frame--${theme}${o.img ? "" : " frame--plain"}" id="${id}" data-petals="${o.petals || ""}" data-burst="${o.burst || ""}">
    <div class="card">
      <div class="arch-gold" aria-hidden="true"></div>
      <div class="win" style="--sky:${SKY[o.img] || "#f4ede1"}">
        ${o.img ? `<div class="paintbox"><img class="paint" src="scenes/${o.img}.webp" alt="" aria-hidden="true" width="768" height="1344"${o.eager ? "" : ' loading="lazy"'}></div>` : ""}
        ${o.img ? '<div class="clouds" aria-hidden="true"><i></i><i></i><i></i></div>' : ""}
        ${o.deco || ""}
        <div class="content${o.top ? " content--" + o.top : ""}">${inner}</div>
        ${o.after || ""}
      </div>
    </div>
  </section>`;
  const lotus = `<img class="lotus-c lotus-c--l" src="brand/lotus-corner.png" alt="" aria-hidden="true" loading="lazy"><img class="lotus-c lotus-c--r" src="brand/lotus-corner.png" alt="" aria-hidden="true" loading="lazy">`;

  const pFirst = sideId === "groom" ? W.parents.groom : W.parents.bride;
  const pSecond = sideId === "groom" ? W.parents.bride : W.parents.groom;
  let html = "";

  /* 1. Shloka — the flower-string curtain lifts off this frame */
  n = 0;
  html += frame("top", "shloka",
    L("om", "ॐ", "div") + L("shloka", `${W.shloka[0]}<br>${W.shloka[1]}`) + L("tiny", "॥ श्री गणेशाय नमः ॥"),
    { img: "invite", eager: true, after: `<a class="cue" href="#invite" aria-label="Next"><span></span></a>` });

  /* 2. Invitation */
  n = 0;
  html += frame("invite", "invite",
    `<img class="mono ln" style="--i:${n++}" src="brand/monogram-v2.png" alt="${S.first} and ${S.second} monogram" width="813" height="729">` +
    L("script fam", S.family, "h1") +
    L("lead", "cordially invite you to celebrate the union of") +
    L("script name", pFirst.name, "h2") + L("parent", pFirst.line) +
    L("amp", "&amp;") +
    L("script name", pSecond.name, "h2") + L("parent", pSecond.line) +
    L("lead sm", "Join us as they begin their forever"),
    { img: "court" });

  /* 3. Peacock feathers open onto the date */
  n = 0;
  html += frame("date", "date",
    L("kicker", "Save the date") +
    L("script big", `${S.dateShort.replace(" January 2027", "")}<small>January 2027</small>`, "h2") +
    L("place", S.place) +
    `<div class="countdown ln" style="--i:${n++}" id="countdown" aria-live="polite"></div>` +
    L("lead", W.hero.tagline) +
    L("script closing", W.hero.closing) +
    Lx("btns", `<a class="btn" href="#events">View schedule</a><a class="btn btn--ghost" href="#travel">Travel info</a>`),
    { img: "savedate", after: `<img class="feathers" src="scenes/feathers.webp" alt="" aria-hidden="true" width="768" height="1344">` });

  /* 4. One frame per event */
  const events = [...S.firstEvents, ...W.sharedEvents];
  const dates = [...new Set(events.map((e) => e.date))];
  const deco = {
    haldi: () => `${A.birds()}<div class="ladis-top">${ladis(18, ["#ffcc1f", "#ffa51f", "#ffe066"], 30)}</div>`,
    bairana: () => `<div class="ladis-top">${ladis(16, ["#f39a1e", "#ffc83d", "#e8601c"], 24)}</div>`,
    mehndi: () => `<div class="ladis-top">${ladis(16, ["#3f8f3a", "#f4c542", "#d94c8a"], 24)}</div>`,
    reception: () => `<div class="lights-top">${A.lights()}</div>`,
    baraat: () => `${A.birds()}<div class="ladis-top">${ladis(18, ["#ff9f1c", "#ffffff", "#e8601c", "#ffc83d"], 24)}</div>`,
    wedding: () => `${A.birds()}<div class="ladis-top">${ladis(18, ["#e46b9b", "#ffffff", "#f7b8cf", "#c93c74"], 28)}</div>`
  };
  events.forEach((ev, idx) => {
    const v = W.venues[ev.venue]; n = 0;
    const times = ev.sessions.map((s) => `<span>${ev.sessions.length > 1 ? s.label + " · " : ""}${s.time}</span>`).join("");
    const note = ev.sessions.map((s) => s.note).filter(Boolean).join(" · ");
    html += frame(idx === 0 ? "events" : "ev-" + ev.theme, ev.theme,
      L("kicker", `Day ${dates.indexOf(ev.date) + 1}`) +
      L("script ev-title", `${ev.title}${ev.amp ? `<small>${ev.amp}</small>` : ""}`, "h2") +
      (ev.blurb ? L("blurb", ev.blurb) : "") +
      L("ev-date", ev.date) +
      L("ev-time", times) +
      (note ? L("ev-note", note) : "") +
      L("venue", `<b>${v.name}</b>${v.address}`) +
      L("links", `<a href="${v.google}" target="_blank" rel="noopener">Directions</a><span aria-hidden="true">·</span><a href="${calUrl(ev.cal, v)}" target="_blank" rel="noopener">Add to calendar</a>`),
      { img: ev.theme, deco: (deco[ev.theme] || (() => ""))(), petals: { haldi: "yellow", wedding: "pink", mehndi: "green", bairana: "marigold", baraat: "marigold" }[ev.theme] || "", burst: ev.theme === "wedding" ? "pink" : "" });
  });

  /* 5. Families, one frame per side */
  const famOrder = sideId === "groom" ? ["groom", "bride"] : ["bride", "groom"];
  famOrder.forEach((k, fi) => {
    const F = W.families[k]; n = 0;
    html += frame(fi === 0 ? "family" : "family-2", "family",
      L("kicker", "With blessings") +
      L("script sec", F.heading.replace("’s family", "’s Family"), "h2") +
      Lx("photo photo--land", `<img loading="lazy" src="${F.photo}" alt="Grandparents of ${k === "groom" ? "Pankaj" : "Muskan"}" data-zoom>`, "figure") +
      L("blessing", F.blessing) +
      Lx("groups", F.groups.map(([h, list]) => `<div><p class="kicker">${h}</p>${list.map((x) => `<p>${x}</p>`).join("")}</div>`).join("")) +
      L("addr", F.address),
      { deco: lotus, top: "list" });
  });

  /* 6. Our story */
  const st = W.story; n = 0;
  html += frame("story", "story",
    L("kicker", "How we began") + L("script sec", st.title, "h2") + L("sub", st.subtitle) +
    st.paragraphs.map((p) => L("para", p)).join("") +
    Lx("miles", st.milestones.map(([d, t]) => `<li><b>${d}</b><span>${t}</span></li>`).join(""), "ol"),
    { deco: lotus, top: "list" });

  /* 7. Moments + gallery, swiped sideways inside the arch */
  const slides = [...W.moments.map((m) => ({ src: m.src, alt: m.alt, t: m.title, s: m.sub })), ...W.gallery.map(([src, alt]) => ({ src, alt, t: "", s: "" }))];
  n = 0;
  html += frame("gallery", "gallery",
    L("kicker", "Our journey") + L("script sec", "Moments We Cherish", "h2") +
    Lx("rail", slides.map((p) => `<figure class="slide"><div class="photo"><img loading="lazy" src="${p.src}" alt="${esc(p.alt)}" data-zoom></div><figcaption>${p.t ? `<b>${p.t}</b><span>${p.s}</span>` : "&nbsp;"}</figcaption></figure>`).join("")) +
    Lx("dots", slides.map(() => "<i></i>").join("")) +
    Lx("ours", `${st.ours.map((l) => `<p>${l}</p>`).join("")}<cite>— ${S.first} &amp; ${S.second}</cite>`, "blockquote"),
    { top: "list" });

  /* 8. Travel */
  n = 0;
  let tr = L("kicker", "Getting there") + L("script sec", "Travel", "h2") + L("sub", S.travelNote);
  S.pins.forEach((k) => { const v = W.venues[k]; tr += Lx("pin", `<h3>${v.name}</h3><p>${v.address}</p><p class="links"><a href="${v.google}" target="_blank" rel="noopener">Google Maps</a><span aria-hidden="true">·</span><a href="${v.apple}" target="_blank" rel="noopener">Apple Maps</a></p>`); });
  if (S.departure) { const d = S.departure; tr += Lx("pin", `<h3>${d.label}</h3><p>${d.text}</p><p class="small">${d.distance} · ${d.route}</p>`); }
  tr += L("small", "Distances and drive times are approximate and depend on traffic.");
  html += frame("travel", "travel", tr, { deco: lotus, top: "list" });

  /* 9. FAQ */
  const faqs = S.faq.map((x) => (typeof x === "string" ? W.faqCommon[x] : x)); n = 0;
  html += frame("faq", "faq",
    L("kicker", "Good to know") + L("script sec", "Guest FAQ", "h2") + L("sub", S.faqSubtitle) +
    Lx("tip", `<b>${S.faqTip.label}</b> ${S.faqTip.text}`) +
    Lx("faq", faqs.map(([qq, a]) => `<details name="faq"><summary>${qq}</summary><p>${a}</p></details>`).join("")) +
    L("links", `<a href="https://wa.me/${S.phone}?text=${encodeURIComponent(`Hello, I have a question about ${S.first} & ${S.second}'s wedding.`)}" target="_blank" rel="noopener">Ask the family on WhatsApp</a>`),
    { top: "list" });

  /* 10. Blessings */
  n = 0;
  html += frame("blessings", "bless",
    L("kicker", "With love") + L("script sec", "Blessings Wall", "h2") + L("sub", "Leave a few words for the couple — your love is the gift") +
    `<div class="brail ln" style="--i:${n++}" id="wall" tabindex="0" aria-label="Blessings, swipe sideways"></div>` +
    `<button class="btn ln" style="--i:${n++}" type="button" id="openForm">Leave your blessing</button>`,
    { deco: lotus, top: "list" });

  /* 11. Closing */
  n = 0;
  html += frame("end", "end",
    L("kicker", "Join us in celebrating") +
    `<img class="mono mono--sm ln" style="--i:${n++}" src="brand/monogram-v2.png" alt="" width="813" height="729">` +
    L("script fam", `${S.first} &amp; ${S.second}`, "h2") +
    L("lead", "Join us in celebrating as we begin our forever.") +
    L("place", S.dateShort) +
    L("lead sm", "Your presence and blessings mean the world to us.") +
    L("tag", S.hashtag) +
    `<button class="secret-btn ln" style="--i:${n++}" type="button" id="secretBtn" aria-expanded="false" aria-label="A note just for you">✦</button>`,
    { img: "closing", petals: "pink", after: `<footer class="foot">Made with love for our families · © 2026 Pankaj &amp; Muskan</footer>` });

  document.getElementById("main").innerHTML = html;

  /* Opening curtain hangs inside the first arch */
  let cur = "";
  for (let i = 0; i < 15; i++) cur += `<span style="--d:${(i % 4) * 0.3}s;--c1:${i % 2 ? "#f6c7d6" : "#e9799f"};--c2:#fffaf2"></span>`;
  document.querySelector("#top .win").insertAdjacentHTML("beforeend", `<div class="curtain" id="curtain" aria-hidden="true">${cur}</div>`);

  /* Laptop side panel: names, date, live countdown and the chapter list */
  const LABEL = { top: "Invitation", invite: "The families invite", date: "Save the date", family: "Families", "family-2": "Families", story: "Our story", gallery: "Moments", travel: "Travel", faq: "Guest FAQ", blessings: "Blessings", end: "With love" };
  const sideItems = [...document.querySelectorAll(".frame")].map((f) => {
    const t = f.querySelector(".ev-title"); const k = f.querySelector(".kicker");
    return { id: f.id, label: t ? t.childNodes[0].textContent.trim() : LABEL[f.id] || "", day: t && k ? k.textContent : "" };
  }).filter((x, i, a) => x.label && a.findIndex((y) => y.label === x.label) === i);
  document.body.insertAdjacentHTML("afterbegin", `<aside class="side" aria-label="Wedding details">
    <div class="side__ring" aria-hidden="true"></div>
    <div class="side__in">
      <img class="side__mono" src="brand/monogram-v2.png" alt="" width="813" height="729">
      <p class="side__k">are getting married</p>
      <p class="side__names">${S.first}<i>&amp;</i>${S.second}</p>
      <p class="side__date">${S.dateShort}<span>${S.place}</span></p>
      <div class="side__count" id="sideCount" aria-hidden="true"></div>
      <nav class="side__nav" aria-label="Chapters">${sideItems.map((x) => `<a href="#${x.id}" data-f="${x.id}">${x.day ? `<small>${x.day}</small>` : ""}${x.label}</a>`).join("")}</nav>
      <p class="side__tag">${S.hashtag}</p>
    </div></aside>`);
  const sideLinks = [...document.querySelectorAll(".side__nav a")];

  /* ---------- Behaviour ---------- */
  const frames = [...document.querySelectorAll(".frame")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const progress = document.getElementById("progress");
  const menuLinks = [...document.querySelectorAll(".menu a:not(#waShare)")];
  let current = null;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || document.body.classList.contains("locked")) return;
    const f = e.target; current = f;
    f.classList.add("play");
    if (!f.dataset.fx) { f.dataset.fx = "1"; sceneFx(f); }
    const i = frames.indexOf(f);
    progress.style.setProperty("--p", ((i + 1) / frames.length).toFixed(3));
    let sOn = -1; sideLinks.forEach((a, k) => { const t = document.getElementById(a.dataset.f); if (t && frames.indexOf(t) <= i) sOn = k; });
    sideLinks.forEach((a, k) => a.classList.toggle("on", k === sOn));

    let on = -1; menuLinks.forEach((a, k) => { const t = document.querySelector(a.getAttribute("href")); if (t && frames.indexOf(t) <= i) on = k; });
    menuLinks.forEach((a, k) => a.classList.toggle("on", k === on));
  }), { threshold: 0.5 });

  // Countdown
  const cd = document.getElementById("countdown"), target = new Date(W.iso).getTime();
  function tick() {
    let d = Math.max(0, target - Date.now());
    const days = Math.floor(d / 864e5); d -= days * 864e5;
    const h = Math.floor(d / 36e5); d -= h * 36e5;
    const m = Math.floor(d / 6e4); const s = Math.floor((d - m * 6e4) / 1000);
    const vals = [[days, "Days"], [h, "Hours"], [m, "Mins"], [s, "Secs"]];
    [cd, document.getElementById("sideCount")].forEach((box) => {
      if (!box) return;
      if (!box.children.length) box.innerHTML = vals.map(([, l]) => `<div><b></b><span>${l}</span></div>`).join("");
      vals.forEach(([v], k) => { const b = box.children[k].firstElementChild, t = String(v).padStart(2, "0"); if (b.textContent !== t) { b.textContent = t; b.classList.remove("flip"); void b.offsetWidth; b.classList.add("flip"); } });
    });
  }
  tick(); setInterval(tick, 1000);

  // Opening tap: strings lift, music starts, the first frame plays
  const gate = document.getElementById("gate"), song = document.getElementById("song"), mBtn = document.getElementById("music");
  let playing = false;
  function setPlaying(p) { playing = p; mBtn.setAttribute("aria-pressed", String(p)); mBtn.setAttribute("aria-label", p ? "Mute music" : "Play music"); mBtn.classList.toggle("off", !p); }
  document.getElementById("gateBtn").addEventListener("click", () => {
    gate.classList.add("open"); document.getElementById("curtain").classList.add("lift");
    burst("gold", 60); setTimeout(() => burst("pink", 40), 300);
    song.volume = 0.6; song.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    setTimeout(() => { document.body.classList.remove("locked"); document.body.classList.add("opened"); frames.forEach((f) => io.observe(f)); }, 500);
    setTimeout(() => gate.remove(), 1400);
  });
  mBtn.addEventListener("click", () => { if (playing) { song.pause(); setPlaying(false); } else { song.play().then(() => setPlaying(true)).catch(() => {}); } });
  document.addEventListener("visibilitychange", () => { if (document.hidden && playing) song.pause(); else if (!document.hidden && playing) song.play().catch(() => {}); });

  document.getElementById("waShare").href = `https://wa.me/?text=${encodeURIComponent(`You're invited to ${S.first} & ${S.second}'s wedding · ${S.dateShort} · ${S.place}\n${location.href.split("#")[0]}`)}`;

  // Menu sheet
  const menu = document.getElementById("menu"), mOpen = document.getElementById("menuBtn");
  const setMenu = (o) => { menu.hidden = !o; mOpen.setAttribute("aria-expanded", String(o)); };
  mOpen.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a") || e.target === menu) setMenu(false); });

  // Blessings
  const wall = document.getElementById("wall");
  const card = (b) => `<figure class="bcard"><blockquote>${esc(b.message)}</blockquote><figcaption>— ${esc(b.name)}</figcaption></figure>`;
  wall.innerHTML = W.blessingsSeed.map(card).join("");
  fetch("blessings.json").then((r) => r.json()).then((list) => { wall.innerHTML += list.map(card).join(""); }).catch(() => {});
  const sheet = document.getElementById("bsheet");
  document.getElementById("openForm").addEventListener("click", () => { sheet.hidden = false; setTimeout(() => sheet.querySelector("input").focus(), 50); });
  sheet.addEventListener("click", (e) => { if (e.target === sheet || e.target.closest("[data-close]")) sheet.hidden = true; });
  document.getElementById("bform").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target), nm = String(fd.get("n")).trim(), msg = String(fd.get("m")).trim();
    if (!nm || !msg) return;
    window.open(`https://wa.me/${S.phone}?text=${encodeURIComponent(`Blessing for ${S.first} & ${S.second} 💐\n\n“${msg}”\n— ${nm}`)}`, "_blank", "noopener");
    sheet.hidden = true;
  });

  // Secret note
  const sb = document.getElementById("secretBtn"), sn = document.getElementById("secret");
  sn.querySelector(".secret__msg").textContent = W.secret;
  sb.addEventListener("click", () => { sn.hidden = false; sb.setAttribute("aria-expanded", "true"); });
  sn.addEventListener("click", () => { sn.hidden = true; sb.setAttribute("aria-expanded", "false"); });

  // Gallery dots
  const rail = document.querySelector(".rail"), dots = [...document.querySelectorAll(".dots i")];
  const setDot = () => { const w = rail.firstElementChild.getBoundingClientRect().width + 12; const i = Math.round(rail.scrollLeft / w); dots.forEach((d, k) => d.classList.toggle("on", k === i)); };
  rail.addEventListener("scroll", () => requestAnimationFrame(setDot), { passive: true }); setDot();

  // Lightbox
  const lb = document.getElementById("lightbox"), lbi = lb.querySelector("img");
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-zoom]"); if (!t) return; lbi.src = t.src; lbi.alt = t.alt; lb.hidden = false; });
  lb.addEventListener("click", () => (lb.hidden = true));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { lb.hidden = true; sheet.hidden = true; setMenu(false); } });

  /* Petals: a soft fall in the frame on screen, and a burst when the wedding frame arrives */
  const cv = document.getElementById("petals"), ctx = cv.getContext("2d");
  const PAL = { pink: ["#f49ab8", "#f7c0d2", "#e8638f", "#fde3ec"], yellow: ["#ffd23f", "#ffc21a", "#fff07a", "#ffb000"], marigold: ["#ff9f1c", "#ffbf3f", "#f26b1d"], green: ["#9cc46a", "#f4c542", "#e46b9b"], gold: ["#f6d47c", "#e6c57c", "#fff1c4", "#d9a441"] };
  let parts = []; const dpr = Math.min(2, devicePixelRatio || 1);
  const size = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; };
  size(); addEventListener("resize", size);
  const mk = (m, big) => ({ x: Math.random() * innerWidth, y: -20 - Math.random() * 60, s: (big ? 10 : 4) + Math.random() * (big ? 14 : 5), vy: big ? 3 + Math.random() * 4 : 0.6 + Math.random() * 1, vx: big ? 1 + Math.random() * 3 : 0, ph: Math.random() * 6.28, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * (big ? 0.15 : 0.05), c: PAL[m][Math.floor(Math.random() * PAL[m].length)], m, al: 0.9, big });
  function burst(m, count = 46) { if (reduce) return; for (let i = 0; i < count; i++) { const p = mk(m, true); p.x = Math.random() * innerWidth * 1.1 - innerWidth * 0.3; p.y = -40 - Math.random() * innerHeight * 0.5; parts.push(p); } }
  /* Scene changes like the video: something sweeps across the whole screen as each event arrives */
  function sweepImage(src) {
    if (reduce) return;
    const d = document.createElement("div"); d.className = "sweep"; d.innerHTML = `<img src="${src}" alt="">`;
    document.body.appendChild(d); setTimeout(() => d.remove(), 2200);
  }
  function blooms(n) {
    if (reduce) return;
    for (let i = 0; i < n; i++) parts.push({ bloom: true, x: innerWidth * (0.55 + Math.random() * 1.0), y: innerHeight * (0.55 + Math.random() * 1.0), s: 45 + Math.random() * 60, vx: -(4 + Math.random() * 3), vy: -(3.6 + Math.random() * 3), vr: (Math.random() - 0.5) * 0.06, rot: Math.random() * 6, al: 1, ph: 0, big: true, c: "" });
  }
  function sceneFx(f) {
    const t = (f.className.match(/frame--(\w+)/) || [])[1];
    if (t === "bairana" || t === "mehndi") sweepImage("scenes/feathers.webp");
    else if (t === "haldi") { blooms(22); setTimeout(() => burst("yellow", 30), 500); }
    else if (t === "reception") burst("gold", 70);
    else if (t === "baraat") { blooms(14); burst("marigold", 30); }
    else if (t === "wedding") { burst("pink", 90); setTimeout(() => burst("pink", 50), 400); }
    else if (t === "end") burst("pink", 40);
  }
  const marigoldImg = new Image(); marigoldImg.src = "scenes/marigold.png";
  function drawBloom(p) {
    if (marigoldImg.complete && marigoldImg.naturalWidth) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); const d = p.s * 2.1; ctx.drawImage(marigoldImg, -d / 2, -d / 2, d, d); ctx.restore(); return; }
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    const rings = [["#e9761a", 1, 14], ["#f6a02c", 0.74, 12], ["#ffc04a", 0.48, 10]];
    rings.forEach(([c, k, n]) => { ctx.fillStyle = c; for (let j = 0; j < n; j++) { ctx.save(); ctx.rotate((j / n) * Math.PI * 2 + k); ctx.beginPath(); ctx.ellipse(0, -p.s * k * 0.55, p.s * 0.16 * k + 3, p.s * k * 0.42, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } });
    ctx.fillStyle = "#b8501a"; ctx.beginPath(); ctx.arc(0, 0, p.s * 0.14, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function loop() {
    const m = current ? current.dataset.petals : "";
    if (m && parts.filter((p) => !p.big && !p.dust).length < (innerWidth < 600 ? 16 : 24) && Math.random() < 0.15) parts.push(mk(m, false));
    if (current && parts.filter((p) => p.dust).length < (innerWidth < 600 ? 22 : 40) && Math.random() < 0.3) {
      const g = PAL.gold; parts.push({ dust: true, x: Math.random() * innerWidth, y: innerHeight + 10, s: 1 + Math.random() * 2.2, vy: -(0.25 + Math.random() * 0.6), vx: 0, ph: Math.random() * 6.28, rot: 0, vr: 0, c: g[Math.floor(Math.random() * g.length)], al: 0, big: false, life: 0 });
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => {
      if (p.bloom) {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (p.x < -150 || p.y < -150) return false;
        drawBloom(p); return true;
      }
      p.y += p.vy; p.ph += 0.02; p.x += p.vx + Math.sin(p.ph) * 0.6; p.rot += p.vr;
      if (p.dust) {
        p.life++; p.al = Math.min(1, p.life / 60) * (0.45 + 0.45 * Math.sin(p.ph * 3));
        if (p.y < -10) return false;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.al); ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        return true;
      }
      if (!p.big && p.m !== m) p.al -= 0.025;
      if (p.al <= 0 || p.y > innerHeight + 30) return false;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.al; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.62, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      return true;
    });
    requestAnimationFrame(loop);
  }
  if (!reduce) requestAnimationFrame(loop);
})();
