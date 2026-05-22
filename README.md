# Payment Dashboard

Production-grade payment analytics dashboard. Built as a Next.js + Recharts demo showcasing real-world data visualization patterns.

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Recharts · date-fns

---

## What's inside

- **4 KPI cards** — MRR, 30-day revenue, active customers, churn rate. Each with trend arrows (green up / red down, inverted for churn).
- **Revenue chart** — 30-day daily revenue area chart with gradient fill, custom tooltip, summary stats (avg/day, peak day).
- **Transactions table** — Sortable, filterable (by status), searchable (customer/email), paginated. Status badges with animated pulse for pending.
- **Realistic mock data** — Seeded LCG generator produces 80 transactions across 30 days with proper weight distributions (85% succeeded, 8% pending, 5% failed, 2% refunded). Reproducible across SSR/hydration.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or push to GitHub and import at [vercel.com/new](https://vercel.com/new). No environment variables needed — this is a self-contained demo.

## Project structure

```
payment-dashboard/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Header + Dashboard mount
├── components/
│   ├── dashboard.tsx             # Top-level layout + data orchestration
│   ├── kpi-card.tsx              # Single KPI tile with trend arrow
│   ├── revenue-chart.tsx         # Recharts AreaChart with custom tooltip
│   ├── transactions-table.tsx    # Filterable/searchable/paginated table
│   └── status-badge.tsx          # Pill badge for transaction status
├── lib/
│   ├── mock-data.ts              # Seeded data generator
│   ├── types.ts                  # Transaction, KPIs, ChartPoint types
│   └── utils.ts                  # cn() + formatters (USD, %, number)
└── README.md
```

## How the mock data works

`lib/mock-data.ts` uses a seeded LCG (Linear Congruential Generator) PRNG so the same dataset is generated on every render. This avoids React hydration mismatches (server and client produce identical output) without disabling SSR.

The transaction generator uses weighted distributions for realistic-looking data:

```ts
const STATUS_WEIGHTS = [
  ['succeeded', 0.85],
  ['pending', 0.08],
  ['failed', 0.05],
  ['refunded', 0.02],
]
```

To wire up real data:
1. Replace `generateDashboardData(42)` in `components/dashboard.tsx` with a fetch from your backend
2. Conform your API response to the `DashboardData` shape in `lib/types.ts`
3. Add `'use server'` or `getServerSideProps` if you need server-side data fetching

## Why Recharts (not Chart.js / d3)?

- **React-native API** — no canvas/imperative code, just declarative components
- **Tree-shakeable** — only the chart types you import end up in the bundle
- **Responsive by default** — `<ResponsiveContainer>` handles all sizing
- **Composable** — custom tooltips, axes, gradients work without escape hatches

For pure d3 control (custom shapes, network graphs, etc.), use `react-d3-library` or `visx` instead.

## License

MIT
