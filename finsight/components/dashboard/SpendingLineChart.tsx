'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type Props = { data: { month: string; total: number }[] }

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-sm shadow-xl">
        <p style={{ color: 'var(--text-secondary)' }}>{label}</p>
        <p className="font-semibold" style={{ color: 'var(--accent-text)' }}>
          €{payload[0].value.toFixed(2)}
        </p>
      </div>
    )
  }
  return null
}

export default function SpendingLineChart({ data }: Props) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-medium mb-5" style={{ color: 'var(--text-secondary)' }}>
        EVOLUÇÃO MENSAL
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#55556A' }}
            axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#55556A' }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => `€${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="total" stroke="#1E40AF"
            strokeWidth={2} dot={{ fill: '#1E40AF', r: 3 }}
            activeDot={{ r: 5, fill: '#93C5FD' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}