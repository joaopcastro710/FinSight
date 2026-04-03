import { Transaction } from '@/types'

type Props = { transactions: Transaction[] }

export default function SummaryCards({ transactions }: Props) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0)
  const thisMonth = new Date().toISOString().substring(0, 7)
  const thisMonthTotal = transactions
    .filter(t => t.date.startsWith(thisMonth))
    .reduce((sum, t) => sum + t.amount, 0)

  const topCategory = Object.entries(
    transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
  ).sort(([, a], [, b]) => b - a)[0]?.[0] || '—'

  const cards = [
    { label: 'Total Gasto', value: `€${total.toFixed(2)}`, icon: '💶', accent: '#1E40AF' },
    { label: 'Este Mês', value: `€${thisMonthTotal.toFixed(2)}`, icon: '📅', accent: '#7C3AED' },
    { label: 'Transações', value: String(transactions.length), icon: '🔢', accent: '#059669' },
    { label: 'Top Categoria', value: topCategory, icon: '🏆', accent: '#D97706' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="card p-5"
          style={{ borderTop: `2px solid ${card.accent}` }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
            {card.icon} {card.label}
          </p>
          <p className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}