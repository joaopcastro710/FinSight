'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

type Props = {
  data: Record<string, any>[]
  categories: string[]
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

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-sm shadow-xl space-y-1">
        <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((p: any) => (
          p.value > 0 && (
            <p key={p.name} style={{ color: p.fill }}>
              {p.name}: €{p.value.toFixed(2)}
            </p>
          )
        ))}
      </div>
    )
  }
  return null
}

export default function CategoryTrendsChart({ data, categories }: Props) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-medium mb-5" style={{ color: 'var(--text-secondary)' }}>
        TENDÊNCIAS POR CATEGORIA (TOP 5)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#55556A' }}
            axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#55556A' }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => `€${v}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E1E2E' }} />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{value}</span>
            )}
          />
          {categories.map(cat => (
            <Bar key={cat} dataKey={cat} stackId="a"
              fill={CATEGORY_COLORS[cat] || '#6B7280'}
              radius={categories.indexOf(cat) === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}