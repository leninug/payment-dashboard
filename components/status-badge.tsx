import { cn } from '@/lib/utils'
import type { TransactionStatus } from '@/lib/types'

const STYLES: Record<TransactionStatus, string> = {
  succeeded: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  failed: 'bg-red-50 text-red-700 ring-red-200',
  refunded: 'bg-gray-100 text-gray-700 ring-gray-200',
}

const LABELS: Record<TransactionStatus, string> = {
  succeeded: 'Succeeded',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        STYLES[status]
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'succeeded' && 'bg-emerald-500',
          status === 'pending' && 'bg-amber-500 animate-pulse',
          status === 'failed' && 'bg-red-500',
          status === 'refunded' && 'bg-gray-400'
        )}
      />
      {LABELS[status]}
    </span>
  )
}
