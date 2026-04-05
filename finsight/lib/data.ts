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

// Dados completos para a página de Reports
export async function getReportsData() {
  const transactions = await getTransactions()

  if (transactions.length === 0) {
    return {
      transactions: [],
      monthlyData: [],
      categoryTrends: [],
      topMonths: [],
      averageMonthly: 0,
    }
  }

  // ── Totais por mês ──────────────────────────────────────────
  const monthlyMap: Record<string, { total: number; count: number }> = {}

  for (const t of transactions) {
    const month = t.date.substring(0, 7)
    if (!monthlyMap[month]) monthlyMap[month] = { total: 0, count: 0 }
    monthlyMap[month].total += t.amount
    monthlyMap[month].count += 1
  }

  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { total, count }]) => ({
      month: new Date(month + '-01').toLocaleDateString('pt-PT', {
        month: 'short',
        year: 'numeric',
      }),
      monthKey: month,
      total: Math.round(total * 100) / 100,
      count,
    }))

  // ── Média mensal ────────────────────────────────────────────
  const averageMonthly = monthlyData.length > 0
    ? monthlyData.reduce((sum, m) => sum + m.total, 0) / monthlyData.length
    : 0

  // ── Tendências por categoria por mês ────────────────────────
  // Estrutura: { category: { month: total } }
  const catMonthMap: Record<string, Record<string, number>> = {}

  for (const t of transactions) {
    const month = t.date.substring(0, 7)
    if (!catMonthMap[t.category]) catMonthMap[t.category] = {}
    catMonthMap[t.category][month] = (catMonthMap[t.category][month] || 0) + t.amount
  }

  // Top 5 categorias por total gasto
  const topCategories = Object.entries(catMonthMap)
    .map(([name, months]) => ({
      name,
      total: Object.values(months).reduce((s, v) => s + v, 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(c => c.name)

  // Construir dados para gráfico de barras agrupado por mês
  const allMonths = Object.keys(monthlyMap).sort()
  const categoryTrends = allMonths.map(month => {
    const point: Record<string, any> = {
      month: new Date(month + '-01').toLocaleDateString('pt-PT', {
        month: 'short',
        year: 'numeric',
      }),
    }
    for (const cat of topCategories) {
      point[cat] = Math.round((catMonthMap[cat]?.[month] || 0) * 100) / 100
    }
    return point
  })

  // ── Top meses ───────────────────────────────────────────────
  const topMonths = [...monthlyData]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)

  return {
    transactions,
    monthlyData,
    categoryTrends,
    topCategories,
    topMonths,
    averageMonthly: Math.round(averageMonthly * 100) / 100,
  }
}