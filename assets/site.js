(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const MEDIA = window.MEDIA || { photos: [], videos: [], guests: {} };
  const enc = (p) => p.split("/").map(encodeURIComponent).join("/");

  /* ---------- content ---------- */
  const PARTNERS = {
    "sustainaverse": { name: "Sustainaverse", type: "magazine", fit: "Your readers follow sustainability, and our guests include founders building with sustainable materials." },
    "luxe-code": { name: "Luxe Code", type: "magazine", fit: "Luxe Code covers art, design and luxury, and our guests are luxury designers and craft studios." },
    "family-interiors": { name: "Family Interiors", type: "magazine", fit: "Family Interiors champions architects and interior designers, the very people at our table." },
    "urban-nest": { name: "Dreams Per Square Feet", type: "magazine", fit: "Dreams Per Square Feet connects developers and designers, and our guests make the lighting, furniture and materials that fill those spaces." },
    "design-essentia": { name: "Design Essentia", type: "magazine", fit: "DE India celebrates Indian architecture, design and craft, the very work our guests make." },
    "insite": { name: "insite", type: "magazine", fit: "insite gives architecture, interiors, craft and heritage its undivided attention, and those are the worlds our guests come from." },
    "cb-curation": { name: "CB Curation", type: "pr", fit: "Your clients deserve their stories told well, and the show gives them a filmed conversation and a printed feature in one booking." },
    "first-step-pr": { name: "First Step PR", type: "pr", fit: "Your clients are looking for strong early features, and the show gives them a filmed conversation and a magazine column together." }
  };

  const GUESTS = [
    { slug: "siddhant-dhariwal", name: "Siddhant Dhariwal", role: "Indian luxury lighting designer", done: true },
    { slug: "shripat", name: "Shripat", role: "Founder, Weaving Vibe", done: true },
    { slug: "romit-savla", name: "Romit Savla", role: "Designer", done: false },
    { slug: "shailesh-rajput-design-studio", name: "Shailesh Rajput Design Studio", role: "Design studio", done: false }
  ];

  const COPY = {
    magazine: {
      sub: "A podcast on design, craft and material, now offering partner magazines one dedicated column a client, two to three clients every month.",
      journey: [
        ["A guest joins the show", "Designers, architects and material founders, chosen for the quality of their work.", "The Indian Material"],
        ["They opt into a feature", "Only guests who want press take part, so every column has a willing, engaged subject.", "The guest"],
        ["We record and photograph", "A long-form conversation on two cameras, with portraits and photographs of the work.", "The Indian Material"],
        ["You receive the feature kit", "A hero photograph, 250 to 350 words of copy, a pull quote and full credits, in one folder.", "Delivered to you"],
        ["You publish the column", "One dedicated column per client, in print or your digital edition, edited to your house style.", "The magazine"],
        ["We celebrate it together", "A collab post or story from the show introduces your title to our design audience.", "Both of us"]
      ],
      exLabel: "For magazines", exTitle: "The <em>exchange</em>", getTitle: "You receive",
      gets: [
        "Two to three curated features each month, without sending a writer or photographer.",
        "Finished copy and high-resolution photographs, ready for your edit.",
        "Credit as the show's media partner on featured episodes.",
        "Introductions to our audience in collab posts and stories.",
        "All content at no cost to the magazine."
      ],
      asks: [
        "One dedicated column for each client, with a photograph and a description.",
        "A fixed monthly slot, so guests can be promised a feature.",
        "A tag for @theindian.material and the guest when the feature goes live.",
        "A confirmed publishing date for each feature within the month."
      ],
      pilot: "You bring the readers who love design, and we bring the people shaping it. Together we can give Indian designers, makers and material founders the pages they deserve, month after month, and grow both our audiences along the way."
    },
    pr: {
      sub: "A podcast on design, craft and material. Your clients receive a filmed conversation and a dedicated column in a partner magazine, in a single booking.",
      journey: [
        ["You introduce a client", "A designer, studio, architect or material brand you represent.", "Your agency"],
        ["We agree the angle", "We research the client and shape the conversation around the work you want seen.", "Together"],
        ["We record and photograph", "A long-form conversation on two cameras, with portraits and photographs of the work.", "The Indian Material"],
        ["The episode goes live", "Short reels and an Instagram collab post with your client's page.", "The Indian Material"],
        ["The column is published", "With the feature, a dedicated column with a photograph and description in a partner magazine.", "Partner magazine"],
        ["You receive every asset", "Reels, photographs and the published column, ready for your client reports.", "Delivered to you"]
      ],
      exLabel: "For PR agencies", exTitle: "What your clients <em>receive</em>", getTitle: "Your clients receive",
      gets: [
        "A filmed long-form conversation that shows how they think, beyond their products.",
        "Short reels and a collab post they can use again.",
        "With the feature, a dedicated magazine column with a photograph and a description.",
        "One point of contact, from research to the published feature.",
        "Clear deliverables for your client reports."
      ],
      asks: [
        "Introductions to clients in design, craft, interiors or materials.",
        "One contact on your side to approve the angle and final copy.",
        "Existing client photographs and brand assets, where available.",
        "Payment for the episode and, where chosen, the feature before recording."
      ],
      pilot: "You represent brands with stories worth telling, and we know how to tell them on camera and in print. Together we can give your clients lasting coverage, month after month, and grow our work side by side."
    }
  };

  const PARTS = [
    ["The hero photograph", "One high-resolution image from the episode shoot, of the person or the piece."],
    ["The kicker", "A line crediting the conversation, so readers can find the full episode."],
    ["The headline", "Written around the person and the one piece their story turns on."],
    ["The pull quote", "Taken word for word from the recorded conversation and approved by the guest."],
    ["The description", "250 to 350 words drafted from the episode, yours to edit to house style."],
    ["Credits and handles", "Guest, studio, photographer and Instagram handles, checked before delivery."]
  ];

  const WEEKS = [
    ["Week one", "Record", "The conversation and the photographs, in one studio session."],
    ["Week two", "Write", "We draft the column from the transcript and select the photographs."],
    ["Week three", "Deliver", "The guest approves, and the feature kit reaches your desk."],
    ["Week four", "Publish", "The column goes live and the show shares it with its audience."]
  ];

  /* ---------- state ---------- */
  const key = (location.hash || "").slice(1);
  const partner = PARTNERS[key] || null;
  let mode = partner ? partner.type : (key === "pr" ? "pr" : "magazine");
  let stage = 0;
  let pace = 2;

  if (partner) {
    $("prepared").textContent = "Prepared for " + partner.name + " · November 2026";
  }

  /* ---------- nav ---------- */
  const nav = $("nav");
  const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- audience switches ---------- */
  function makeSwitch(el) {
    el.innerHTML = '<button type="button" data-m="magazine">Magazines</button><button type="button" data-m="pr">PR agencies</button>';
    el.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      mode = b.dataset.m;
      stage = 0;
      renderMode();
    });
  }
  makeSwitch($("aud-journey"));
  makeSwitch($("aud-exchange"));

  function renderMode() {
    const c = COPY[mode];
    document.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.m === mode)));
    $("hero-sub").textContent = (partner ? partner.fit + " " : "") + c.sub;
    $("ex-label").textContent = c.exLabel;
    $("ex-title").innerHTML = c.exTitle;
    $("get-title").textContent = c.getTitle;
    $("gets").innerHTML = c.gets.map((x) => "<li>" + x + "</li>").join("");
    $("asks").innerHTML = c.asks.map((x) => "<li>" + x + "</li>").join("");
    $("pilot-text").textContent = c.pilot;
    $("invest").hidden = mode !== "pr";
    renderJourney();
  }

  /* ---------- journey ---------- */
  const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
  function renderJourney() {
    const steps = COPY[mode].journey;
    const track = $("track");
    track.querySelectorAll(".stop").forEach((n) => n.remove());
    steps.forEach((s, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "stop" + (i < stage ? " past" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(i === stage));
      b.innerHTML = '<span class="node">' + ROMAN[i] + '</span><span class="t">' + s[0] + "</span>";
      b.addEventListener("click", () => { stage = i; renderJourney(); });
      b.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          stage = (stage + (e.key === "ArrowRight" ? 1 : steps.length - 1)) % steps.length;
          renderJourney();
          track.querySelectorAll(".stop")[stage].focus();
        }
      });
      track.appendChild(b);
    });
    $("fillline").style.width = (stage / (steps.length - 1)) * (100 - 100 / steps.length) + "%";
    const s = steps[stage];
    $("detail").innerHTML = '<span class="num">' + ROMAN[stage] + '</span><div><h3>' + s[0] + "</h3><p>" + s[1] +
      '</p><div class="who">' + s[2] + "</div></div>";
  }

  /* ---------- guests ---------- */
  $("guest-list").innerHTML = GUESTS.map((g) => {
    const photo = MEDIA.guests && MEDIA.guests[g.slug];
    const initials = g.name.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
    const pic = photo ? '<img src="' + enc(photo) + '" alt="' + g.name + '" loading="lazy">' : '<span class="mono" aria-hidden="true">' + initials + "</span>";
    return '<article class="guest' + (g.done ? " done" : "") + '"><div class="portrait">' + pic + '</div><span class="status"><i></i>' +
      (g.done ? "Recorded" : "Up next") + "</span><h3>" + g.name + "</h3><p>" + g.role + "</p></article>";
  }).join("");

  /* ---------- column anatomy ---------- */
  const spread = $("spread");
  const hots = PARTS.map((p, i) => {
    const h = document.createElement("span");
    h.className = "hot";
    h.textContent = i + 1;
    spread.appendChild(h);
    return h;
  });
  function placeHots() {
    const r = spread.getBoundingClientRect();
    spread.querySelectorAll("[data-part]").forEach((el) => {
      const i = +el.dataset.part;
      const e = el.getBoundingClientRect();
      const x = i === 0 ? e.left + 30 : e.left - 19;
      const y = i === 0 ? e.bottom - 30 : e.top + Math.min(e.height / 2, 14);
      hots[i].style.left = (x - r.left) + "px";
      hots[i].style.top = (y - r.top) + "px";
    });
  }
  $("parts").innerHTML = PARTS.map((p, i) =>
    '<li><button type="button" data-p="' + i + '" aria-pressed="' + (i === 0) + '"><span class="n">' + (i + 1) +
    "</span><b>" + p[0] + '</b><span class="d">' + p[1] + "</span></button></li>").join("");
  function selectPart(i) {
    document.querySelectorAll("#parts button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.p === i)));
    hots.forEach((h, k) => h.classList.toggle("on", k === i));
  }
  $("parts").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) selectPart(+b.dataset.p); });
  $("parts").addEventListener("mouseover", (e) => { const b = e.target.closest("button"); if (b) selectPart(+b.dataset.p); });
  window.addEventListener("resize", placeHots);
  window.addEventListener("load", placeHots);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeHots);
  placeHots();
  selectPart(0);

  /* ---------- monthly rhythm ---------- */
  $("month").innerHTML = WEEKS.map((w, i) =>
    '<div class="week"><span class="w">' + w[0] + "</span><h4>" + w[1] + "</h4><p>" + w[2] +
    '</p><span class="bar"><i style="transform:scaleX(' + ((i + 1) / 4) + ')"></i></span></div>').join("");
  $("pace").innerHTML = '<button type="button" data-pace="2">Two</button><button type="button" data-pace="3">Three</button>';
  function renderPace() {
    document.querySelectorAll("[data-pace]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.pace === pace)));
    $("f-month").textContent = pace;
    $("f-year").textContent = pace * 12;
    let cols = "";
    for (let i = 0; i < 36; i++) cols += '<i class="' + (i < pace * 12 ? "" : "off") + '"></i>';
    $("cols").innerHTML = cols;
  }
  $("pace").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { pace = +b.dataset.pace; renderPace(); } });
  renderPace();

  /* ---------- gallery + lightbox ---------- */
  // The gallery shows guest reels (up to 4) and a short, chosen set of photographs.
  const GALLERY_PHOTOS = ["The Dhariwal episode - wide", "Siddhant Dhariwal - with host Nileshd Khandekar", "Host and guest - between takes"];
  const MAX_REELS = 4;
  const reels = (MEDIA.videos || []).filter((v) => !/^Nileshd Khandekar/i.test(v.caption)).slice(0, MAX_REELS);
  const chosen = GALLERY_PHOTOS.map((c) => (MEDIA.photos || []).find((p) => p.caption === c)).filter(Boolean);
  const photos = chosen.length ? chosen : (MEDIA.photos || []).slice(0, 3);
  const items = [].concat(
    reels.map((v) => ({ kind: "video", src: v.src, caption: v.caption })),
    photos.map((p) => ({ kind: "photo", src: p.src, caption: p.caption }))
  );
  const gal = $("gal");
  if (!gal) {
    // gallery section removed from the page
  } else if (!items.length) {
    gal.innerHTML = '<p style="color:var(--stone)">Add photographs to media/photos and films to media/videos, then run update-media.ps1.</p>';
  } else {
    gal.innerHTML = items.map((it, i) => {
      const inner = it.kind === "video"
        ? '<video src="' + enc(it.src) + '#t=1" muted playsinline preload="metadata"></video><span class="play">Play film</span>'
        : '<img src="' + enc(it.src) + '" alt="' + it.caption + '" loading="lazy">';
      return '<button type="button" class="tile" data-i="' + i + '"><span class="fr">' + inner + '</span><span class="cap">' + it.caption + "</span></button>";
    }).join("");
  }
  let box = null;
  function closeBox() { if (box) { box.remove(); box = null; } }
  if (gal) {
    const step = () => gal.clientWidth * 0.7;
    $("g-prev").addEventListener("click", () => gal.scrollBy({ left: -step(), behavior: "smooth" }));
    $("g-next").addEventListener("click", () => gal.scrollBy({ left: step(), behavior: "smooth" }));
    gal.addEventListener("click", (e) => {
      const t = e.target.closest(".tile");
      if (t) openBox(items[+t.dataset.i]);
    });
  }
  const hostFilm = (MEDIA.videos || []).find((v) => /^Nileshd Khandekar/i.test(v.caption));
  const watch = $("watch-host");
  if (hostFilm) watch.addEventListener("click", () => openBox({ kind: "video", src: hostFilm.src, caption: hostFilm.caption }));
  else watch.hidden = true;
  function openBox(it) {
    box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", it.caption);
    const media = it.kind === "video"
      ? '<video src="' + enc(it.src) + '" controls autoplay playsinline></video>'
      : '<img src="' + enc(it.src) + '" alt="' + it.caption + '">';
    box.innerHTML = '<button type="button" class="btn close">Close</button><div class="stage">' + media + '<span class="cap">' + it.caption + "</span></div>";
    box.addEventListener("click", (ev) => { if (ev.target === box || ev.target.classList.contains("close")) closeBox(); });
    document.body.appendChild(box);
    box.querySelector(".close").focus();
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBox(); });

  /* ---------- copy email ---------- */
  $("copy").addEventListener("click", () => {
    const text = $("email").textContent;
    const done = () => { $("toast").textContent = "Email address copied"; };
    const fallback = () => {
      const r = document.createRange();
      r.selectNodeContents($("email"));
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      $("toast").textContent = "Selected. Press Ctrl+C to copy";
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  });

  renderMode();
})();
