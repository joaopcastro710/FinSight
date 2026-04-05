'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Transaction } from '@/types'

type Props = {
  initialTransactions: Transaction[]
  categories: string[]
}

const ITEMS_PER_PAGE = 15

const CATEGORY_COLORS: Record<string, string> = {
  'Alimentação':    '#16A34A',
  'Transportes':    '#2563EB',
  'Lazer':          '#9333EA',
  'Saúde':          '#DC2626',
  'Habitação':      '#D97706',
  'Subscrições':    '#0891B2',
  'Restaurantes':   '#EA580C',
  'Compras Online': '#DB2777',
  'Educação':       '#4F46E5',
  'Outros':         '#6B7280',
}

export default function TransactionsClient({ initialTransactions, categories }: Props) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')
  const [page, setPage] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const router = useRouter()

  // Filtrar e ordenar — useMemo recalcula só quando as dependências mudam
  // Isto é muito mais eficiente do que filtrar a cada render
  const filtered = useMemo(() => {
    let result = [...transactions]

    // Pesquisa por descrição
    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(t =>
        t.description.toLowerCase().includes(term)
      )
    }

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory)
    }

    // Filtro por data início
    if (dateFrom) {
      result = result.filter(t => t.date >= dateFrom)
    }

    // Filtro por data fim
    if (dateTo) {
      result = result.filter(t => t.date <= dateTo)
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortDir === 'desc'
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date)
      } else {
        return sortDir === 'desc'
          ? b.amount - a.amount
          : a.amount - b.amount
      }
    })

    return result
  }, [transactions, search, selectedCategory, dateFrom, dateTo, sortBy, sortDir])

  // Totais dos resultados filtrados
  const filteredTotal = filtered.reduce((sum, t) => sum + t.amount, 0)

  // Paginação
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  // Reset da página quando os filtros mudam
  function handleFilterChange(fn: () => void) {
    fn()
    setPage(0)
  }

  // Alternar ordenação
  function handleSort(col: 'date' | 'amount') {
    if (sortBy === col) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(col)
      setSortDir('desc')
    }
    setPage(0)
  }

  // Iniciar edição de categoria
  function startEdit(t: Transaction) {
    setEditingId(t.id)
    setEditCategory(t.category)
  }

  // Guardar edição
  async function saveEdit(id: string) {
    setSavingId(id)

    const res = await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: editCategory }),
    })

    if (res.ok) {
      // Atualizar estado local sem recarregar a página
      setTransactions(prev =>
        prev.map(t => t.id === id ? { ...t, category: editCategory } : t)
      )
    }

    setEditingId(null)
    setSavingId(null)
  }

  // Apagar transação
  async function deleteTransaction(id: string) {
    if (!confirm('Tens a certeza que queres apagar esta transação?')) return

    const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })

    if (res.ok) {
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
  }

  // Limpar todos os filtros
  function clearFilters() {
    setSearch('')
    setSelectedCategory('all')
    setDateFrom('')
    setDateTo('')
    setPage(0)
  }

  const hasActiveFilters = search || selectedCategory !== 'all' || dateFrom || dateTo

  return (
    <div className="space-y-4">

      {/* Barra de filtros */}
      <div className="card p-4 space-y-3">

        {/* Linha 1: Pesquisa */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: 'var(--text-muted)' }}>
            🔍
          </span>
          <input
            className="input pl-9"
            type="text"
            placeholder="Pesquisar por descrição..."
            value={search}
            onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
          />
        </div>

        {/* Linha 2: Categoria + Datas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => handleFilterChange(() => setSelectedCategory(e.target.value))}
            style={{ cursor: 'pointer' }}
          >
            <option value="all">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                {cat}
              </option>
            ))}
          </select>

          <input
            className="input"
            type="date"
            value={dateFrom}
            onChange={(e) => handleFilterChange(() => setDateFrom(e.target.value))}
            style={{ colorScheme: 'dark' }}
          />

          <input
            className="input"
            type="date"
            value={dateTo}
            onChange={(e) => handleFilterChange(() => setDateTo(e.target.value))}
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {/* Linha 3: Resultados + limpar filtros */}
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            {hasActiveFilters ? ` · Total: €${filteredTotal.toFixed(2)}` : ''}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="text-xs hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-text)' }}>
              ✕ Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Nenhuma transação encontrada para os filtros ativos.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>

                  {/* Cabeçalho Data — clicável para ordenar */}
                  <th className="px-5 py-3 text-left">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
                      style={{ color: sortBy === 'date' ? 'var(--accent-text)' : 'var(--text-muted)' }}
                    >
                      DATA
                      {sortBy === 'date' && (sortDir === 'desc' ? ' ↓' : ' ↑')}
                    </button>
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}>
                    DESCRIÇÃO
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}>
                    CATEGORIA
                  </th>

                  {/* Cabeçalho Valor — clicável para ordenar */}
                  <th className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center gap-1 text-xs font-medium ml-auto transition-opacity hover:opacity-80"
                      style={{ color: sortBy === 'amount' ? 'var(--accent-text)' : 'var(--text-muted)' }}
                    >
                      {sortBy === 'amount' && (sortDir === 'desc' ? '↓ ' : '↑ ')}
                      VALOR
                    </button>
                  </th>

                  <th className="px-5 py-3 text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}>
                    AÇÕES
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>

                    {/* Data */}
                    <td className="px-5 py-3.5 text-xs whitespace-nowrap"
                      style={{ color: 'var(--text-muted)' }}>
                      {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-PT')}
                    </td>

                    {/* Descrição */}
                    <td className="px-5 py-3.5 text-sm max-w-xs"
                      style={{ color: 'var(--text-primary)' }}>
                      <span className="truncate block" title={t.description}>
                        {t.description}
                      </span>
                    </td>

                    {/* Categoria — editável inline */}
                    <td className="px-5 py-3.5">
                      {editingId === t.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            className="input py-1 text-xs"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            autoFocus
                            style={{ cursor: 'pointer' }}
                          >
                            {Object.keys(CATEGORY_COLORS).map(cat => (
                              <option key={cat} value={cat}
                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => saveEdit(t.id)}
                            disabled={savingId === t.id}
                            className="text-xs px-2 py-1 rounded transition-opacity hover:opacity-80"
                            style={{ background: 'var(--success)', color: 'white' }}
                          >
                            {savingId === t.id ? '...' : '✓'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-xs px-2 py-1 rounded transition-opacity hover:opacity-80"
                            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(t)}
                          className="badge hover:opacity-80 transition-opacity"
                          style={{
                            borderColor: (CATEGORY_COLORS[t.category] || '#6B7280') + '40',
                            color: CATEGORY_COLORS[t.category] || '#6B7280',
                          }}
                          title="Clica para editar"
                        >
                          {t.category}
                        </button>
                      )}
                    </td>

                    {/* Valor */}
                    <td className="px-5 py-3.5 text-sm font-medium text-right whitespace-nowrap"
                      style={{ color: '#F87171' }}>
                      -€{Number(t.amount).toFixed(2)}
                    </td>

                    {/* Ações */}
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="text-xs transition-opacity hover:opacity-80"
                        style={{ color: 'var(--text-muted)' }}
                        title="Apagar transação"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-5 py-3 flex items-center justify-between"
            style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Página {page + 1} de {totalPages} · {filtered.length} resultados
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary text-xs py-1 px-3">
                ← Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="btn-secondary text-xs py-1 px-3">
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}