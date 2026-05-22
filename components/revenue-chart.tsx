'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { formatUSD } from '@/lib/utils'
import type { DailyRevenuePoint } from '@/lib/types'

interface Props {
  data: DailyRevenuePoint[]
}

export function RevenueChart({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.revenue, 0)
  const avg = Math.round(total / Math.max(data.length, 1))
  const peak = data.reduce((max, d) => (d.revenue > max ? d.revenue : max), 0)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Revenue</h2>
          <p className="text-sm text-gray-500">Daily revenue, last 30 days</p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Avg / day
            </p>
            <p className="font-mono text-sm font-semibold text-gray-900">
              {formatUSD(avg)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Peak day
            </p>
            <p className="font-mono text-sm font-semibold text-gray-900">
              {formatUSD(peak)}
            </p>
          </div>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => format(parseISO(d), 'MMM d')}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={32}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#059669"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0].payload as DailyRevenuePoint
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-500">{format(parseISO(point.date), 'EEEE, MMM d')}</p>
      <p className="font-mono text-sm font-semibold text-gray-900">
        {formatUSD(point.revenue)}
      </p>
    </div>
  )
}
