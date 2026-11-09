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

  /* ---------- Company details (one file: data/company.json). Blanks show as marked placeholders. ---------- */
  const LIVE = "__LIVE_URL__";
  const API_BASE = (/\.onrender\.com$/.test(location.hostname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) ? "" : LIVE;
  let CO = store.get("sc.company", null) || /*COMPANY*/{};
  const has = v => Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== "";
  const PH = {
    name: "Your Company Name", short: "Your Company", tagline: "Your tagline, e.g. what your spices are known for",
    about: "A few lines about your company: when it started, who runs it, where your spices come from and what makes them different.",
    place: "Your town, Kerala", address: "Your factory address", phone: "Your phone number", whatsapp: "Your WhatsApp number",
    email: "Your email address", hours: "Your opening hours", founded: "Year founded", fssai: "Your FSSAI licence number",
  };
  const val = k => {
    if (k === "short") return has(CO.short_name) ? CO.short_name : has(CO.name) ? CO.name : "";
    if (k === "place") return [CO.city, CO.state].filter(has).join(", ") && has(CO.city) ? [CO.city, CO.state].filter(has).join(", ") : "";
    if (k === "fssai") return CO.fssai_licence || "";
    return CO[k] || "";
  };
  const coName = () => has(CO.name) ? CO.name : "us";
  const digits = s => String(s || "").replace(/[^\d+]/g, "");
  const waNumber = () => digits(CO.whatsapp || CO.phone).replace(/^\+/, "").replace(/^0/, "91");
  const isSample = () => !has(CO.name) || (!has(CO.phone) && !has(CO.email) && !has(CO.whatsapp));
  function applyCompany() {
    document.querySelectorAll("[data-co]").forEach(n => {
      const k = n.dataset.co, v = val(k);
      n.textContent = v || PH[k] || "";
      n.classList.toggle("ph", !v);
      if (!v) n.title = "Sample text: replace with your company's details"; else n.removeAttribute("title");
    });
    document.querySelectorAll("[data-co-link]").forEach(a => {
      const k = a.dataset.coLink;
      const href = k === "phone" && has(CO.phone) ? "tel:" + digits(CO.phone)
        : k === "whatsapp" && (has(CO.whatsapp) || has(CO.phone)) ? "https://wa.me/" + waNumber()
        : k === "email" && has(CO.email) ? "mailto:" + CO.email : "";
      if (href) { a.href = href; a.classList.remove("ph", "disabled"); a.removeAttribute("aria-disabled"); a.removeAttribute("title"); }
      else { a.href = "#"; a.classList.add("disabled"); a.setAttribute("aria-disabled", "true"); a.title = "Add your " + k + " to company.json"; a.onclick = e => { if (a.classList.contains("disabled")) { e.preventDefault(); showTab("contact"); } }; }
    });
    document.title = (has(CO.name) ? CO.name : "Spice company") + (has(CO.tagline) ? " · " + CO.tagline : " · Spices, masalas & bulk supply");
    $("chatName").textContent = "Ask " + (has(CO.short_name) ? CO.short_name : has(CO.name) ? CO.name : "us");
    $("sampleBar").hidden = !isSample();
    $("footFssai").textContent = has(CO.fssai_licence) ? "FSSAI Lic. No. " + CO.fssai_licence : "";
    $("year").textContent = new Date().getFullYear();
  }
  async function refreshCompany() {
    try {
      const r = await fetch(API_BASE + "/data/company.json", { cache: "no-store" });
      if (!r.ok) return;
      const j = await r.json();
      if (j && Array.isArray(j.products)) { CO = j; store.set("sc.company", j); applyCompany(); renderCurrent(); }
    } catch {}
  }

  /* ---------- Content that applies to any spice unit (edit to match your factory) ---------- */
  const CATS = { powder: "Spice powders", blend: "Blends & masalas", whole: "Whole spices" };
  const CAT_ICON = { powder: "🫙", blend: "🥘", whole: "🌿" };
  const STEPS = [
    ["🌾", "Sourcing", "Raw spices are bought from farmers, traders and auctions. Each lot is checked for variety, colour, aroma, moisture and damage before it's accepted."],
    ["🧹", "Cleaning", "Sieving, de-stoning, air separation and magnets remove dust, stones, stalks, iron bits and other foreign matter."],
    ["☀️", "Drying", "Spices are dried to a safe moisture level so they don't grow mould. FSSAI limits for most ground spices are in the 9 to 12% range."],
    ["⚙️", "Grinding", "Pulverisers or hammer mills grind the spice. Keeping the grinder cool helps hold on to the volatile oils that carry aroma."],
    ["🔄", "Sieving & blending", "Powders are sieved to an even mesh size. Masalas are weighed to a fixed recipe and mixed until uniform."],
    ["♨️", "Sterilising", "For export and sensitive buyers, steam sterilisation cuts down microbes while keeping most of the flavour."],
    ["🔬", "Testing", "Every batch is checked in the lab before release: moisture, aroma, colour, purity and microbes."],
    ["📦", "Packing", "Food-grade, moisture-proof packs with batch number, packing and best-before dates, and the FSSAI licence number on the label."],
  ];
  const TESTS = [
    ["Moisture", "Too much moisture lets mould grow; legal limits are set per spice."],
    ["Volatile oil", "Measures aroma strength, especially for pepper, cardamom, cumin and coriander."],
    ["Colour value", "Chilli powder colour is measured in ASTA units; turmeric is checked for curcumin."],
    ["Purity & adulterants", "Checks for starch, sawdust, brick powder, artificial colours (such as Sudan dyes) and lead chromate in turmeric."],
    ["Extraneous matter", "Stones, stalks, insect damage and other foreign material within legal limits."],
    ["Microbes", "Total plate count, yeast and mould, E. coli and Salmonella."],
    ["Aflatoxin & mycotoxins", "Toxins from moulds, which chillies, nutmeg and some seeds are prone to."],
    ["Pesticide residues", "Tested against FSSAI limits, and stricter importing-country limits for export."],
  ];
  const STORE_TIPS = [
    ["Airtight", "Keep spices in airtight jars or zip pouches; air carries away aroma."],
    ["Cool & dark", "Store away from the stove, sunlight and steam."],
    ["Dry spoon", "Always use a dry spoon; one drop of water can start mould."],
    ["Whole lasts longer", "Whole spices keep their flavour much longer than powders. Grind small amounts fresh when you can."],
    ["Check the date", "Use powders within their best-before date for the best aroma."],
  ];

  /* ---------- Tooltip (used by charts) ---------- */
  function tipOn(target, html) {
    const show = e => { tt.innerHTML = html; tt.hidden = false; const p = e.touches ? e.touches[0] : e; let x = (p && p.clientX != null ? p.clientX : 0) + 14, y = (p && p.clientY != null ? p.clientY : 0) + 14; if (x + tt.offsetWidth > innerWidth - 8) x = Math.max(8, x - tt.offsetWidth - 28); tt.style.left = x + "px"; tt.style.top = y + "px"; };
    target.addEventListener("pointerenter", show); target.addEventListener("pointermove", show); target.addEventListener("pointerleave", () => { tt.hidden = true; });
  }

  /* ---------- Pages + floating chat ---------- */
  const VIEWS = ["home", "products", "process", "prices", "bulk", "contact"];
  const HASH = { products: "products", process: "process", prices: "prices", bulk: "bulk", contact: "contact" };
  function renderCurrent() {
    if (tab === "home") renderHome();
    if (tab === "products") renderProducts();
    if (tab === "process") renderProcess();
    if (tab === "prices") renderPrices();
    if (tab === "bulk") renderBulk();
    if (tab === "contact") renderContact();
  }
  function showTab(name) {
    if (name === "chat") { setChat(true); return; }
    if (!VIEWS.includes(name)) name = "home";
    const changed = tab !== name; tab = name;
    VIEWS.forEach(n => { $("v-" + n).hidden = n !== name; $("t-" + n).setAttribute("aria-current", n === name ? "page" : "false"); });
    tt.hidden = true;
    renderCurrent();
    if (changed) scrollTo(0, 0);
    try { history.replaceState(null, "", location.pathname + location.search + (name === "home" ? "" : "#" + name)); } catch {}
    onScroll();
  }
  function setChat(open) {
    const panel = $("v-chat"), fab = $("chatFab");
    panel.hidden = !open;
    document.body.classList.toggle("chat-open", open);
    fab.setAttribute("aria-expanded", String(open));
    fab.innerHTML = open ? '<span aria-hidden="true">✕</span><span class="fab-text">Close chat</span>' : '<span aria-hidden="true">💬</span><span class="fab-text">Ask us</span>';
    fab.setAttribute("aria-label", open ? "Close chat" : "Ask us");
    store.set("sc.chatOpen", open);
    if (open) { msgs.scrollTop = msgs.scrollHeight; if (innerWidth > 600) $("q").focus(); }
  }
  VIEWS.forEach(n => $("t-" + n).onclick = () => showTab(n));
  $("brandBtn").onclick = () => showTab("home");
  $("chatFab").onclick = () => setChat($("v-chat").hidden);
  $("chatClose").onclick = () => setChat(false);
  $("heroAsk").onclick = () => setChat(true);
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => showTab(b.dataset.go)));
  addEventListener("keydown", e => { if (e.key === "Escape" && !$("v-chat").hidden) setChat(false); });
  addEventListener("hashchange", () => { const v = location.hash.slice(1) || "home"; if (v !== tab) showTab(v); });

  /* ---------- Theme ---------- */
  const themeBtn = $("themeBtn");
  const curTheme = () => document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  function labelTheme() { const d = curTheme() === "dark"; themeBtn.textContent = d ? "🌙 Theme" : "☀️ Theme"; themeBtn.setAttribute("aria-label", "Switch to " + (d ? "light" : "dark") + " theme"); }
  try { const t = store.get("sc.theme", null); if (t === "dark" || t === "light") document.documentElement.setAttribute("data-theme", t); } catch {}
  themeBtn.onclick = () => { const next = curTheme() === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next); store.set("sc.theme", next); labelTheme(); };
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", labelTheme); } catch {}

  /* ---------- Scroll progress, back to top ---------- */
  const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function onScroll() { const h = document.documentElement.scrollHeight - innerHeight; $("scrollProgress").style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + "%"; $("toTop").hidden = scrollY < 600; }
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
  $("toTop").onclick = () => scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });

  /* ---------- Home ---------- */
  const products = () => (CO.products || []).filter(p => p && p.name);
  const swatch = p => { const s = el("span", "swatch"); s.style.setProperty("--sw", p.color || "#9a5b00"); s.setAttribute("aria-hidden", "true"); return s; };
  function renderHome() {
    const cc = $("catCards"); cc.replaceChildren();
    Object.entries(CATS).forEach(([k, label]) => {
      const list = products().filter(p => p.category === k);
      const b = el("button", "hcard catcard"); b.type = "button";
      b.append(el("span", "card-tag", CAT_ICON[k] + " " + label), el("b", null, `${list.length} products`), el("span", null, list.slice(0, 4).map(p => p.name).join(", ") + (list.length > 4 ? "…" : "")));
      b.onclick = () => { pCat = k; store.set("sc.pcat", k); showTab("products"); };
      cc.append(b);
    });
    const bulk = el("button", "hcard catcard"); bulk.type = "button";
    bulk.append(el("span", "card-tag", "🚚 Bulk & export"), el("b", null, "Wholesale supply"), el("span", null, "Shops, restaurants, distributors and importers"));
    bulk.onclick = () => showTab("bulk"); cc.append(bulk);
    const sm = $("stepsMini"); sm.replaceChildren();
    STEPS.forEach(([ic, t, d], i) => { const s = el("button", "stepm"); s.type = "button"; s.append(el("span", "si", ic), el("b", null, `${i + 1}. ${t}`)); s.title = d; s.onclick = () => { showTab("process"); setTimeout(() => { const n = document.querySelectorAll("#steps .step")[i]; if (n) { n.scrollIntoView({ block: "center" }); n.classList.add("flash"); setTimeout(() => n.classList.remove("flash"), 1500); } }, 50); }; sm.append(s); });
    const hl = $("highlights"); hl.replaceChildren();
    if (has(CO.highlights)) CO.highlights.slice(0, 6).forEach(h => { const c = el("div", "hl"); const t = typeof h === "string" ? { title: h } : h; c.append(el("b", null, t.title || ""), el("p", null, t.text || "")); hl.append(c); });
    else ["Where your spices come from (your own farms, partner farmers, auctions)", "How you process them (cleaning, low-heat grinding, hygiene)", "How you check quality (your lab tests, certifications)"].forEach((h, i) => { const c = el("div", "hl ph-card"); c.append(el("b", "ph", `Your strength ${i + 1}`), el("p", null, h)); c.title = "Sample: add your real highlights to company.json"; hl.append(c); });
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

  /* ---------- Products ---------- */
  let pCat = store.get("sc.pcat", "all"), pQ = "";
  function renderProducts() {
    const seg = $("catSeg"); seg.replaceChildren();
    [["all", "All"], ...Object.entries(CATS)].forEach(([k, label]) => { const b = el("button", "segb", label); b.type = "button"; b.setAttribute("aria-selected", String(pCat === k)); b.onclick = () => { pCat = k; store.set("sc.pcat", k); renderProducts(); }; seg.append(b); });
    const grid = $("prodGrid"); grid.replaceChildren();
    const q = pQ.trim().toLowerCase();
    const list = products().filter(p => (pCat === "all" || p.category === pCat) && (!q || (p.name + " " + p.about + " " + p.uses).toLowerCase().includes(q)));
    list.forEach(p => {
      const c = el("article", "pcard");
      const top = el("div", "ptop"); top.append(swatch(p)); const nm = el("div"); nm.append(el("span", "card-tag", CATS[p.category] || ""), el("h3", null, p.name)); top.append(nm); c.append(top);
      c.append(el("p", null, p.about));
      if (p.uses) { const u = el("p", "uses"); u.append(el("b", null, "Use it in: "), document.createTextNode(p.uses)); c.append(u); }
      const packs = el("div", "packs");
      if (has(p.packs)) p.packs.forEach(s => packs.append(el("span", "pack", s))); else { const s = el("span", "pack ph", "Pack sizes: add yours"); s.title = "Sample: add pack sizes to company.json"; packs.append(s); }
      c.append(packs);
      const pr = el("p", "pprice", has(p.price) ? p.price : "Price on request"); c.append(pr);
      const acts = el("div", "acts");
      const e = el("button", "btn-lg primary sm", "Enquire"); e.type = "button"; e.onclick = () => { enqPick = new Set([p.name]); showTab("bulk"); };
      const a = el("button", "btn-lg sm", "Ask about it"); a.type = "button"; a.onclick = () => send(`Tell me about your ${p.name}`);
      acts.append(e, a); c.append(acts);
      grid.append(c);
    });
    if (!list.length) grid.append(el("p", "note", "No products match that. Try another word, or ask us in the chat."));
  }
  $("pSearch").addEventListener("input", e => { pQ = e.target.value; renderProducts(); });

  /* ---------- Process & quality ---------- */
  function renderProcess() {
    $("procNote").textContent = "A typical modern spice unit, step by step." + (isSample() ? " (Sample: edit the steps to match your own factory.)" : "");
    const st = $("steps"); st.replaceChildren();
    STEPS.forEach(([ic, t, d], i) => { const s = el("div", "step"); s.append(el("span", "si", ic)); const tx = el("div"); tx.append(el("b", null, `${i + 1}. ${t}`), el("p", null, d)); s.append(tx); st.append(s); });
    const ts = $("tests"); ts.replaceChildren();
    TESTS.forEach(([t, d]) => { const r = el("div", "test"); r.append(el("b", null, t), el("span", null, d)); ts.append(r); });
    const ce = $("certs"); ce.replaceChildren();
    const row = (label, v, phText) => { const r = el("div", "kv"); r.append(el("span", null, label)); const b = el("b", v ? null : "ph", v || phText); if (!v) b.title = "Sample: add your real details to company.json"; r.append(b); ce.append(r); };
    row("FSSAI licence", CO.fssai_licence, PH.fssai);
    row("GSTIN", CO.gstin, "Your GST number");
    if (has(CO.certifications)) CO.certifications.forEach(c => row("Certification", typeof c === "string" ? c : c.name + (c.number ? " · " + c.number : ""), ""));
    else row("Certifications", "", "Add only the ones you hold: ISO 22000, FSSC 22000, HACCP, Spices Board registration, organic, AGMARK…");
    const tp = $("storeTips"); tp.replaceChildren();
    STORE_TIPS.forEach(([t, d]) => { const c = el("div", "tip"); c.append(el("b", null, t), el("p", null, d)); tp.append(c); });
  }

  /* ---------- Bulk & export enquiry (WhatsApp, email or PDF; nothing is stored on a server) ---------- */
  let enqPick = new Set();
  function renderBulk() {
    const bi = $("bulkInfo"); bi.replaceChildren();
    const B = CO.bulk || {};
    const row = (label, v, phText) => { const r = el("div", "kv"); r.append(el("span", null, label)); const b = el("b", has(v) ? null : "ph", has(v) ? (Array.isArray(v) ? v.join(", ") : v) : phText); r.append(b); bi.append(r); };
    row("Minimum order", B.moq, "Your minimum order, e.g. 100 kg");
    row("Packing", B.packaging, "Your bulk packing, e.g. 25 kg PP bags, cartons");
    row("Private label", B.private_label, "Do you pack under the buyer's brand?");
    row("Export markets", B.export_markets, "Countries you ship to");
    row("Lead time", B.lead_time, "Usual time to dispatch");
    row("Product range", `${products().length} products: ${Object.entries(CATS).map(([k, l]) => `${products().filter(p => p.category === k).length} ${l.toLowerCase()}`).join(", ")}`, "");
    const pg = $("enqProducts");
    if (!pg.dataset.built || pg.dataset.n !== String(products().length)) {
      pg.replaceChildren(); pg.dataset.built = "1"; pg.dataset.n = String(products().length);
      products().forEach(p => { const l = el("label", "pick"); const c = el("input"); c.type = "checkbox"; c.value = p.name; l.append(c, document.createTextNode(" " + p.name)); pg.append(l); });
    }
    pg.querySelectorAll("input").forEach(c => { if (enqPick.has(c.value)) c.checked = true; });
    enqPick = new Set();
    if (!$("enqPdf").firstChild) $("enqPdf").append(dlButton("⬇ Save as PDF", enquiryPdf));
    const can = has(CO.whatsapp) || has(CO.phone);
    $("enqWa").disabled = !can; $("enqMail").disabled = !has(CO.email);
    $("enqNote").textContent = !can || !has(CO.email) ? "Sample site: the company's WhatsApp number and email haven't been added yet, so sending is switched off. You can still save the enquiry as a PDF." : "Your enquiry opens in WhatsApp or your email app, ready to send. Nothing is stored on this website.";
  }
  function readEnq() {
    const f = $("enqForm"), g = n => f.elements[n].value.trim();
    const items = [...$("enqProducts").querySelectorAll("input:checked")].map(c => c.value);
    return { name: g("name"), org: g("org"), phone: g("phone"), email: g("email"), place: g("place"), qty: g("qty"), unit: g("unit"), pack: g("pack"), msg: g("msg"), items };
  }
  function checkEnq(e) {
    const err = !e.name ? "Please add your name." : !e.phone && !e.email ? "Please add a phone number or email so we can reply." : !e.items.length && !e.msg ? "Pick at least one product, or write a message." : "";
    $("enqErr").textContent = err; return !err;
  }
  function enqText(e) {
    return [`Enquiry for ${has(CO.name) ? CO.name : "your company"}`, "",
      `Name: ${e.name}`, e.org && `Company: ${e.org}`, e.phone && `Phone: ${e.phone}`, e.email && `Email: ${e.email}`, e.place && `Location: ${e.place}`,
      e.items.length && `Products: ${e.items.join(", ")}`, e.qty && `Quantity: ${e.qty} ${e.unit}`, e.pack && `Packing: ${e.pack}`, e.msg && `Message: ${e.msg}`].filter(Boolean).join("\n");
  }
  $("enqWa").onclick = () => { const e = readEnq(); if (!checkEnq(e)) return; window.open("https://wa.me/" + waNumber() + "?text=" + encodeURIComponent(enqText(e)), "_blank", "noopener"); };
  $("enqMail").onclick = () => { const e = readEnq(); if (!checkEnq(e)) return; location.href = "mailto:" + CO.email + "?subject=" + encodeURIComponent("Spice enquiry from " + e.name) + "&body=" + encodeURIComponent(enqText(e)); };

  /* ---------- Contact ---------- */
  function renderContact() {
    const cc = $("contactCards"); cc.replaceChildren();
    const card = (ic, label, v, href, phText) => {
      const c = el(href ? "a" : "div", "ccard2"); if (href) { c.href = href; if (/^https/.test(href)) { c.target = "_blank"; c.rel = "noopener"; } }
      c.append(el("span", "si", ic), el("span", "lbl", label)); const b = el("b", v ? null : "ph", v || phText); if (!v) b.title = "Sample: add this to company.json"; c.append(b); cc.append(c);
    };
    card("📞", "Call", CO.phone, has(CO.phone) ? "tel:" + digits(CO.phone) : "", PH.phone);
    card("💬", "WhatsApp", CO.whatsapp || (has(CO.phone) ? CO.phone : ""), has(CO.whatsapp) || has(CO.phone) ? "https://wa.me/" + waNumber() : "", PH.whatsapp);
    card("✉️", "Email", CO.email, has(CO.email) ? "mailto:" + CO.email : "", PH.email);
    card("📍", "Visit", CO.address, has(CO.address) ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CO.address) : "", PH.address);
    card("🕘", "Hours", CO.hours, "", PH.hours);
    const S = CO.social || {};
    Object.entries({ instagram: "📸", facebook: "👍", youtube: "▶️", linkedin: "💼" }).forEach(([k, ic]) => { if (has(S[k])) card(ic, k[0].toUpperCase() + k.slice(1), S[k].replace(/^https?:\/\/(www\.)?/, ""), /^https?:/.test(S[k]) ? S[k] : "https://" + S[k], ""); });
    const d = $("coDetails"); d.replaceChildren();
    [["Company", CO.name, PH.name], ["Since", CO.founded, PH.founded], ["Location", val("place"), PH.place], ["FSSAI licence", CO.fssai_licence, PH.fssai], ["GSTIN", CO.gstin, "Your GST number"]].forEach(([k, v, p]) => { const r = el("div", "kv"); r.append(el("span", null, k)); const b = el("b", has(v) ? null : "ph", has(v) ? v : p); r.append(b); d.append(r); });
  }

  /* ---------- Chat ---------- */
  const msgs = $("msgs");
  function md(target, text) {
    try { if (window.marked && window.DOMPurify) { target.innerHTML = DOMPurify.sanitize(marked.parse(text)); target.querySelectorAll("table").forEach(t => { const w = el("div", "tw"); t.replaceWith(w); w.append(t); }); target.querySelectorAll("a").forEach(a => { a.target = "_blank"; a.rel = "noopener"; }); return; } } catch {}
    target.textContent = text;
  }
  const HIST_KEY = "sc.chat";
  let hist = store.get(HIST_KEY, []), restoring = false; if (!Array.isArray(hist)) hist = [];
  function remember(role, text) { if (restoring) return; hist.push([role, String(text).slice(0, 6000)]); if (hist.length > 60) hist = hist.slice(-60); store.set(HIST_KEY, hist); }
  function userSay(text) { remember("u", text); const m = el("div", "msg user"); m.append(el("div", "bubble", text)); msgs.append(m); msgs.scrollTop = msgs.scrollHeight; }
  function renderChips(box, chips) {
    if (!chips || !chips.length) return;
    const row = el("div", "chips");
    chips.forEach(c => { const b = el("button", "qchip", c.label); b.type = "button"; b.onclick = () => c.go ? (setChat(innerWidth > 900), showTab(c.go)) : send(c.q); row.append(b); });
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

  // built-in answers (offline, and for anything about the company itself)
  const N = s => s.toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  const ALIAS = { "manjal": "Turmeric powder", "haldi": "Turmeric powder", "turmeric": "Turmeric powder", "mulaku": "Red chilli powder", "mirchi": "Red chilli powder", "chilli powder": "Red chilli powder", "chili powder": "Red chilli powder", "kashmiri": "Kashmiri chilli powder", "malli": "Coriander powder", "dhania": "Coriander powder", "jeera powder": "Cumin powder", "pepper powder": "Black pepper powder", "kurumulaku": "Black pepper", "pepper": "Black pepper", "elakkai": "Green cardamom", "elaichi": "Green cardamom", "cardamom": "Green cardamom", "grambu": "Cloves", "laung": "Cloves", "clove": "Cloves", "karuvapatta": "Cinnamon", "dalchini": "Cinnamon", "jathikka": "Nutmeg", "jathipathri": "Mace", "jeera": "Cumin seeds", "cumin": "Cumin seeds", "kaduku": "Mustard seeds", "rai": "Mustard seeds", "mustard": "Mustard seeds", "uluva": "Fenugreek seeds", "methi": "Fenugreek seeds", "fenugreek": "Fenugreek seeds", "coriander": "Coriander seeds", "red chilli": "Dry red chillies", "dry chilli": "Dry red chillies", "biryani": "Biryani masala", "sambar": "Sambar powder", "rasam": "Rasam powder", "garam": "Garam masala", "chicken": "Chicken masala", "meat": "Meat masala", "mutton": "Meat masala", "beef": "Meat masala", "fish": "Fish curry masala", "chaat": "Chaat masala" };
  function findProduct(t) {
    const n = N(t);
    let best = products().filter(p => n.includes(N(p.name))).sort((a, b) => b.name.length - a.name.length)[0];
    if (best) return best;
    const key = Object.keys(ALIAS).sort((a, b) => b.length - a.length).find(k => new RegExp("\\b" + k + "\\b").test(n));
    return key ? products().find(p => p.name === ALIAS[key]) : null;
  }
  const contactLine = () => {
    const bits = [];
    if (has(CO.phone)) bits.push(`📞 ${CO.phone}`);
    if (has(CO.whatsapp) || has(CO.phone)) bits.push(`💬 [WhatsApp](https://wa.me/${waNumber()})`);
    if (has(CO.email)) bits.push(`✉️ ${CO.email}`);
    return bits.length ? bits.join(" · ") : "*(The company's phone, WhatsApp and email haven't been added to this site yet.)*";
  };
  const CHIPS = [{ label: "What do you make?", q: "What products do you make?" }, { label: "Bulk orders", q: "Do you supply in bulk?" }, { label: "How are your spices made?", q: "How are your spices made?" }, { label: "Contact", q: "How can I contact you?" }];
  function respond(text) {
    const t = N(text), p = findProduct(text);
    if (/^(hi+|hello|hey|hai|namaskaram|namaste|good (morning|afternoon|evening))\b/.test(t) && t.split(" ").length <= 4) return { text: `Hello! 👋 Welcome to **${has(CO.name) ? CO.name : "our spice company"}**. I can tell you about our spices and masalas, bulk orders, how our spices are made, or today's market prices.`, chips: CHIPS, local: true };
    if (/^(thanks|thank you|thx|ok thanks|great|super)\b/.test(t)) return { text: "You're welcome! Anything else I can help with?", chips: CHIPS, local: true };
    if (/\b(who are you|what are you|are you (a )?(bot|human|ai))\b/.test(t)) return { text: `I'm the website assistant for **${has(CO.name) ? CO.name : "this spice company"}**. I answer questions about our products and spices. For orders and prices, our team replies directly: ${contactLine()}`, chips: CHIPS, local: true };
    if (/\b(contact|phone|call|number|mobile|whatsapp|email|mail|address|location|where are you|visit|office|factory address|reach you|timing|hours|open)\b/.test(t) && !p)
      return { text: `**How to reach us**\n\n${contactLine()}${has(CO.address) ? `\n\n📍 ${CO.address}` : ""}${has(CO.hours) ? `\n\n🕘 ${CO.hours}` : ""}`, chips: [{ label: "Open contact page", go: "contact" }, { label: "Send an enquiry", go: "bulk" }], local: true };
    if (/\b(bulk|wholesale|export|exporter|import|distributor|dealer|dealership|retailer|private label|moq|minimum order|tonne|ton|quintal|hotel|restaurant supply)\b/.test(t)) {
      const B = CO.bulk || {};
      const lines = [B.moq && `Minimum order: ${B.moq}`, has(B.packaging) && `Packing: ${[].concat(B.packaging).join(", ")}`, B.private_label && `Private label: ${B.private_label}`, has(B.export_markets) && `We ship to: ${[].concat(B.export_markets).join(", ")}`, B.lead_time && `Lead time: ${B.lead_time}`].filter(Boolean);
      return { text: `Yes, we take **bulk and export enquiries** for shops, restaurants, distributors and importers.${lines.length ? "\n\n- " + lines.join("\n- ") : ""}\n\nSend us the products, quantity and packing you need and we'll reply with prices and samples.\n\n${contactLine()}`, chips: [{ label: "Send a bulk enquiry", go: "bulk" }, { label: "Product list", q: "What products do you make?" }], local: true };
    }
    if (/\b(price|rate|cost|how much|mrp|rs|rupees|₹)\b/.test(t) || /price|rate/.test(t)) {
      if (p) return { text: `**${p.name}**: ${has(p.price) ? p.price : "please ask us for the current price and pack sizes"}.\n\n${contactLine()}`, chips: [{ label: `Enquire about ${p.name}`, go: "bulk" }, { label: "Market prices today", go: "prices" }], local: false, product: p };
      return null;
    }
    if (p && !/\b(recipe|how to cook|how to use|benefit|health|substitut|difference|vs|versus|why)\b/.test(t)) {
      const o = `**${p.name}** · ${CATS[p.category]}\n\n${p.about}${p.uses ? `\n\n**Use it in:** ${p.uses}` : ""}\n\n**Pack sizes:** ${has(p.packs) ? p.packs.join(", ") : "please ask us"} · **Price:** ${has(p.price) ? p.price : "on request"}\n\n**Storage:** ${p.storage}`;
      return { text: o, chips: [{ label: "Enquire", go: "bulk" }, { label: `How to use ${p.name.toLowerCase()}`, q: `How do I cook with ${p.name.toLowerCase()}?` }], local: false, product: p };
    }
    if (/\b(products|what do you (make|sell|have)|range|catalog|catalogue|items|masalas|powders|whole spices|list)\b/.test(t)) {
      const o = Object.entries(CATS).map(([k, l]) => `**${l}:** ${products().filter(x => x.category === k).map(x => x.name).join(", ")}`).join("\n\n");
      return { text: `Here's our range:\n\n${o}\n\nAsk me about any of them, or send an enquiry for prices and pack sizes.`, chips: [{ label: "See all products", go: "products" }, { label: "Bulk orders", q: "Do you supply in bulk?" }], local: true };
    }
    if (/\b(how (are|is|do you) (your )?(spices? )?(made|make|produce|process|manufactur)|process|manufactur|grind|grinding|cleaning|steril|factory|plant)\b/.test(t))
      return { text: "**How our spices are made**\n\n" + STEPS.map(([ic, s, d], i) => `${i + 1}. **${s}**: ${d}`).join("\n") + (isSample() ? "\n\n*(This is the typical process for a modern spice unit.)*" : ""), chips: [{ label: "Quality checks", q: "How do you check quality?" }, { label: "Process page", go: "process" }], local: true };
    if (/\b(quality|test|testing|lab|certif|fssai|iso|haccp|organic|pure|purity|adulter|safe|safety|aflatoxin|pesticide)\b/.test(t)) {
      const certs = [has(CO.fssai_licence) && `FSSAI licence: ${CO.fssai_licence}`, ...(has(CO.certifications) ? CO.certifications.map(c => typeof c === "string" ? c : c.name) : [])].filter(Boolean);
      return { text: `**Quality checks** on spices cover:\n\n${TESTS.map(([a, b]) => `- **${a}**: ${b}`).join("\n")}\n\n${certs.length ? "**Our licences & certifications:** " + certs.join(", ") : "*(The company's licence and certification details haven't been added to this site yet.)*"}`, chips: [{ label: "Process & quality page", go: "process" }], local: true };
    }
    if (/\b(store|storage|shelf life|expiry|expire|keep fresh|how long)\b/.test(t)) return { text: "**Keeping spices fresh**\n\n" + STORE_TIPS.map(([a, b]) => `- **${a}**: ${b}`).join("\n"), chips: CHIPS.slice(0, 2), local: true };
    if (/\b(deliver|delivery|shipping|ship|courier|cod|cash on delivery|order online|buy online|payment)\b/.test(t)) return { text: `For orders, delivery and payment options, please message us and the team will confirm:\n\n${contactLine()}`, chips: [{ label: "Send an enquiry", go: "bulk" }], local: true };
    if (/\b(market price|today'?s price|auction|spices board|commodity)\b/.test(t)) return { text: "Today's market prices from the Spices Board of India are on the **Market prices** page, with a tracker and alerts.", chips: [{ label: "Open market prices", go: "prices" }], local: false };
    return null;
  }

  // the AI gets the company file (only what's filled in) + live market data
  function companyContext() {
    const lines = [];
    const f = (k, v) => { if (has(v)) lines.push(`COMPANY ${k}: ${Array.isArray(v) ? v.join(", ") : v}`); };
    f("name", CO.name); f("tagline", CO.tagline); f("about", CO.about); f("founded", CO.founded); f("location", [CO.city, CO.state, CO.country].filter(has).join(", "));
    f("address", CO.address); f("phone", CO.phone); f("whatsapp", CO.whatsapp); f("email", CO.email); f("hours", CO.hours);
    f("FSSAI licence", CO.fssai_licence); f("certifications", (CO.certifications || []).map(c => typeof c === "string" ? c : c.name));
    f("highlights", (CO.highlights || []).map(h => typeof h === "string" ? h : h.title + (h.text ? ": " + h.text : "")));
    const B = CO.bulk || {}; f("bulk minimum order", B.moq); f("bulk packing", B.packaging); f("private label", B.private_label); f("export markets", B.export_markets); f("lead time", B.lead_time);
    const missing = ["name", "phone", "email", "address", "fssai_licence"].filter(k => !has(CO[k]));
    if (missing.length) lines.push(`COMPANY NOT PROVIDED (never make these up; say the team will confirm): ${missing.join(", ")}, ${has(CO.certifications) ? "" : "certifications, "}${products().some(p => has(p.price)) ? "" : "product prices, "}${products().some(p => has(p.packs)) ? "" : "pack sizes"}`);
    lines.push("PRODUCTS: " + products().map(p => `${p.name} [${CATS[p.category]}]${has(p.packs) ? " packs " + p.packs.join("/") : ""}${has(p.price) ? " price " + p.price : ""}: ${p.about}`).join(" | "));
    return lines.join("\n");
  }
  const AI = { state: "unknown", retryAt: 0 };
  const aiUsable = () => navigator.onLine !== false && AI.state !== "nokey" && (AI.state !== "off" || Date.now() > AI.retryAt);
  function renderNet() {
    const n = $("netStatus");
    n.textContent = navigator.onLine === false ? "Offline · built-in answers" : AI.state === "on" ? "AI online · Gemini" : AI.state === "nokey" || AI.state === "off" ? "Online · built-in answers" : "Online";
  }
  async function checkAI() {
    if (navigator.onLine === false) { renderNet(); return; }
    const c = new AbortController(); const tm = setTimeout(() => c.abort(), 65000);
    try { const r = await fetch(API_BASE + "/api/health", { signal: c.signal, cache: "no-store" }); const j = await r.json(); AI.state = j.ai ? "on" : "nokey"; }
    catch { AI.state = "off"; AI.retryAt = Date.now() + 60000; } finally { clearTimeout(tm); renderNet(); }
  }
  addEventListener("online", () => { checkAI(); refreshCompany(); }); addEventListener("offline", renderNet);
  async function askAI(text) {
    const history = hist.slice(0, -1).slice(-8).map(([role, t]) => ({ role: role === "u" ? "user" : "model", text: String(t).slice(0, 1200) }));
    const context = [companyContext(), marketContext(text)].filter(Boolean).join("\n").slice(0, 11000);
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
          if (ai.answer) { const o = botSay(ai.answer.replace(/```[a-z]*\n[\s\S]*?```/g, ""), r && r.chips ? r.chips : CHIPS.slice(0, 2)); sourceTag(o, "AI answer"); return; }
          const o = botSay(`*${ai.note} Here's my built-in answer.*\n\n` + (r ? r.text : fallback()), r ? r.chips : CHIPS); sourceTag(o, "Built-in answer"); return;
        }
        typing.remove();
        const mp = marketLocalAnswer(text);
        if (mp) { botSay((navigator.onLine === false ? "*You're offline.* " : "") + mp.text, [{ label: "Open market prices", go: "prices" }]); return; }
        const o = botSay((navigator.onLine === false ? "*You're offline, so here's my built-in answer.*\n\n" : "") + (r ? r.text : fallback()), r ? r.chips : CHIPS); sourceTag(o, "Built-in answer");
      } finally { busy = false; }
    }, 250);
  }
  const fallback = () => `I can help with our **products**, **bulk orders**, **how our spices are made**, **quality**, **storage** and **contact details**. ${navigator.onLine === false ? "When you're online, I can answer any other spice question too." : ""}`;
  function welcome() {
    msgs.textContent = ""; hist = []; store.set(HIST_KEY, hist);
    botSay(`Hi! 👋 I'm the assistant for **${has(CO.name) ? CO.name : "this spice company"}**. Ask me about our spices and masalas, bulk and export orders, how our spices are made, recipes, or today's market prices.`, CHIPS);
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
