'use client'

import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string
  changePct: number
  /** When true, a negative changePct is treated as positive (e.g., churn dropping). */
  invertColor?: boolean
  hint?: string
}

export function KpiCard({ label, value, changePct, invertColor = false, hint }: Props) {
  const isPositive = invertColor ? changePct < 0 : changePct > 0
  const isFlat = changePct === 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium',
            isFlat
              ? 'bg-gray-100 text-gray-700'
              : isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
          )}
        >
          {!isFlat && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={cn('h-3 w-3', changePct < 0 && 'rotate-180')}
            >
              <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {Math.abs(changePct).toFixed(1)}%
        </span>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
    </div>
  )
}
