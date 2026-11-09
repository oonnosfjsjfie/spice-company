# Spice Guide

A practical guide to spice manufacturing in India (especially Kerala), for spice companies and new
entrepreneurs. It covers what to make, how to make it, machines and setup, licences and schemes, quality and
hygiene, live market prices, and cost and batch calculators, with an AI advisor (Google Gemini) that also gives
built-in answers offline. It works on phones, tablets and computers, offline after the first visit, and as an
Android app (`web/SpiceCo.apk`, shown as "Spice Guide").

Live: https://spice-company.onrender.com

## Turn on the AI

On Render, open the service, then Environment, and add `GEMINI_API_KEY` with your Google AI Studio key. Never
put the key in this repository.

## Where the content lives

- `src/guide.js`: product ideas, step-by-step processes, machines, setup roadmap, licences, schemes, quality
  tests, hygiene, labels, problems and fixes, the calculators, and the facts given to the AI. Each figure links
  to its source.
- `src/company.js`: pages, home, chat and the advisor's built-in answers.
- `backend/server.py`: serves `web/`, the AI chat (`/api/chat`) and live prices (`/api/prices`, `/api/commodities`).

Edit `src/`, run `python build.py`, and commit. Render redeploys, and open pages and the app update themselves.

## Sources

FSSAI (spice standards, licensing thresholds), Spices Board of India (prices, exporter registration),
NIFTEM/PMFME (processing), Kerala Agricultural University (post-harvest), IMF via FRED (commodities). Rules
change: confirm with the authorities before acting. General guidance, not legal or financial advice.
