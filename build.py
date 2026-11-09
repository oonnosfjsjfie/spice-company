"""Builds web/index.html (and the Android app's offline copy) from src/."""
import json, re, sys, os
SB = "/tmp/claude-0/-home-claude/a2963458-9b8a-59e5-b3db-75c10c08f8f3/scratchpad/build"
LIVE = os.environ.get("LIVE_URL", "https://spice-company.onrender.com")
G = "/home/claude/.npm-global/lib/node_modules"
tpl = open(f"{SB}/template.html").read()
lines = tpl.split("\n")
s = lines.index("<style>") + 1; e = lines.index("</style>")
base_css = "\n".join(lines[s:e])
css = base_css + "\n" + open("src/company.css").read()

mk = open(f"{SB}/markets_front.js").read().replace('    tipOn(hit, () => ""); // keep the shared tooltip styling\n', '')
a = mk.index("  /* ---------- EHEDG tracker ---------- */"); b = mk.index("  /* chat: give the AI")
mk = mk[:a] + mk[b:]
mk = re.sub(r'    if \(/ehedg\|hygien.*?\n    \}\n', '', mk, flags=re.S)
assert "EH_GL" not in mk, "ehedg left"
mk = mk.replace('[["india", "India"], ["world", "World"], ["comm", "Commodities"], ["track", "My tracker"]].forEach', '[["india", "India"], ["world", "World"], ["comm", "Commodities"], ["track", "My tracker"]].filter(([k]) => k !== "world" || ((MKT.prices || {}).world || []).length).forEach')
mk = mk.replace('function afterLoad() { paintLive(); if (tab === "prices") renderPricesBody(); paintBadge(); }', 'function afterLoad() { paintLive(); if (tab === "prices") renderPricesBody(); if (tab === "home") renderTicker(); paintBadge(); }')
mk = mk.replace('if (tab === "prices" || watch.length) refreshAll(false); if (tab === "ehedg"', 'if (tab === "prices" || tab === "home" || watch.length) refreshAll(false); if (tab === "ehedg"')
mk = mk.replace('"sb.', '"sc.')
mk = mk.replace("SpiceBot's AI", "the site's AI").replace("Ask SpiceBot why", "Ask why").replace("Ask SpiceBot about", "Ask about").replace("SpiceBot checks", "This page checks").replace("SpiceBot saves", "The site saves").replace("SpiceBot will try", "It will try").replace("SpiceBot price alert", "Spice price alert").replace("SpiceBot has been updated", "This website has been updated")
pdf = open(f"{SB}/pdf_front.js").read()
a = pdf.index("  function ehedgPdf() {"); b = pdf.index("  function pricesPdf() {")
pdf = pdf[:a] + pdf[b:]
pdf = pdf.replace('pdfEnc("SpiceBot · " + title)', 'pdfEnc("Spice Guide · " + title)')
pdf = pdf.replace('d.text(d.M + 36, 43, "SpiceBot", {', 'd.text(d.M + 36, 43, "Spice Guide", {')
pdf = pdf.replace("/Author (SpiceBot) /Producer (SpiceBot)", "/Producer (Spice Guide)")
pdf = pdf.replace("SpiceBot's AI", "the site's AI").replace("SpiceBot price report", "Spice price report")
js = open("src/company.js").read() + "\n" + mk + "\n" + pdf + "\n" + open("src/guide.js").read() + "\n" + open("src/tail.js").read()
js = js.replace("__LIVE_URL__", LIVE)
left = [w for w in re.findall(r"SpiceBot[^\"'`]{0,30}", js) if "SpiceBotAndroid" not in w]
if left: print("note: SpiceBot mentions left:", left[:8])

safe = lambda x: re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', lambda m: '\\u%04x' % ord(m.group()), re.sub(r'</(script)', r'<\\/\1', x, flags=re.I).replace('<!--', '<\\!--'))
libs = "<script>" + safe(open(G + "/marked/lib/marked.umd.js").read()) + "</script>\n<script>" + safe(open("/opt/npm-tools/node_modules/dompurify/dist/purify.min.js").read()) + "</script>"
body = open("src/body.html").read()
head = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<title>Spice Guide · How to manufacture spices</title><meta name="description" content="A practical guide to spice manufacturing in India: what to make, how to make it, machines, licences, quality, market prices and costing, with an AI advisor.">'
        '<meta name="theme-color" content="#8a4b0f"><link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">'
        '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">'
        '<style>:root{padding-top:env(safe-area-inset-top,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>'
        "<style>" + css + "</style>" + libs + "</head><body>")
reg = '<script>if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && window.top === window) { addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {})); }</script>'
html = head + body + "<script>\n" + js + "\n</script>" + reg + "</body></html>"
open("web/index.html", "w").write(html)
os.makedirs("android/app/src/main/assets", exist_ok=True)
open("android/app/src/main/assets/index.html", "w").write(html)
print("built", len(html), "bytes")
