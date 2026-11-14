(() => {
  const $ = id => document.getElementById(id);
  const NS = "http://www.w3.org/2000/svg";
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const sv = (tag, attrs = {}, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tt = $("tt");
  addEventListener("scroll", () => { tt.hidden = true; }, { passive: true });
  let tab = "home", busy = false;
  const LIVE = "__LIVE_URL__";
  const API_BASE = (/\.onrender\.com$/.test(location.hostname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) ? "" : LIVE;
  const has = v => Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== "";

  /* ---------- Pages: home, the guide sections, market prices ---------- */
  const SEGS = { what: ["What to make", "Product ideas for a spice unit: raw materials, seasons, difficulty and what to watch out for."], how: ["How to make it", "Step by step for each product, with the FSSAI moisture limit you have to meet."], setup: ["Machines & setup", "The order of things from idea to first sale, and the machines a small unit needs."], standards: ["Machine standards", "The hygiene, safety and spice-industry standards that good spice machines are built to, and what to ask for when you buy one."], licences: ["Licences & schemes", "Registrations and licences for a spice unit in India and Kerala, and schemes that can help with money."], quality: ["Quality & hygiene", "The tests buyers and FSSAI expect, a hygienic factory, labels, storage, and fixing common problems."], cost: ["Calculators", "Cost and price per pack, and how much of each spice to weigh out for a masala batch."] };
  let gSeg = store.get("sc.gseg2", "what"), gHow = store.get("sc.ghow", "Turmeric powder");
  if (!SEGS[gSeg]) gSeg = "what";
  function renderCurrent() { if (tab === "home") renderHome(); if (tab === "guide") renderGuide(); if (tab === "prices") renderPrices(); }
  function navState() {
    $("t-home").setAttribute("aria-current", tab === "home" ? "page" : "false");
    $("t-prices").setAttribute("aria-current", tab === "prices" ? "page" : "false");
    document.querySelectorAll(".nav-item[data-seg]").forEach(b => b.setAttribute("aria-current", tab === "guide" && b.dataset.seg === gSeg ? "page" : "false"));
  }
  function showTab(name, seg) {
    if (name === "chat") { setChat(true); return; }
    if (SEGS[name]) { seg = name; name = "guide"; }
    if (!["home", "guide", "prices"].includes(name)) name = "home";
    if (seg && SEGS[seg]) { gSeg = seg; store.set("sc.gseg2", seg); }
    tab = name;
    ["home", "guide", "prices"].forEach(n => { $("v-" + n).hidden = n !== name; });
    navState(); tt.hidden = true;
    renderCurrent();
    scrollTo(0, 0);
    try { history.replaceState(null, "", location.pathname + location.search + (name === "home" ? "" : "#" + (name === "guide" ? gSeg : name))); } catch {}
    onScroll();
  }
  function setChat(open) {
    const panel = $("v-chat"), fab = $("chatFab");
    panel.hidden = !open;
    document.body.classList.toggle("chat-open", open);
    fab.setAttribute("aria-expanded", String(open));
    fab.innerHTML = open ? '<span aria-hidden="true">✕</span><span class="fab-text">Close chat</span>' : '<span aria-hidden="true">💬</span><span class="fab-text">Ask the advisor</span>';
    fab.setAttribute("aria-label", open ? "Close chat" : "Ask the AI advisor");
    store.set("sc.chatOpen", open);
    if (open) { msgs.scrollTop = msgs.scrollHeight; if (innerWidth > 600) $("q").focus(); }
  }
  $("t-home").onclick = () => showTab("home");
  $("t-prices").onclick = () => showTab("prices");
  document.querySelectorAll(".nav-item[data-seg]").forEach(b => b.onclick = () => showTab("guide", b.dataset.seg));
  document.querySelectorAll("[data-seg-go]").forEach(b => b.addEventListener("click", () => showTab("guide", b.dataset.segGo)));
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => showTab(b.dataset.go)));
  document.querySelectorAll("[data-q]").forEach(b => b.addEventListener("click", () => send(b.dataset.q)));
  $("brandBtn").onclick = () => showTab("home");
  $("chatFab").onclick = () => setChat($("v-chat").hidden);
  $("chatClose").onclick = () => setChat(false);
  $("heroAsk").onclick = () => setChat(true);
  addEventListener("keydown", e => { if (e.key === "Escape" && !$("v-chat").hidden) setChat(false); });
  addEventListener("hashchange", () => { const h = location.hash.slice(1) || "home"; if (SEGS[h]) { if (!(tab === "guide" && gSeg === h)) showTab("guide", h); } else if (h !== tab) showTab(h); });

  /* ---------- Theme, scroll ---------- */
  const themeBtn = $("themeBtn");
  const curTheme = () => document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  function labelTheme() { const d = curTheme() === "dark"; themeBtn.textContent = d ? "🌙 Theme" : "☀️ Theme"; themeBtn.setAttribute("aria-label", "Switch to " + (d ? "light" : "dark") + " theme"); }
  try { const t = store.get("sc.theme", null); if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t); } catch {}
  themeBtn.onclick = () => { const next = curTheme() === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next); store.set("sc.theme", next); labelTheme(); };
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", labelTheme); } catch {}
  const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function onScroll() { const h = document.documentElement.scrollHeight - innerHeight; $("scrollProgress").style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + "%"; $("toTop").hidden = scrollY < 600; }
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
  $("toTop").onclick = () => scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
  function tipOn(target, html) {
    const show = e => { tt.innerHTML = html; tt.hidden = false; const p = e.touches ? e.touches[0] : e; let x = (p && p.clientX != null ? p.clientX : 0) + 14, y = (p && p.clientY != null ? p.clientY : 0) + 14; if (x + tt.offsetWidth > innerWidth - 8) x = Math.max(8, x - tt.offsetWidth - 28); tt.style.left = x + "px"; tt.style.top = y + "px"; };
    target.addEventListener("pointerenter", show); target.addEventListener("pointermove", show); target.addEventListener("pointerleave", () => { tt.hidden = true; });
  }

  /* ---------- Home ---------- */
  const CORE = [["🌾", "Buy & inspect"], ["🧹", "Clean"], ["☀️", "Dry"], ["🔥", "Roast (some)"], ["⚙️", "Grind"], ["🔄", "Sieve & blend"], ["🔬", "Test"], ["📦", "Pack & label"]];
  function renderHome() {
    const gc = $("guideCards"); gc.replaceChildren();
    [["🧭", "What to make", "10 product ideas with raw materials, seasons and difficulty.", "what"], ["🛠️", "How to make it", "Step by step for powders, masalas, pepper and whole spices.", "how"], ["⚙️", "Machines & setup", "What to buy, how to lay out a small unit, and the roadmap.", "setup"], ["📐", "Machine standards", "EHEDG, ISO 14159, EN 1672-2, dust-explosion rules, ASTA and ESA; a buying checklist.", "standards"], ["📋", "Licences & schemes", "FSSAI, Udyam, GST, pollution board, export, PMFME.", "licences"], ["🔬", "Quality & hygiene", "Tests, hygiene, labels, storage and common problems.", "quality"], ["🧮", "Calculators", "Cost, selling price and MRP; masala batch weights.", "cost"]].forEach(([ic, t, d, seg]) => {
      const b = el("button", "hcard gcard"); b.type = "button"; b.append(el("span", "si", ic), el("b", null, t), el("span", null, d));
      b.onclick = () => showTab("guide", seg); gc.append(b);
    });
    const rm = $("roadMini"); rm.replaceChildren();
    SETUP.slice(0, 8).forEach(([t], i) => { const s = el("button", "stepm"); s.type = "button"; s.append(el("span", "si", String(i + 1)), el("b", null, t)); s.onclick = () => showTab("guide", "setup"); rm.append(s); });
    const sm = $("stepsMini"); sm.replaceChildren();
    CORE.forEach(([ic, t], i) => { const s = el("div", "stepm light"); s.append(el("span", "si", ic), el("b", null, `${i + 1}. ${t}`)); sm.append(s); });
    renderTicker();
  }
  function renderTicker() {
    const box = $("homeTicker"); if (!box) return;
    const P = MKT.prices || {}, rows = [...(P.india_official || []), ...(P.india_ai || [])];
    const want = [/pepper/i, /cardamom/i, /turmeric/i, /chill/i, /clove/i, /nutmeg/i, /coriander/i, /cumin|jeera/i];
    const pick = []; want.forEach(re => { const r = rows.find(x => re.test(x.spice) && !pick.includes(x)); if (r) pick.push(r); });
    if (!pick.length) { box.replaceChildren(el("p", "note", navigator.onLine === false ? "Offline. Today's prices appear when you're back online." : "Loading today's prices…")); return; }
    box.replaceChildren();
    pick.slice(0, 6).forEach(r => { const c = el("div", "tk"); c.append(el("span", null, r.spice + (r.grade ? " · " + r.grade : "")), el("b", null, "₹" + fmtN(r.price)), el("small", null, `per kg · ${r.market} · ${niceDate(r.date)}`)); box.append(c); });
  }

  /* ---------- Chat: the AI advisor ---------- */
  const msgs = $("msgs");
  function md(target, text) {
    try { if (window.marked && window.DOMPurify) { target.innerHTML = DOMPurify.sanitize(marked.parse(text)); target.querySelectorAll("table").forEach(t => { const w = el("div", "tw"); t.replaceWith(w); w.append(t); }); target.querySelectorAll("a").forEach(a => { a.target = "_blank"; a.rel = "noopener"; }); return; } } catch {}
    target.textContent = text;
  }
  const HIST_KEY = "sc.chat2";
  let hist = store.get(HIST_KEY, []), restoring = false; if (!Array.isArray(hist)) hist = [];
  function remember(role, text) { if (restoring) return; hist.push([role, String(text).slice(0, 6000)]); if (hist.length > 60) hist = hist.slice(-60); store.set(HIST_KEY, hist); }
  function userSay(text) { remember("u", text); const m = el("div", "msg user"); m.append(el("div", "bubble", text)); msgs.append(m); msgs.scrollTop = msgs.scrollHeight; }
  function renderChips(box, chips) {
    if (!chips || !chips.length) return;
    const row = el("div", "chips");
    chips.forEach(c => { const b = el("button", "qchip", c.label); b.type = "button"; b.onclick = () => { if (!c.go) return send(c.q); if (c.how) { gHow = c.how; store.set("sc.ghow", c.how); } setChat(innerWidth > 900); showTab(c.go, c.seg); }; row.append(b); });
    box.append(row);
  }
  function botSay(text, chips) {
    remember("b", text);
    const m = el("div", "msg bot"); const av = el("div", "av co"); av.setAttribute("aria-hidden", "true");
    const col = el("div", "col"); const b = el("div", "bubble"); md(b, text);
    col.append(b); renderChips(col, chips); m.append(av, col); msgs.append(m); msgs.scrollTop = msgs.scrollHeight;
    return { m, b, col };
  }
  function sourceTag(out, label) { const meta = el("div", "meta"); meta.append(el("span", "aitag", label)); out.col.insertBefore(meta, out.b.nextSibling); }
  const N = s => s.toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  const CHIPS = [{ label: "Where do I begin?", q: "I want to start a small spice powder unit. Where do I begin?" }, { label: "What should I make?", q: "What should I manufacture first?" }, { label: "Licences needed", q: "Which licences do I need for a spice unit?" }, { label: "Machines needed", q: "What machines do I need?" }, { label: "Price my packs", q: "How do I work out the cost and MRP of my packs?" }];
  function respond(text) {
    const t = N(text);
    if (/^(hi+|hello|hey|hai|namaskaram|namaste|good (morning|afternoon|evening))\b/.test(t) && t.split(" ").length <= 4) return { text: "Hello! 👋 I'm the **AI advisor** for spice manufacturing. Ask me what to make, how to make it, which machines and licences you need, how to fix quality problems, or how to price your packs.", chips: CHIPS, local: true };
    if (/^(thanks|thank you|thx|ok thanks|great|super)\b/.test(t)) return { text: "You're welcome! Anything else about your spice unit?", chips: CHIPS, local: true };
    if (/\b(who are you|what are you|are you (a )?(bot|human|ai))\b/.test(t)) return { text: "I'm an AI advisor for people who make spices, or want to. I use this guide and today's market prices. I can be wrong, so check important rules and numbers before you invest.", chips: CHIPS, local: true };
    const g = guideAnswer(text); if (g) return { ...g, local: false };
    if (/\b(store|storage|shelf life|expiry|keep fresh)\b/.test(t)) return { text: "**Keeping spices fresh**\n\n" + STORE_TIPS.map(([a, b]) => `- **${a}**: ${b}`).join("\n"), chips: [{ label: "Quality & hygiene", go: "guide", seg: "quality" }], local: false };
    if (/\b(test|testing|lab|quality|adulter|aflatoxin|pesticide|microb)\b/.test(t)) return { text: "**Quality tests for spices**\n\n" + TESTS.map(([a, b]) => `- **${a}**: ${b}`).join("\n"), chips: [{ label: "Quality & hygiene", go: "guide", seg: "quality" }], local: false };
    if (/\b(label|labelling|labeling|packaging|pack design)\b/.test(t)) return { text: "**What an FSSAI label needs**\n\n" + LABEL.map(x => `- ${x}`).join("\n"), chips: [{ label: "Quality & hygiene", go: "guide", seg: "quality" }], local: false };
    if (/\b(market price|today'?s price|price of|rate of|auction|spices board price|commodity)\b/.test(t)) return { text: "Today's raw spice prices from the Spices Board of India are on the **Market prices** page, with a tracker and alerts.", chips: [{ label: "Open market prices", go: "prices" }], local: false };
    return null;
  }
  const AI = { state: "unknown", retryAt: 0 };
  const aiUsable = () => navigator.onLine !== false && AI.state !== "nokey" && (AI.state !== "off" || Date.now() > AI.retryAt);
  function renderNet() {
    $("netStatus").textContent = navigator.onLine === false ? "Offline · built-in answers" : AI.state === "on" ? "AI online · Gemini" : AI.state === "nokey" || AI.state === "off" ? "Online · built-in answers" : "Online";
  }
  async function checkAI() {
    if (navigator.onLine === false) { renderNet(); return; }
    const c = new AbortController(); const tm = setTimeout(() => c.abort(), 65000);
    try { const r = await fetch(API_BASE + "/api/health", { signal: c.signal, cache: "no-store" }); const j = await r.json(); AI.state = j.ai ? "on" : "nokey"; }
    catch { AI.state = "off"; AI.retryAt = Date.now() + 60000; } finally { clearTimeout(tm); renderNet(); }
  }
  addEventListener("online", checkAI); addEventListener("offline", renderNet);
  async function askAI(text) {
    const history = hist.slice(0, -1).slice(-8).map(([role, t]) => ({ role: role === "u" ? "user" : "model", text: String(t).slice(0, 1200) }));
    const context = [guideContext(text), marketContext(text)].filter(Boolean).join("\n").slice(0, 11000);
    const c = new AbortController(); const tm = setTimeout(() => c.abort(), 75000);
    try {
      const res = await fetch(API_BASE + "/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text.slice(0, 1500), history, context }), signal: c.signal });
      let j = null; try { j = await res.json(); } catch {}
      if (res.ok && j && j.answer) { AI.state = "on"; renderNet(); return { answer: j.answer }; }
      if (j && j.error === "no_key") { AI.state = "nokey"; renderNet(); }
      return { note: (j && j.message) || "The AI didn't answer." };
    } catch { AI.state = "off"; AI.retryAt = Date.now() + 60000; renderNet(); return { note: "I couldn't reach the AI." }; }
    finally { clearTimeout(tm); }
  }
  const fallback = () => `I can help with **what to make**, **how to make it**, **machines**, **licences & schemes**, **quality**, **labels** and **costing**. ${navigator.onLine === false ? "When you're online, the AI can answer any other question too." : AI.state === "nokey" ? "The AI isn't switched on yet, so I can only give built-in answers for now." : ""}`;
  function send(raw) {
    const text = String(raw || "").trim();
    if (!text || busy) return;
    setChat(true); userSay(text); busy = true;
    const typing = el("div", "msg bot typing"); typing.append(el("div", "av co"), el("div", "bubble", "Typing…")); msgs.append(typing); msgs.scrollTop = msgs.scrollHeight;
    setTimeout(async () => {
      try {
        const r = respond(text);
        if (r && r.local) { typing.remove(); const o = botSay(r.text, r.chips); sourceTag(o, "Built-in answer"); return; }
        if (aiUsable()) {
          typing.querySelector(".bubble").textContent = "Thinking…";
          const wake = setTimeout(() => { typing.querySelector(".bubble").textContent = "Waking up the AI. The first answer of the day can take up to a minute…"; }, 7000);
          const ai = await askAI(text); clearTimeout(wake); typing.remove();
          if (ai.answer) { const o = botSay(ai.answer.replace(/```[a-z]*\n[\s\S]*?```/g, ""), r && r.chips ? r.chips : CHIPS.slice(0, 3)); sourceTag(o, "AI answer"); return; }
          const o = botSay(`*${ai.note} Here's my built-in answer.*\n\n` + (r ? r.text : fallback()), r ? r.chips : CHIPS); sourceTag(o, "Built-in answer"); return;
        }
        typing.remove();
        const mp = marketLocalAnswer(text);
        if (mp) { botSay((navigator.onLine === false ? "*You're offline.* " : "") + mp.text, [{ label: "Open market prices", go: "prices" }]); return; }
        const o = botSay((navigator.onLine === false ? "*You're offline, so here's my built-in answer.*\n\n" : "") + (r ? r.text : fallback()), r ? r.chips : CHIPS); sourceTag(o, "Built-in answer");
      } finally { busy = false; }
    }, 250);
  }
  function welcome() {
    msgs.textContent = ""; hist = []; store.set(HIST_KEY, hist);
    botSay("Hi! 👋 I'm the **AI advisor** for spice manufacturing. Ask me what to make, how to make it, which machines and licences you need, how to fix quality problems, or how to price your packs.", CHIPS);
  }
  $("form").addEventListener("submit", e => { e.preventDefault(); const q = $("q"); const t = q.value; q.value = ""; q.style.height = ""; send(t); });
  $("q").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("form").requestSubmit(); } });
  $("q").addEventListener("input", e => { const q = e.target; q.style.height = ""; q.style.height = Math.min(q.scrollHeight, 120) + "px"; });
  $("newchat").onclick = () => { welcome(); $("q").focus(); };
  (() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition; const btn = $("micBtn"), status = $("micStatus");
    if (!SR || /SpiceCoApp/.test(navigator.userAgent)) return;
    btn.hidden = false; let rec = null, heard = "";
    btn.onclick = () => {
      if (rec) { try { rec.stop(); } catch {} return; }
      try { rec = new SR(); } catch { status.textContent = "Voice input isn't available here. Type your question instead."; return; }
      heard = ""; rec.lang = "en-IN"; rec.interimResults = true; rec.continuous = false;
      rec.onstart = () => { btn.classList.add("on"); status.textContent = "Listening… speak now."; };
      rec.onresult = e => { let t = ""; for (const r of e.results) t += r[0].transcript; heard = t; $("q").value = t; };
      rec.onerror = e => { status.textContent = e.error === "not-allowed" || e.error === "service-not-allowed" ? "The microphone is blocked. Allow it for this site, then tap 🎤 again." : e.error === "no-speech" ? "I didn't hear anything. Tap 🎤 and try again." : e.error === "aborted" ? "" : "Voice input stopped. Type your question instead."; };
      rec.onend = () => { btn.classList.remove("on"); rec = null; const t = $("q").value.trim(); if (heard.trim() && t) { status.textContent = ""; $("q").value = ""; send(t); } else if (status.textContent === "Listening… speak now.") status.textContent = ""; };
      try { rec.start(); } catch { rec = null; status.textContent = "Voice input couldn't start. Type your question instead."; }
    };
  })();
