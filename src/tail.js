  /* ---------- Start ---------- */
  labelTheme();
  try { const inApp = /SpiceCoApp/.test(navigator.userAgent); if (!inApp && /\.onrender\.com$/.test(location.hostname)) ["getApp", "footApp"].forEach(id => { $(id).hidden = false; }); } catch {}
  renderNet();
  if (hist.length) { restoring = true; hist.forEach(([r, t]) => { if (r === "u") userSay(t); else botSay(t); }); restoring = false; } else welcome();
  const start = location.hash.slice(1) || "home";
  if (SEGS[start]) showTab("guide", start); else showTab(start === "chat" ? "home" : start);
  if (start === "chat" || (store.get("sc.chatOpen", false) && innerWidth > 600)) setChat(true);
  checkAI();
  setTimeout(() => { if (!MKT.got.p) refreshAll(false); }, 1500);
})();
