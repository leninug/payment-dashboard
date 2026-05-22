'use client'

import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { StatusBadge } from './status-badge'
import { cn, formatUSD } from '@/lib/utils'
import type { Transaction, TransactionStatus } from '@/lib/types'

interface Props {
  transactions: Transaction[]
}

const FILTERS: Array<{ value: TransactionStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'succeeded', label: 'Succeeded' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

const PAGE_SIZE = 10

export function TransactionsTable({ transactions }: Props) {
  const [filter, setFilter] = useState<TransactionStatus | 'all'>('all')
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transactions.filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false
      if (q && !t.customer.toLowerCase().includes(q) && !t.email.toLowerCase().includes(q)) return false
      return true
    })
  }, [transactions, filter, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Recent transactions
          </h2>
          <p className="text-sm text-gray-500">
            {filtered.length} of {transactions.length} payments
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="Search customer or email…"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setFilter(f.value)
                  setPage(0)
                }}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition',
                  filter === f.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-sm text-gray-500"
                >
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              pageItems.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{t.customer}</div>
                    <div className="text-xs text-gray-500">{t.email}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{t.plan}</td>
                  <td
                    className={cn(
                      'px-5 py-3 text-right font-mono font-medium',
                      t.amount < 0 ? 'text-red-600' : 'text-gray-900'
                    )}
                  >
                    {t.amount < 0 ? '−' : ''}
                    {formatUSD(Math.abs(t.amount), true)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {format(parseISO(t.date), 'MMM d, h:mm a')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3 text-sm">
        <span className="text-gray-500">
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
