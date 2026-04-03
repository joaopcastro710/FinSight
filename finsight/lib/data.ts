import { createClient } from '@/lib/supabase/server'
import { CategorySummary, Transaction } from '@/types'

// Buscar todas as transações do utilizador autenticado
export async function getTransactions(): Promise<Transaction[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Erro ao buscar transações:', error)
    return []
  }

  return data || []
}

// Calcular resumo por categoria para os gráficos
export async function getCategorySummary(): Promise<CategorySummary[]> {
  const transactions = await getTransactions()

  if (transactions.length === 0) return []

  // Mapa de cores por categoria (igual ao que usámos no seed)
  const CATEGORY_META: Record<string, { color: string; icon: string }> = {
    'Alimentação':    { color: '#16A34A', icon: '🛒' },
    'Transportes':    { color: '#2563EB', icon: '🚗' },
    'Lazer':          { color: '#9333EA', icon: '🎮' },
    'Saúde':          { color: '#DC2626', icon: '💊' },
    'Habitação':      { color: '#D97706', icon: '🏠' },
    'Subscrições':    { color: '#0891B2', icon: '📱' },
    'Restaurantes':   { color: '#EA580C', icon: '🍽️' },
    'Compras Online': { color: '#DB2777', icon: '📦' },
    'Educação':       { color: '#4F46E5', icon: '📚' },
    'Outros':         { color: '#6B7280', icon: '💳' },
  }

  // Agrupar transações por categoria
  const grouped: Record<string, { total: number; count: number }> = {}

  for (const t of transactions) {
    if (!grouped[t.category]) {
      grouped[t.category] = { total: 0, count: 0 }
    }
    grouped[t.category].total += t.amount
    grouped[t.category].count += 1
  }

  const grandTotal = Object.values(grouped).reduce((sum, g) => sum + g.total, 0)

  // Converter para array e calcular percentagens
  return Object.entries(grouped)
    .map(([name, { total, count }]) => ({
      name,
      total: Math.round(total * 100) / 100,
      percentage: Math.round((total / grandTotal) * 100),
      color: CATEGORY_META[name]?.color || '#6B7280',
      icon: CATEGORY_META[name]?.icon || '💳',
      count,
    }))
    .sort((a, b) => b.total - a.total) // ordenar do maior para o menor
}

// Calcular dados para o gráfico de linha (gastos por mês)
export async function getMonthlyTotals() {
  const transactions = await getTransactions()

  const monthly: Record<string, number> = {}

  for (const t of transactions) {
    // Extrair YYYY-MM da data
    const month = t.date.substring(0, 7)
    monthly[month] = (monthly[month] || 0) + t.amount
  }

  // Converter para array ordenado por data
  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      // Formatar para "Abr 2026"
      month: new Date(month + '-01').toLocaleDateString('pt-PT', {
        month: 'short',
        year: 'numeric',
      }),
      total: Math.round(total * 100) / 100,
    }))
}

import type { Profile } from '@/types'

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }

  return data
}