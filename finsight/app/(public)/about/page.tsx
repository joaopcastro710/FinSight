export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
          style={{ background: 'var(--accent-subtle)', color: 'var(--accent-text)', border: '1px solid var(--accent)40' }}>
          Sobre o FinSight
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          As tuas finanças,<br />finalmente claras.
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          O FinSight nasceu de uma frustração simples: perceber para onde vai o dinheiro ao fim do mês devia ser fácil, não um trabalho de horas em Excel.
        </p>
      </div>

      {/* Problema */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          O problema que resolvemos
        </h2>
        <div className="card p-6 space-y-3">
          {[
            'Os extratos bancários são ficheiros confusos, cheios de referências incompreensíveis.',
            'As apps de finanças pedem acesso direto à tua conta bancária — o que levanta sérias questões de privacidade.',
            'As ferramentas existentes são demasiado complexas para uso do dia-a-dia.',
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-sm mt-0.5" style={{ color: 'var(--error)' }}>✕</span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solução */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          A nossa abordagem
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '📂',
              title: 'Só CSV',
              desc: 'Nunca pedimos acesso à tua conta. Tu controlas o que partilhas.',
            },
            {
              icon: '🤖',
              title: 'AI útil',
              desc: 'Categorização automática e insights em linguagem natural, sem trabalho manual.',
            },
            {
              icon: '📊',
              title: 'Visibilidade total',
              desc: 'Dashboards e reports que transformam dados brutos em decisões inteligentes.',
            },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Missão */}
      <section className="mb-12">
        <div className="card p-8 text-center"
          style={{ borderColor: 'var(--accent)40', background: 'var(--accent-subtle)' }}>
          <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            "A nossa missão é dar a qualquer pessoa uma visão clara das suas finanças — sem complexidade, sem riscos, sem custo."
          </p>
        </div>
      </section>

      {/* Stack técnica — interessante para portfólio */}
      <section>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Construído com tecnologia moderna
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Next.js 14', desc: 'Frontend & API' },
            { name: 'Supabase', desc: 'Base de dados' },
            { name: 'TypeScript', desc: 'Tipagem segura' },
            { name: 'Groq AI', desc: 'Insights inteligentes' },
          ].map((tech) => (
            <div key={tech.name} className="card p-4 text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {tech.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}