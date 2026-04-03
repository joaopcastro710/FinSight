import { CategorySummary } from '@/types'

type Props = { data: CategorySummary[] }

export default function CategoryList({ data }: Props) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-medium mb-5" style={{ color: 'var(--text-secondary)' }}>
        RESUMO POR CATEGORIA
      </h2>
      <div className="space-y-4">
        {data.map((cat) => (
          <div key={cat.name} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: cat.color + '20' }}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {cat.name}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  €{cat.total.toFixed(2)}
                </span>
              </div>
              <div className="h-1 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${cat.percentage}%`, background: cat.color }} />
              </div>
            </div>
            <span className="text-xs w-8 text-right flex-shrink-0"
              style={{ color: 'var(--text-muted)' }}>
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}