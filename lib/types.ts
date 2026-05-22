export type TransactionStatus = 'succeeded' | 'pending' | 'failed' | 'refunded'
export type Plan = 'Starter' | 'Pro' | 'Enterprise'

export interface Transaction {
  id: string
  customer: string
  email: string
  plan: Plan
  amount: number
  status: TransactionStatus
  date: string // ISO 8601
}

export interface DailyRevenuePoint {
  date: string // ISO date YYYY-MM-DD
  revenue: number
}

export interface DashboardKpis {
  mrr: number
  mrrChangePct: number
  revenue30d: number
  revenueChangePct: number
  activeCustomers: number
  customersChangePct: number
  churnPct: number
  churnChangePct: number // negative is good for churn
}

export interface DashboardData {
  kpis: DashboardKpis
  dailyRevenue: DailyRevenuePoint[]
  transactions: Transaction[]
}
