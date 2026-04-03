export type Transaction = {
    id: string
    user_id: string 
    date: string
    description: string
    amount: number
    category: string
    source: string | null
    created_at : string
}

export type Category = {
    id: number
    name: string
    color: string
    icon: string
}

// Dados agregados por categoria para os gráficos

export type CategorySummary = {
    name: string
    total: number
    percentage: number
    color: string
    icon: string
    count: number
}

export type Profile = {
  id: string
  full_name: string | null
  nif: string | null
  currency: string
  avatar_url: string | null
  updated_at: string
}

export type Currency = {
  code: string
  symbol: string
  name: string
}

export const CURRENCIES: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dólar Americano' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
  { code: 'CHF', symbol: 'Fr', name: 'Franco Suíço' },
]