# Spice company website

A website for a Kerala spice manufacturer: products (spice powders, blends and masalas, whole spices),
process and quality, bulk and export enquiries (sent by WhatsApp or email, or saved as a PDF), live
market prices with a tracker, and an AI assistant (Google Gemini) that also answers offline with
built-in replies. Works on phones, tablets and computers, offline after the first visit, and as an
Android app (`web/SpiceCo.apk`).

## Fill in your company details

Everything about the company lives in **`web/data/company.json`**. Any field left empty (`""`) shows
on the site as a clearly marked blank, and the AI is told never to make it up.

- `name`, `short_name`, `tagline`, `about`, `founded`, `city`, `address`
- `phone`, `whatsapp`, `email`, `hours`, `social`
- `fssai_licence`, `gstin`, `certifications` (only ones you actually hold)
- `highlights`: what makes you different
- `bulk`: minimum order, packing, private label, export markets, lead time
- `products`: each product's `packs` (e.g. `["100 g", "250 g", "1 kg"]`) and `price` (or leave empty for "Price on request")

Edit the file on GitHub and save. Render updates the live site in about a minute, and open pages,
including the app, pick up the change by themselves.

## Live server (Render)

`render.yaml` sets up one free web service. Add `GEMINI_API_KEY` in the service's Environment.
The server (`backend/server.py`) uses only Python's standard library.

## Run locally

```
cp backend/.env.example backend/.env   # paste your Gemini key
python backend/server.py               # http://127.0.0.1:8000
```

## Market prices

From the Spices Board of India (daily prices and the weekly Spice Market report) and the IMF
(commodities, via FRED). Indicative only.
