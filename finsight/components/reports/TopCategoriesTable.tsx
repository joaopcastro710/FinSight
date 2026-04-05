'use client'

type Props = {
  transactions: {
    category: string
    amount: number
  }[]
}

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

export default function TopCategoriesTable({ transactions }: Props) {
  const grandTotal = transactions.reduce((sum, t) => sum + t.amount, 0)

  const grouped = transactions.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { total: 0, count: 0 }
    acc[t.category].total += t.amount
    acc[t.category].count += 1
    return acc
  }, {} as Record<string, { total: number; count: number }>)

  const sorted = Object.entries(grouped)
    .sort(([, a], [, b]) => b.total - a.total)

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          TODAS AS CATEGORIAS
        </h2>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Categoria', 'Transações', 'Total', '% do Total'].map((h, i) => (
              <th key={h}
                className={`px-6 py-3 text-xs font-medium ${i > 0 ? 'text-right' : 'text-left'}`}
                style={{ color: 'var(--text-muted)' }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(([category, { total, count }], i) => {
            const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0
            const color = CATEGORY_COLORS[category] || '#6B7280'
            return (
              <tr key={category}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    {/* Ranking */}
                    <span className="text-xs w-5 text-center"
                      style={{ color: 'var(--text-muted)' }}>
                      {i + 1}
                    </span>
                    {/* Indicador de cor */}
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: color }} />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {category}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-sm text-right"
                  style={{ color: 'var(--text-secondary)' }}>
                  {count}
                </td>
                <td className="px-6 py-3.5 text-sm font-medium text-right"
                  style={{ color: '#F87171' }}>
                  €{total.toFixed(2)}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1 rounded-full overflow-hidden"
                      style={{ background: 'var(--bg-elevated)' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-xs w-10 text-right"
                      style={{ color: 'var(--text-muted)' }}>
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}