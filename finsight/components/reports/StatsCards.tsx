type MonthData = {
  month: string
  monthKey: string
  total: number
  count: number
}

type Props = {
  monthlyData: MonthData[]
  averageMonthly: number
  topMonths: MonthData[]
  totalTransactions: number
}

export default function StatsCards({ monthlyData, averageMonthly, topMonths, totalTransactions }: Props) {
  const currentMonthKey = new Date().toISOString().substring(0, 7)
  const prevMonthKey = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString().substring(0, 7)

  const currentMonth = monthlyData.find(m => m.monthKey === currentMonthKey)
  const prevMonth = monthlyData.find(m => m.monthKey === prevMonthKey)

  // Variação percentual mês atual vs anterior
  const variation = currentMonth && prevMonth && prevMonth.total > 0
    ? ((currentMonth.total - prevMonth.total) / prevMonth.total) * 100
    : null

  const stats = [
    {
      label: 'ESTE MÊS',
      value: currentMonth ? `€${currentMonth.total.toFixed(2)}` : '—',
      sub: variation !== null
        ? `${variation > 0 ? '+' : ''}${variation.toFixed(1)}% vs mês anterior`
        : prevMonth ? `Mês anterior: €${prevMonth.total.toFixed(2)}` : 'Sem dados anteriores',
      subColor: variation === null ? 'var(--text-muted)'
        : variation > 0 ? '#F87171' : '#4ADE80',
      accent: '#1E40AF',
    },
    {
      label: 'MÉDIA MENSAL',
      value: `€${averageMonthly.toFixed(2)}`,
      sub: `${monthlyData.length} mese${monthlyData.length !== 1 ? 's' : ''} com dados`,
      subColor: 'var(--text-muted)',
      accent: '#7C3AED',
    },
    {
      label: 'TOTAL TRANSAÇÕES',
      value: String(totalTransactions),
      sub: currentMonth ? `${currentMonth.count} este mês` : 'sem dados este mês',
      subColor: 'var(--text-muted)',
      accent: '#059669',
    },
    {
      label: 'MÊS MAIS CARO',
      value: topMonths[0] ? `€${topMonths[0].total.toFixed(2)}` : '—',
      sub: topMonths[0]?.month || '—',
      subColor: 'var(--text-muted)',
      accent: '#D97706',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="card p-5"
          style={{ borderTop: `2px solid ${s.accent}` }}>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
            {s.label}
          </p>
          <p className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {s.value}
          </p>
          <p className="text-xs" style={{ color: s.subColor }}>
            {s.sub}
          </p>
        </div>
      ))}
    </div>
  )
}