'use client'

import { useMemo } from 'react'
import { KpiCard } from './kpi-card'
import { RevenueChart } from './revenue-chart'
import { TransactionsTable } from './transactions-table'
import { generateDashboardData } from '@/lib/mock-data'
import { formatNumber, formatPercent, formatUSD } from '@/lib/utils'

export function Dashboard() {
  const data = useMemo(() => generateDashboardData(42), [])

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="MRR"
          value={formatUSD(data.kpis.mrr)}
          changePct={data.kpis.mrrChangePct}
          hint="vs last month"
        />
        <KpiCard
          label="Revenue (30d)"
          value={formatUSD(data.kpis.revenue30d)}
          changePct={data.kpis.revenueChangePct}
          hint="vs prev 30d"
        />
        <KpiCard
          label="Active customers"
          value={formatNumber(data.kpis.activeCustomers)}
          changePct={data.kpis.customersChangePct}
          hint="vs last month"
        />
        <KpiCard
          label="Churn rate"
          value={formatPercent(data.kpis.churnPct)}
          changePct={data.kpis.churnChangePct}
          invertColor
          hint="vs last month"
        />
      </section>

      <RevenueChart data={data.dailyRevenue} />

      <TransactionsTable transactions={data.transactions} />
    </div>
  )
}
