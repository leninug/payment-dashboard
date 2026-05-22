import type {
  DashboardData,
  DailyRevenuePoint,
  Plan,
  Transaction,
  TransactionStatus,
} from './types'

// Seeded LCG so the same mock data renders consistently across SSR/hydration
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

const FIRST_NAMES = [
  'Aiden', 'Maya', 'Liam', 'Sofia', 'Ethan', 'Aria', 'Noah', 'Zoe',
  'Mason', 'Lily', 'Logan', 'Ella', 'James', 'Mia', 'Lucas', 'Ava',
  'Henry', 'Chloe', 'Owen', 'Ruby', 'Daniel', 'Hana', 'Ryan', 'Iris',
  'Adrian', 'Nora', 'Felix', 'Layla', 'Marcus', 'Cleo',
]

const LAST_NAMES = [
  'Chen', 'Patel', 'Nguyen', 'Kim', 'Garcia', 'Rivera', 'Singh', 'Cohen',
  'Mueller', 'Tanaka', 'Silva', 'OBrien', 'Petrov', 'Yamamoto', 'Hassan',
  'Martin', 'Schmidt', 'Anderson', 'Park', 'Reyes',
]

const COMPANIES = [
  'acmecorp.com', 'lumen.io', 'pixelforge.com', 'northwind.dev', 'sequoia.app',
  'helix.tech', 'nimbus.cloud', 'aperture.co', 'kelvin.ai', 'tidalwave.io',
]

const PLAN_AMOUNTS: Record<Plan, number> = {
  Starter: 29,
  Pro: 99,
  Enterprise: 299,
}

const PLAN_WEIGHTS: Array<[Plan, number]> = [
  ['Starter', 0.55],
  ['Pro', 0.35],
  ['Enterprise', 0.10],
]

const STATUS_WEIGHTS: Array<[TransactionStatus, number]> = [
  ['succeeded', 0.85],
  ['pending', 0.08],
  ['failed', 0.05],
  ['refunded', 0.02],
]

function pickWeighted<T>(items: Array<[T, number]>, rand: () => number): T {
  const r = rand()
  let acc = 0
  for (const [value, weight] of items) {
    acc += weight
    if (r <= acc) return value
  }
  return items[items.length - 1][0]
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function toIsoDate(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

export function generateDashboardData(seed = 42): DashboardData {
  const rand = makeRng(seed)
  const now = new Date('2026-05-21T00:00:00Z') // fixed for SSR consistency

  // Daily revenue for last 30 days
  const dailyRevenue: DailyRevenuePoint[] = []
  let revenue30d = 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    // Trend up gently with daily variance
    const trend = 4500 + (29 - i) * 60
    const variance = (rand() - 0.5) * 1800
    const dailyDip = d.getUTCDay() === 0 || d.getUTCDay() === 6 ? -800 : 0
    const value = Math.max(2000, Math.round(trend + variance + dailyDip))
    dailyRevenue.push({ date: toIsoDate(d), revenue: value })
    revenue30d += value
  }

  // Transactions across the 30 days (~80 entries)
  const transactions: Transaction[] = []
  for (let i = 0; i < 80; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
    const useCompanyEmail = rand() < 0.4
    const emailDomain = useCompanyEmail
      ? COMPANIES[Math.floor(rand() * COMPANIES.length)]
      : 'gmail.com'
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@${emailDomain}`

    const plan = pickWeighted(PLAN_WEIGHTS, rand)
    const status = pickWeighted(STATUS_WEIGHTS, rand)
    const baseAmount = PLAN_AMOUNTS[plan]
    const amount = status === 'refunded' ? -baseAmount : baseAmount

    const daysBack = Math.floor(rand() * 30)
    const hoursOffset = Math.floor(rand() * 86400 * 1000)
    const date = new Date(now)
    date.setUTCDate(date.getUTCDate() - daysBack)
    const dateIso = new Date(date.getTime() - hoursOffset).toISOString()

    transactions.push({
      id: `txn_${(seed * 31 + i * 7).toString(36)}${i.toString(36).padStart(4, '0')}`,
      customer: `${first} ${last}`,
      email,
      plan,
      amount,
      status,
      date: dateIso,
    })
  }
  transactions.sort((a, b) => b.date.localeCompare(a.date))

  // KPIs derived (with hand-crafted growth values for storytelling)
  const activeCustomers = transactions.filter(
    (t) => t.status === 'succeeded'
  ).length * 18 + 312 // scale up to look like a real SaaS
  const mrr = Math.round(
    transactions
      .filter((t) => t.status === 'succeeded')
      .reduce((sum, t) => sum + t.amount, 0) * 2.4
  )

  return {
    kpis: {
      mrr,
      mrrChangePct: 12.4,
      revenue30d,
      revenueChangePct: 8.7,
      activeCustomers,
      customersChangePct: 5.2,
      churnPct: 2.4,
      churnChangePct: -0.3, // negative is good for churn
    },
    dailyRevenue,
    transactions,
  }
}
