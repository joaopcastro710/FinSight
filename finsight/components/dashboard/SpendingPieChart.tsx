'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CategorySummary } from '@/types'

type Props = { data: CategorySummary[] }

function CustomTooltip({ active, payload }: any) {
  if (active && payload?.length) {
    const item = payload[0].payload
    return (
      <div className="card px-3 py-2 text-sm shadow-xl">
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {item.icon} {item.name}
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          €{item.total.toFixed(2)} · {item.percentage}%
        </p>
      </div>
    )
  }
  return null
}

export default function SpendingPieChart({ data }: Props) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-medium mb-5" style={{ color: 'var(--text-secondary)' }}>
        DISTRIBUIÇÃO POR CATEGORIA
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%"
            innerRadius={65} outerRadius={100}
            paddingAngle={2} dataKey="total">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}