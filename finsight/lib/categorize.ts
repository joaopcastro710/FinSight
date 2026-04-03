// Mapa de palavras-chave → categoria
// Podes adicionar mais regras à vontade!
const RULES: { keywords: string[]; category: string }[] = [
  {
    category: 'Alimentação',
    keywords: ['continente', 'pingo doce', 'lidl', 'aldi', 'minipreço', 'mercadona', 'supermercado', 'mercearia', 'intermarche', 'el corte ingles alimentar'],
  },
  {
    category: 'Restaurantes',
    keywords: ['mcdonald', 'burger king', 'kfc', 'subway', 'pizza', 'restaurante', 'cafe', 'snack bar', 'pastelaria', 'padaria', 'nando', 'sushi', 'uber eats', 'glovo', 'bolt food'],
  },
  {
    category: 'Transportes',
    keywords: ['galp', 'bp', 'repsol', 'shell', 'combustivel', 'cp comboios', 'metro', 'uber', 'bolt', 'cabify', 'autoestrada', 'portagem', 'via verde'],
  },
  {
    category: 'Subscrições',
    keywords: ['netflix', 'spotify', 'youtube', 'amazon prime', 'apple', 'google', 'microsoft', 'adobe', 'hbo', 'disney', 'nos', 'meo', 'vodafone', 'altice'],
  },
  {
    category: 'Saúde',
    keywords: ['farmacia', 'clinica', 'hospital', 'medico', 'dentista', 'optika', 'wells', 'dr. consultas'],
  },
  {
    category: 'Habitação',
    keywords: ['renda', 'condominio', 'seguro', 'egp', 'edp', 'aguas', 'gas natural', 'endesa'],
  },
  {
    category: 'Compras Online',
    keywords: ['amazon', 'ebay', 'aliexpress', 'zara', 'h&m', 'shein', 'fnac', 'worten', 'mediamarkt'],
  },
  {
    category: 'Educação',
    keywords: ['universidade', 'faculdade', 'escola', 'explicador', 'udemy', 'coursera', 'livro'],
  },
  {
    category: 'Lazer',
    keywords: ['cinema', 'teatro', 'museu', 'bilhete', 'sport', 'ginasio', 'fitness', 'holmes place'],
  },
]

export function categorize(description: string): string {
  // Normalizar: minúsculas e sem acentos para comparação mais robusta
  const normalized = description
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  for (const rule of RULES) {
    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword)) {
        return rule.category
      }
    }
  }

  return 'Outros'
}