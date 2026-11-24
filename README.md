# Rabeea · Portfolio

Vite + React + Three.js. Same stack as the earlier portfolios (Vite React SPA on Vercel).

## Run
npm install
npm run dev            # local dev server
npm run build          # production build -> dist/ (deploy this to Vercel)
npm run build:single   # one self-contained index.html -> dist-single/

## Edit content
All text, links, skills, services and projects live in `src/data.js`.
Set the real email in `PROFILE.email` before deploying (it also feeds the "Book demo" calendar link).

## Files
- src/data.js    content
- src/App.jsx    sections and UI components
- src/scene.js   WebGL background: morphing core, orbit rings, particles
- src/styles.css design system and layout
