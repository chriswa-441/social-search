# Jina Social Search Tool

A simple React + Vite web app that queries Jina Reader public endpoint to find social media links for a company (site: queries across many social domains) and lists found links flat (no grouping).

## How to use (developer)
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build` (produces `dist/`)

## Notes
- This project uses the public Jina Reader endpoint `https://s.jina.ai/?q=`. The endpoint may return only top results; for exhaustive crawling a dedicated crawler is needed.
- If you plan to host on GitHub Pages, see instructions in the GitHub repo settings (you may need a CI step to build before publishing).
