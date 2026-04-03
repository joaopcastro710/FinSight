import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { categorize } from '@/lib/categorize'
import { parse } from 'csv-parse/sync'

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // 2. Ler o ficheiro do request
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro enviado' }, { status: 400 })
    }

    // 3. Validar que é um CSV
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'O ficheiro deve ser .csv' }, { status: 400 })
    }

    // 4. Ler o conteúdo do ficheiro como texto
    const text = await file.text()

    // 5. Parsear o CSV
    // O csv-parse lê o texto e devolve um array de objetos
    let records: Record<string, string>[]
    try {
      records = parse(text, {
        columns: true,        // primeira linha é o cabeçalho
        skip_empty_lines: true,
        trim: true,           // remove espaços em branco
        relax_column_count: true, // tolera linhas com colunas a mais ou a menos
      })
    } catch {
      return NextResponse.json(
        { error: 'Erro ao ler o CSV. Confirma que o ficheiro está bem formatado.' },
        { status: 400 }
      )
    }

    if (records.length === 0) {
      return NextResponse.json({ error: 'O ficheiro CSV está vazio' }, { status: 400 })
    }

    // 6. Detectar as colunas automaticamente
    // Bancos portugueses usam nomes de colunas diferentes — tentamos detectar
    const firstRecord = records[0]
    const columns = Object.keys(firstRecord).map(k => k.toLowerCase())

    const dateCol = Object.keys(firstRecord).find(k =>
      ['data', 'date', 'data mov', 'data movimento', 'data valor'].includes(k.toLowerCase())
    )
    const descCol = Object.keys(firstRecord).find(k =>
      ['descricao', 'descrição', 'description', 'movimento', 'designacao', 'designação'].includes(k.toLowerCase())
    )
    const amountCol = Object.keys(firstRecord).find(k =>
      ['valor', 'amount', 'montante', 'debito', 'débito', 'credito', 'crédito'].includes(k.toLowerCase())
    )

    // Se não detectou colunas, usa a primeira, segunda e terceira por ordem
    const colKeys = Object.keys(firstRecord)
    const finalDateCol = dateCol || colKeys[0]
    const finalDescCol = descCol || colKeys[1]
    const finalAmountCol = amountCol || colKeys[2]

    // 7. Transformar cada linha numa transação
    const transactions = records
      .map((record) => {
        const rawAmount = record[finalAmountCol] || '0'

        // Limpar o valor: remover €, espaços, e trocar vírgula por ponto
        const cleanAmount = rawAmount
          .replace(/[€$£\s]/g, '')
          .replace(',', '.')

        const amount = parseFloat(cleanAmount)

        // Ignorar linhas com valor inválido ou zero
        if (isNaN(amount) || amount === 0) return null

        const description = record[finalDescCol] || 'Sem descrição'
        const category = categorize(description)

        // Tentar parsear a data — aceitar vários formatos
        let date: string
        try {
          const rawDate = record[finalDateCol] || ''
          // Formatos comuns: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY
          const parts = rawDate.includes('/')
            ? rawDate.split('/')
            : rawDate.split('-')

          if (parts.length === 3) {
            // Se o primeiro elemento tem 4 dígitos, é YYYY-MM-DD
            if (parts[0].length === 4) {
              date = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
            } else {
              // DD/MM/YYYY → YYYY-MM-DD
              date = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
            }
          } else {
            date = new Date().toISOString().split('T')[0]
          }
        } catch {
          date = new Date().toISOString().split('T')[0]
        }

        return {
          user_id: user.id,
          date,
          description: description.trim(),
          amount: Math.abs(amount), // guardar sempre positivo
          category,
          source: file.name,
        }
      })
      .filter(Boolean) // remover as linhas nulas

    if (transactions.length === 0) {
      return NextResponse.json(
        { error: 'Não foi possível processar nenhuma transação do ficheiro.' },
        { status: 400 }
      )
    }

    // 8. Guardar no Supabase
    const { error: insertError } = await supabase
      .from('transactions')
      .insert(transactions)

    if (insertError) {
      console.error('Erro ao guardar:', insertError)
      return NextResponse.json({ error: 'Erro ao guardar as transações.' }, { status: 500 })
    }

    // 9. Devolver sucesso
    return NextResponse.json({
      success: true,
      count: transactions.length,
      message: `${transactions.length} transações importadas com sucesso!`
    })

  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}