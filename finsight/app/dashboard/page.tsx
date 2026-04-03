import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTransactions, getCategorySummary, getMonthlyTotals } from '@/lib/data'
import SummaryCards from '@/components/dashboard/SummaryCards'
import SpendingPieChart from '@/components/dashboard/SpendingPieChart'
import SpendingLineChart from '@/components/dashboard/SpendingLineChart'
import TransactionTable from '@/components/dashboard/TransactionTable'
import CategoryList from '@/components/dashboard/CategoryList'
import InsightCard from '@/components/dashboard/InsightCard'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [transactions, categorySummary, monthlyTotals] = await Promise.all([
    getTransactions(),
    getCategorySummary(),
    getMonthlyTotals(),
  ])

  const hasData = transactions.length > 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Navbar */}
      <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
        className="sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'var(--accent)' }}>
              💡
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              FinSight
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/upload" className="btn-primary text-xs py-1.5 px-3">
              + Importar CSV
            </Link>
            <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-5">

        {/* Estado vazio */}
        {!hasData && (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">📂</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Ainda sem dados
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Importa o teu primeiro extrato bancário para começar
            </p>
            <Link href="/upload" className="btn-primary py-2 px-5">
              📂 Importar CSV
            </Link>
          </div>
        )}

        {hasData && (
          <>
            <SummaryCards transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <SpendingPieChart data={categorySummary} />
              <CategoryList data={categorySummary} />
            </div>

            {monthlyTotals.length > 1 && (
              <SpendingLineChart data={monthlyTotals} />
            )}

            {/* InsightCard — será preenchido na Parte 2 */}
            <InsightCard userId={user.id} transactions={transactions} />

            <TransactionTable transactions={transactions} />
          </>
        )}
      </main>
    </div>
  )
}