'use client'

import { useState, useEffect } from 'react'
import { Transaction } from '@/types'

type Props = {
  userId: string
  transactions: Transaction[]
}

export default function InsightCard({ userId, transactions }: Props) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const currentMonth = new Date().toISOString().substring(0, 7)
  const monthLabel = new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })

  // Ao carregar, verifica se já existe um insight guardado para este mês
  useEffect(() => {
    async function loadExisting() {
      const res = await fetch('/api/insights')
      const data = await res.json()
      if (data.insight) setInsight(data.insight)
      setFetched(true)
    }
    loadExisting()
  }, [])

  async function generateInsight() {
    setLoading(true)

    // Calcular dados agregados para enviar ao servidor
    const grouped: Record<string, { total: number; count: number }> = {}
    for (const t of transactions) {
      if (!grouped[t.category]) grouped[t.category] = { total: 0, count: 0 }
      grouped[t.category].total += t.amount
      grouped[t.category].count += 1
    }
    const total = transactions.reduce((sum, t) => sum + t.amount, 0)
    const grandTotal = total
    const categorySummary = Object.entries(grouped)
      .map(([name, { total, count }]) => ({
        name,
        total: Math.round(total * 100) / 100,
        percentage: Math.round((total / grandTotal) * 100),
        count,
      }))
      .sort((a, b) => b.total - a.total)

    const res = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categorySummary, total, month: monthLabel }),
    })

    const data = await res.json()
    if (data.insight) setInsight(data.insight)
    setLoading(false)
  }

  // Formatar o texto em linhas separadas
  function formatInsight(text: string) {
    return text.split('\n').filter(line => line.trim())
  }

  if (!fetched) return null

  return (
    <div className="card p-6"
      style={{ borderLeft: '3px solid var(--accent)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            ✨ AI INSIGHTS
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {monthLabel}
          </p>
        </div>
        <button
          onClick={generateInsight}
          disabled={loading}
          className="btn-secondary text-xs py-1.5 px-3"
        >
          {loading ? '⏳ A gerar...' : insight ? '↻ Atualizar' : '✨ Gerar Insights'}
        </button>
      </div>

      {!insight && !loading && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Clica em "Gerar Insights" para receberes uma análise inteligente dos teus gastos deste mês.
        </p>
      )}

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 rounded animate-pulse"
              style={{ background: 'var(--bg-elevated)', width: `${70 + i * 8}%` }} />
          ))}
        </div>
      )}

      {insight && !loading && (
        <div className="space-y-3">
          {formatInsight(insight).map((line, i) => (
            <p key={i} className="text-sm leading-relaxed"
              style={{ color: line.match(/^[1-3]\./) ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}