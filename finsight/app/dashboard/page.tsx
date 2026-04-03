import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTransactions, getCategorySummary, getMonthlyTotals } from '@/lib/data'
import SummaryCards from '@/components/dashboard/SummaryCards'
import SpendingPieChart from '@/components/dashboard/SpendingPieChart'
import SpendingLineChart from '@/components/dashboard/SpendingLineChart'
import TransactionTable from '@/components/dashboard/TransactionTable'
import CategoryList from '@/components/dashboard/CategoryList'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  // 1. Verificar autenticação
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 2. Buscar todos os dados em paralelo (mais rápido que sequencial)
  const [transactions, categorySummary, monthlyTotals] = await Promise.all([
    getTransactions(),
    getCategorySummary(),
    getMonthlyTotals(),
  ])

  const hasData = transactions.length > 0

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">💡 FinSight</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/upload"
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Importar CSV
            </Link>
            <span className="text-sm text-gray-400 hidden sm:block">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Estado vazio — sem transações ainda */}
        {!hasData && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-5xl mb-4">📂</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Ainda sem dados
            </h2>
            <p className="text-gray-400 mb-6">
              Importa o teu primeiro extrato bancário para começar
            </p>
            <Link
              href="/upload"
              className="inline-block py-2 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              📂 Importar CSV
            </Link>
          </div>
        )}

        {/* Dashboard com dados */}
        {hasData && (
          <>
            {/* Cards de resumo */}
            <SummaryCards transactions={transactions} />

            {/* Gráficos lado a lado (em desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingPieChart data={categorySummary} />
              <CategoryList data={categorySummary} />
            </div>

            {/* Gráfico de linha — largura total */}
            {monthlyTotals.length > 1 && (
              <SpendingLineChart data={monthlyTotals} />
            )}

            {/* Tabela de transações */}
            <TransactionTable transactions={transactions} />
          </>
        )}

      </main>
    </div>
  )
}