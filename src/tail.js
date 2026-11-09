  function enquiryPdf() {
    const e = readEnq();
    const d = newPdf("Spice enquiry");
    pdfHeader(d, "Spice enquiry", stamp());
    d.para(`To: ${has(CO.name) ? CO.name : "(company name not added yet)"}`, { size: 11, bold: true, gap: 2 });
    d.para([has(CO.phone) && "Phone " + CO.phone, has(CO.email) && "Email " + CO.email, has(CO.address) && CO.address].filter(Boolean).join(" · ") || "Company contact details not added yet.", { size: 9, color: C.muted, gap: 10 });
    d.h2("From");
    d.table([{ label: "Detail", w: 120, bold: true }, { label: "", w: d.CW - 120 }], [["Name", e.name || "—"], ["Company", e.org || "—"], ["Phone", e.phone || "—"], ["Email", e.email || "—"], ["Location", e.place || "—"]]);
    d.h2("Request");
    d.table([{ label: "Product", w: d.CW - 180, bold: true }, { label: "Quantity", w: 90, align: "r" }, { label: "Packing", w: 90 }], (e.items.length ? e.items : ["(no product picked)"]).map((p, i) => [p, i === 0 && e.qty ? `${e.qty} ${e.unit}` : "", i === 0 ? e.pack || "" : ""]));
    if (e.msg) { d.h2("Message"); d.para(e.msg, { size: 10 }); }
    const P = MKT.prices || {}, rows = [...(P.india_official || []), ...(P.india_ai || [])];
    const ref = rows.filter(r => e.items.some(n => n.toLowerCase().split(" ").some(w => w.length > 3 && r.spice.toLowerCase().includes(w.replace(/s$/, "")))));
    if (ref.length) { d.h2("Market reference (Spices Board of India)"); d.table([{ label: "Spice", w: 110, bold: true }, { label: "Market · grade", w: d.CW - 110 - 80 - 80 }, { label: "Rs per kg", w: 80, align: "r" }, { label: "Date", w: 80, align: "r" }], ref.slice(0, 12).map(r => [r.spice, [r.market, r.grade].filter(Boolean).join(" · "), fmtN(r.price), niceDate(r.date)])); d.para("Market prices are for reference only, not a quotation.", { size: 8, color: C.muted }); }
    return { bytes: d.bytes(), name: `Spice enquiry ${fileStamp()}.pdf` };
  }

  /* ---------- Start ---------- */
  labelTheme();
  applyCompany();
  try { const inApp = /SpiceCoApp/.test(navigator.userAgent); if (!inApp && /\.onrender\.com$/.test(location.hostname)) ["getApp", "footApp"].forEach(id => { $(id).hidden = false; }); } catch {}
  renderNet();
  if (hist.length) { restoring = true; hist.forEach(([r, t]) => { if (r === "u") userSay(t); else botSay(t); }); restoring = false; } else welcome();
  const startView = location.hash.slice(1) || "home";
  showTab(startView === "chat" ? "home" : startView);
  if (startView === "chat" || (store.get("sc.chatOpen", false) && innerWidth > 600)) setChat(true);
  checkAI(); refreshCompany();
  setTimeout(() => { if (!MKT.got.p) refreshAll(false); }, 1500);
})();
