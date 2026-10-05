# Digital care roadmap demo

Next.js App Router frontend for the [digital care roadmap](https://github.com/ChristopherKiokoStrathmore/digital-care-roadmap).

It reads `backlog.csv` in this directory (a copy of the repository sheet) and renders:

- a Now / Next / Later board for the three horizons
- a value-versus-effort scatter and scored list of all 17 backlog rows
- an OKR section labelled illustrative

Value and effort are the integers in the sheet. The app does not invent a score.

## Run

```bash
npm ci
npm run dev
```

`npm run build` produces the production build.

## Deploy on Vercel

Set the Vercel project **Root Directory** to `web`. The framework preset is Next.js. No extra install or build command is required.

The production URL is not assigned yet. The repository README keeps a live-demo placeholder until the first deploy.
