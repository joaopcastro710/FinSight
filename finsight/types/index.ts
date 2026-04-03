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