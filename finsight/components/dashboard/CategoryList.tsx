import { CategorySummary } from '@/types'

type Props = {
  data: CategorySummary[]
}

export default function CategoryList({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Resumo por Categoria
      </h2>
      <div className="space-y-3">
        {data.map((cat) => (
          <div key={cat.name} className="flex items-center gap-3">
            {/* Ícone com cor de fundo */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ backgroundColor: cat.color + '20' }} // cor com 20% opacidade
            >
              {cat.icon}
            </div>

            {/* Nome e barra de progresso */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {cat.name}
                </span>
                <span className="text-sm font-semibold text-gray-800 ml-2">
                  €{cat.total.toFixed(2)}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>

            {/* Percentagem */}
            <span className="text-xs text-gray-400 w-10 text-right flex-shrink-0">
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}