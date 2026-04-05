import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTransactions } from '@/lib/data'
import TransactionsClient from './transactions-client'
import Link from 'next/link'

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const transactions = await getTransactions()

  // Extrair categorias únicas para os filtros
  const categories = [...new Set(transactions.map(t => t.category))].sort()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Navbar */}
      <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
        className="sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}>
              ← Dashboard
            </Link>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Transações
            </span>
          </div>
          <Link href="/upload" className="btn-primary text-xs py-1.5 px-3">
            + Importar CSV
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Transações
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {transactions.length} transações no total
          </p>
        </div>

        <TransactionsClient
          initialTransactions={transactions}
          categories={categories}
        />
      </main>
    </div>
  )
}