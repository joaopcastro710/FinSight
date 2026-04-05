import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getReportsData } from '@/lib/data'
import StatsCards from '@/components/reports/StatsCards'
import MonthlyBarChart from '@/components/reports/MonthlyBarChart'
import CategoryTrendsChart from '@/components/reports/CategoryTrendsChart'
import TopCategoriesTable from '@/components/reports/TopCategoriesTable'
import Link from 'next/link'

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const {
    transactions,
    monthlyData,
    categoryTrends,
    topCategories,
    topMonths,
    averageMonthly,
  } = await getReportsData()

  const hasData = transactions.length > 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Navbar */}
      <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
        className="sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-muted)' }}>
              ← Dashboard
            </Link>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Reports
            </span>
          </div>
          <Link href="/upload" className="btn-primary text-xs py-1.5 px-3">
            + Importar CSV
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Reports & Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Análise detalhada dos teus padrões de consumo
          </p>
        </div>

        {/* Estado vazio */}
        {!hasData && (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Sem dados para analisar
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Importa o teu primeiro extrato bancário para ver os reports
            </p>
            <Link href="/upload" className="btn-primary py-2 px-5">
              📂 Importar CSV
            </Link>
          </div>
        )}

        {hasData && (
          <>
            {/* Cards de estatísticas */}
            <StatsCards
              monthlyData={monthlyData}
              averageMonthly={averageMonthly}
              topMonths={topMonths}
              totalTransactions={transactions.length}
            />

            {/* Gráfico de barras mensal */}
            <MonthlyBarChart data={monthlyData} average={averageMonthly} />

            {/* Gráfico de tendências por categoria */}
            {monthlyData.length > 1 && topCategories && (
              <CategoryTrendsChart
                data={categoryTrends}
                categories={topCategories}
              />
            )}

            {/* Tabela completa de categorias */}
            <TopCategoriesTable transactions={transactions} />
          </>
        )}
      </main>
    </div>
  )
}