# Digital care roadmap demo

Next.js App Router frontend for the interactive roadmap.

- `/` Now / Next / Later board. Select a horizon, filter the sheet, and open a card.
- `/okrs` Illustrative objectives and key results, with the backlog rows each one points at.
- `/backlog` Value-versus-effort plot and table. Filters cover quadrant, status, sprint, horizon, type, and operator data.
- `/article` The roadmap write-up.

Live demo: [https://digital-care-roadmap.vercel.app](https://digital-care-roadmap.vercel.app)

On Vercel, set the project **Root Directory** to `web`.

```bash
npm install
npm run dev
npm run build
```

`data/backlog.csv` is a copy of the repository `backlog.csv`. Scores on the board are read from that file. OKR copy is labelled illustrative. Figures under `public/figures/` are copies of `assets/` and `docs/roadmap.png`.
