import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
const Groq = require('groq-sdk')

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { categorySummary, total, month } = await request.json()

    const categoryText = categorySummary
      .slice(0, 6)
      .map((c: any) => `- ${c.name}: €${c.total.toFixed(2)} (${c.percentage}%)`)
      .join('\n')

    const prompt = `
Es um assistente financeiro pessoal em portugues de Portugal. Responde sempre em portugues.
Analisa os seguintes dados de despesas do mes de ${month}:

Total gasto: €${total.toFixed(2)}
Despesas por categoria:
${categoryText}

Escreve exatamente 3 insights curtos e praticos. Cada insight deve ter no maximo 2 frases.
Formato da resposta — usa exatamente este formato:
1. [insight sobre onde se gasta mais]
2. [sugestao de poupanca concreta com valor especifico]
3. [padrao interessante ou comparacao]

Se direto, usa numeros concretos e se util. Sem introducao nem conclusao.
`

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
    })

    const insightText = response.choices[0].message.content || ''

    await supabase.from('insights').upsert({
      user_id: user.id,
      content: insightText,
      month,
    }, { onConflict: 'user_id,month' })

    return NextResponse.json({ insight: insightText })

  } catch (error: any) {
    console.error('Erro nos insights:', error)
    return NextResponse.json({
      error: 'Erro ao gerar insights.',
      detail: error?.message || String(error)
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const currentMonth = new Date().toISOString().substring(0, 7)

    const { data } = await supabase
      .from('insights')
      .select('content')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .single()

    return NextResponse.json({ insight: data?.content || null })
  } catch {
    return NextResponse.json({ insight: null })
  }
}