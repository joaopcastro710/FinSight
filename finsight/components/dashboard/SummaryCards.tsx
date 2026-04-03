import { Transaction } from '@/types'

type Props = {
  transactions: Transaction[]
}

export default function SummaryCards({ transactions }: Props) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0)

  const topCategory = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const topCategoryName = Object.entries(topCategory).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] || '—'

  const thisMonth = new Date().toISOString().substring(0, 7)
  const thisMonthTotal = transactions
    .filter(t => t.date.startsWith(thisMonth))
    .reduce((sum, t) => sum + t.amount, 0)

  const cards = [
    {
      label: 'Total Gasto',
      value: `€${total.toFixed(2)}`,
      icon: '💶',
      color: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-700',
    },
    {
      label: 'Este Mês',
      value: `€${thisMonthTotal.toFixed(2)}`,
      icon: '📅',
      color: 'bg-purple-50 border-purple-100',
      textColor: 'text-purple-700',
    },
    {
      label: 'Transações',
      value: transactions.length.toString(),
      icon: '🔢',
      color: 'bg-green-50 border-green-100',
      textColor: 'text-green-700',
    },
    {
      label: 'Maior Categoria',
      value: topCategoryName,
      icon: '🏆',
      color: 'bg-orange-50 border-orange-100',
      textColor: 'text-orange-700',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.color} border rounded-2xl p-5`}
        >
          <div className="text-2xl mb-2">{card.icon}</div>
          <p className="text-sm text-gray-500 font-medium">{card.label}</p>
          <p className={`text-xl font-bold mt-1 ${card.textColor}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}