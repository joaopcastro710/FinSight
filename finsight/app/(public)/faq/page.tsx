'use client'

import { useState } from 'react'

const FAQS = [
  {
    category: 'Geral',
    questions: [
      {
        q: 'O que é o FinSight?',
        a: 'O FinSight é uma aplicação web que analisa os teus extratos bancários em CSV e transforma-os em dashboards visuais e insights gerados por Inteligência Artificial. O objetivo é dar-te clareza total sobre os teus padrões de consumo.',
      },
      {
        q: 'É gratuito?',
        a: 'Sim. O plano gratuito inclui todas as funcionalidades essenciais: upload de CSV, categorização automática, dashboards e AI insights. O plano Pro (em breve) adiciona funcionalidades avançadas como exportação de relatórios e múltiplas contas.',
      },
      {
        q: 'Quais bancos são suportados?',
        a: 'Qualquer banco que permita exportar o extrato em formato CSV. O FinSight deteta automaticamente os formatos dos bancos portugueses mais comuns: CGD, BPI, Millennium BCP, Santander, Novo Banco e outros.',
      },
    ],
  },
  {
    category: 'Privacidade & Segurança',
    questions: [
      {
        q: 'Precisam de acesso à minha conta bancária?',
        a: 'Não. O FinSight funciona exclusivamente com ficheiros CSV que tu exportas manualmente do teu banco. Nunca pedimos credenciais bancárias nem ligamos diretamente às tuas contas.',
      },
      {
        q: 'Os meus dados estão seguros?',
        a: 'Sim. Os dados são encriptados em trânsito (HTTPS) e em repouso (AES-256). Cada utilizador tem acesso exclusivo aos seus próprios dados — é impossível aceder a dados de outro utilizador graças ao Row Level Security.',
      },
      {
        q: 'Posso apagar os meus dados?',
        a: 'Sim, a qualquer momento. Nas definições de Perfil existe a opção "Apagar Conta" que remove permanentemente todos os teus dados — transações, insights e informações pessoais. A eliminação é imediata e irreversível.',
      },
    ],
  },
  {
    category: 'Utilização',
    questions: [
      {
        q: 'Como faço upload do meu extrato?',
        a: 'Faz login, vai à página "Importar CSV", arrasta o ficheiro para a zona de upload ou clica para o selecionar. O FinSight processa automaticamente o ficheiro e redireciona-te para o dashboard com os dados.',
      },
      {
        q: 'A categorização automática é precisa?',
        a: 'Para a maioria dos comerciantes portugueses comuns, sim. O sistema usa correspondência por palavras-chave (ex: "Continente" → Alimentação). Podes sempre corrigir manualmente qualquer categoria na página de Transações.',
      },
      {
        q: 'Com que frequência devo fazer upload?',
        a: 'Recomendamos uma vez por mês, quando recebes o extrato mensal. Podes fazer múltiplos uploads — o FinSight acumula todas as transações e apresenta a evolução ao longo do tempo.',
      },
    ],
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:opacity-80"
      >
        <span className="text-sm font-medium pr-4" style={{ color: 'var(--text-primary)' }}>
          {question}
        </span>
        <span className="text-sm flex-shrink-0 transition-transform"
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>
          ↓
        </span>
      </button>

      {open && (
        <div className="px-5 pb-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm leading-relaxed pt-4" style={{ color: 'var(--text-secondary)' }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Perguntas Frequentes
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Não encontras a resposta? Envia-nos um email.
        </p>
      </div>

      {/* FAQs por categoria */}
      <div className="space-y-10">
        {FAQS.map((section) => (
          <div key={section.category}>
            <h2 className="text-xs font-medium mb-3 px-1"
              style={{ color: 'var(--text-muted)' }}>
              {section.category.toUpperCase()}
            </h2>
            <div className="space-y-2">
              {section.questions.map((item) => (
                <FAQItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

    </main>
  )
}