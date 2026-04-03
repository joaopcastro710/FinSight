'use client'

import { useState } from 'react'
import { Transaction } from '@/types'

type Props = { transactions: Transaction[] }

const ITEMS_PER_PAGE = 10

export default function TransactionTable({ transactions }: Props) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE)
  const paginated = transactions.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          TRANSAÇÕES RECENTES
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {transactions.length} no total
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Data', 'Descrição', 'Categoria', 'Valor'].map((h) => (
                <th key={h} className={`px-6 py-3 text-xs font-medium text-left ${h === 'Valor' ? 'text-right' : ''}`}
                  style={{ color: 'var(--text-muted)' }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => (
              <tr key={t.id} className="transition-colors"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-6 py-3.5 text-xs whitespace-nowrap"
                  style={{ color: 'var(--text-muted)' }}>
                  {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-PT')}
                </td>
                <td className="px-6 py-3.5 text-sm max-w-xs truncate"
                  style={{ color: 'var(--text-primary)' }}>
                  {t.description}
                </td>
                <td className="px-6 py-3.5">
                  <span className="badge">{t.category}</span>
                </td>
                <td className="px-6 py-3.5 text-sm font-medium text-right whitespace-nowrap"
                  style={{ color: '#F87171' }}>
                  -€{Number(t.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Página {page + 1} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0} className="btn-secondary text-xs py-1 px-3">
              ← Anterior
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1} className="btn-secondary text-xs py-1 px-3">
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}