'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'

type Props = {
  data: { month: string; total: number; count: number }[]
  average: number
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-sm shadow-xl">
        <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p style={{ color: '#93C5FD' }}>
          Total: €{payload[0].value.toFixed(2)}
        </p>
        <p style={{ color: 'var(--text-muted)' }}>
          {payload[0].payload.count} transações
        </p>
      </div>
    )
  }
  return null
}

export default function MonthlyBarChart({ data, average }: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          GASTOS MENSAIS
        </h2>
        <span className="text-xs px-2 py-1 rounded"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
          Média: €{average.toFixed(2)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#55556A' }}
            axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#55556A' }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => `€${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E1E2E' }} />
          {/* Linha de média */}
          <ReferenceLine y={average} stroke="#1E40AF" strokeDasharray="4 4"
            label={{ value: 'Média', fill: '#93C5FD', fontSize: 10, position: 'right' }} />
          <Bar dataKey="total" fill="#1E40AF" radius={[4, 4, 0, 0]}
            opacity={0.9} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}