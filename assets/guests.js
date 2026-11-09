(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const MEDIA = window.MEDIA || { guests: {} };
  const enc = (p) => p.split("/").map(encodeURIComponent).join("/");

  /* Personal links: guests.html#romit-savla shows "Prepared for Romit Savla". Add more names here. */
  const PEOPLE = {
    "romit-savla": { name: "Romit Savla", first: "Romit" },
    "shailesh-rajput": { name: "Shailesh Rajput Design Studio", first: "Shailesh" }
  };
  const key = (location.hash || "").slice(1);
  const person = PEOPLE[key] || null;
  if (person) {
    $("prepared").textContent = "Prepared for " + person.name + " · November 2026";
    $("hero-sub").textContent = "One podcast conversation with " + person.first +
      ", turned into 9 premium reels and 1 carousel. You show up and talk about your work. We handle everything else.";
  }

  /* nav */
  const nav = $("nav");
  const onScroll = () => nav.classList.toggle("solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* the ten pieces (from the content plan) */
  const PIECES = [
    ["Reel 1", "The beginning", "The moment I knew I'd be a designer", "Viewers connect with you as a person."],
    ["Reel 2", "Signature project", "This project changed how I design", "Shows your best work, scene by scene."],
    ["Reel 3", "Myth buster", "Good design is not about expensive materials", "Positions you as the expert."],
    ["Reel 4", "Material and craft", "Why I chose this material over the obvious one", "Shows the depth of your thinking."],
    ["Reel 5", "Price vs value", "What you're really paying for in a designer", "Answers the fee question before it is asked."],
    ["Reel 6", "Client mistakes", "The biggest mistake people make before hiring a designer", "Brings in enquiries from people about to start a project."],
    ["Reel 7", "Process", "From the first brief to the final reveal", "Builds trust in how you work."],
    ["Reel 8", "Hot take", "A trend I will never follow", "A strong opinion that people share and comment on."],
    ["Reel 9", "Advice", "What I'd tell my younger self", "Ends the series on a memorable, emotional note."],
    ["Carousel", "Lessons", "10 lessons from " + (person ? person.name : "you"), "A post people save, with your best quotes and project images."]
  ];
  let sel = 0;
  function renderPieces() {
    $("tiles").innerHTML = PIECES.map((p, i) => {
      const isC = p[0] === "Carousel";
      return '<button type="button" role="tab" class="tile9' + (isC ? " carousel" : "") + '" data-i="' + i + '" aria-selected="' + (i === sel) + '">' +
        (isC ? '<span class="stack" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' : "") +
        '<span class="no">' + (isC ? "Carousel" : i + 1) + '</span><span class="nm">' + p[1] + "</span></button>";
    }).join("");
    const p = PIECES[sel];
    $("reel-detail").innerHTML = '<span class="kind">' + p[0] + (p[0] === "Carousel" ? " · 8–10 slides" : " · 60–90 seconds") +
      "</span><h3>" + p[1] + '</h3><p class="hook">“' + p[2] + '”</p><p class="does"><b>What it does for you.</b> ' + p[3] + "</p>";
  }
  $("tiles").addEventListener("click", (e) => { const b = e.target.closest(".tile9"); if (b) { sel = +b.dataset.i; renderPieces(); } });
  $("tiles").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    sel = (sel + (e.key === "ArrowRight" ? 1 : PIECES.length - 1)) % PIECES.length;
    renderPieces();
    $("tiles").querySelectorAll(".tile9")[sel].focus();
  });
  renderPieces();

  /* your part vs our part */
  const YOU = [
    "A 20-minute call before the shoot to agree on stories and topics",
    "2–3 hours on the shoot day, at your studio or at ours",
    "Photos and videos of 5–10 projects you want featured",
    "Your logo, Instagram handle and any credits that must appear",
    "Feedback on the edits within 48 hours, so the schedule holds",
    "Accepting each Instagram collab invite on the day it goes live"
  ];
  const US = [
    ["Research", "A study of your projects, press and social pages, so every question draws out a story"],
    ["Scripting", "Episode questions, 9 reel hooks and the carousel outline, shared for approval before the shoot"],
    ["Shoot day", "2 cameras, lapel mics, lighting and crew, for about 2–3 hours of filming"],
    ["Editing", "9 reels in the premium style: two-font captions, B-roll of your projects, graphs, animated scenes, cleaned-up voice, music and sound design"],
    ["Carousel", "1 designed carousel of 8–10 slides with your best lines and project images"],
    ["Revisions", "2 rounds of changes on every reel and on the carousel"],
    ["Copy", "Caption, hashtags, alt text and a pinned comment for every post"],
    ["Posting", "Collab posts on both pages, scheduled at peak time (7:30 PM IST)"],
    ["Report", "Views, reach, saves, shares and profile visits for every post, 30 days after the last one"]
  ];
  $("you-list").innerHTML = YOU.map((x) => "<li>" + x + "</li>").join("");
  $("us-list").innerHTML = US.map((x) => "<li><b>" + x[0] + "</b><span>" + x[1] + "</span></li>").join("");

  /* timeline */
  const WEEKS = [
    ["Week 1", "1", "Confirm and research", "The package is agreed, the shoot date is fixed and we study your work.", false],
    ["Week 2", "2", "Script", "A pre-shoot call, then the questions, 9 hooks and carousel outline come to you for approval.", false],
    ["Gate", "₹", "Advance paid", "₹12,500, on confirming the shoot date.", true],
    ["Week 3", "3", "Shoot day", "2–3 hours with two cameras, mics, lights and crew.", false],
    ["Weeks 4–5", "4–5", "Edit and revise", "The 9 reels and the carousel, with two rounds of changes.", false],
    ["Gate", "₹", "Edits approved", "The balance of ₹12,500, before the first post goes live.", true],
    ["Weeks 6–9", "6–9", "Posting", "10 collab posts, 2–3 a week at 7:30 PM IST.", false],
    ["Week 13", "13", "Results report", "Views, reach, saves and shares, 30 days after the last post.", false]
  ];
  let wsel = 3;
  function renderWeeks() {
    $("weeks").innerHTML = WEEKS.map((w, i) =>
      '<button type="button" role="tab" class="wk' + (w[4] ? " gate" : "") + '" data-i="' + i + '" aria-selected="' + (i === wsel) + '">' +
      '<span class="dot"><span>' + w[1] + '</span></span><span class="t">' + w[2] + "</span></button>").join("");
    const w = WEEKS[wsel];
    $("week-detail").innerHTML = '<span class="when">' + w[0] + "</span><div><h3>" + w[2] + "</h3><p>" + w[3] + "</p></div>";
  }
  $("weeks").addEventListener("click", (e) => { const b = e.target.closest(".wk"); if (b) { wsel = +b.dataset.i; renderWeeks(); } });
  renderWeeks();

  /* investment toggle */
  $("addon").addEventListener("change", (e) => {
    const on = e.target.checked;
    $("total").textContent = on ? "30,000 – 32,000" : "25,000";
    $("price-sub").textContent = on ? "Episode package plus a magazine feature" : "All-inclusive · about ₹2,500 per finished piece";
    $("addon-row").hidden = !on;
  });

  /* guests so far */
  const GUESTS = [
    { slug: "siddhant-dhariwal", name: "Siddhant Dhariwal", role: "Indian luxury lighting designer", done: true },
    { slug: "shripat", name: "Shripat", role: "Founder, Weaving Vibe", done: true },
    { slug: "romit-savla", name: "Romit Savla", role: "Designer", done: false },
    { slug: "shailesh-rajput", name: "Shailesh Rajput Design Studio", role: "Design studio", done: false }
  ];
  const gphoto = (slug) => (MEDIA.guests || {})[slug] || (MEDIA.guests || {})[slug + "-design-studio"];
  $("guest-list").innerHTML = GUESTS.map((g) => {
    const photo = gphoto(g.slug);
    const initials = g.name.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
    const pic = photo ? '<img src="' + enc(photo) + '" alt="' + g.name + '" loading="lazy">' : '<span class="mono" aria-hidden="true">' + initials + "</span>";
    const isYou = person && key === g.slug;
    const status = isYou ? '<span class="you-tag">You, up next</span>' : (g.done ? "Recorded" : "Up next");
    return '<article class="guest' + (g.done ? " done" : "") + '"><div class="portrait">' + pic + '</div><span class="status"><i></i>' +
      status + "</span><h3>" + g.name + "</h3><p>" + g.role + "</p></article>";
  }).join("");

  /* next steps */
  const who = person ? person.first : "You";
  $("next-list").innerHTML = [
    who + " confirms the package and picks a shoot date",
    "Advance of ₹12,500 paid",
    "Pre-shoot call, then questions and hooks shared for approval",
    "Shoot day",
    "First edits shared for review"
  ].map((x) => "<li>" + x + "</li>").join("");

  /* copy email */
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
})();
