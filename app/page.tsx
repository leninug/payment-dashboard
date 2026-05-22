import { Dashboard } from '@/components/dashboard'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Acme Payments</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Last 30 days · Live data ·{' '}
              <span className="font-mono text-xs text-brand-600">demo mode</span>
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Export CSV
            </button>
            <button className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">
              + New Payment
            </button>
          </div>
        </header>
        <Dashboard />
      </div>
    </main>
  )
}
