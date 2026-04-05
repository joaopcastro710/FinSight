export default function SecurityPage() {
  const principles = [
    {
      icon: '🔒',
      title: 'Sem acesso bancário direto',
      desc: 'O FinSight nunca pede as tuas credenciais bancárias. Trabalhamos exclusivamente com ficheiros CSV que tu exportas voluntariamente do teu banco.',
    },
    {
      icon: '🔐',
      title: 'Encriptação em trânsito e em repouso',
      desc: 'Todos os dados são transmitidos via HTTPS/TLS. A base de dados está encriptada em repouso com AES-256, gerida pela infraestrutura Supabase.',
    },
    {
      icon: '👤',
      title: 'Isolamento total de dados',
      desc: 'Cada utilizador só tem acesso aos seus próprios dados. Utilizamos Row Level Security (RLS) no PostgreSQL — é impossível aceder a dados de outro utilizador.',
    },
    {
      icon: '🇪🇺',
      title: 'Conformidade com o RGPD',
      desc: 'Os teus dados estão alojados em servidores na Europa. Tens o direito de aceder, corrigir e apagar todos os teus dados a qualquer momento.',
    },
    {
      icon: '🗑️',
      title: 'Direito ao esquecimento',
      desc: 'Podes apagar a tua conta e todos os dados associados a qualquer momento, diretamente nas definições de perfil. A eliminação é imediata e permanente.',
    },
    {
      icon: '🔑',
      title: 'Autenticação segura',
      desc: 'Utilizamos autenticação gerida pelo Supabase Auth com passwords encriptadas via bcrypt. Nunca armazenamos passwords em texto simples.',
    },
  ]

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
          style={{ background: 'var(--accent-subtle)', color: 'var(--accent-text)', border: '1px solid var(--accent)40' }}>
          🛡️ Segurança & Privacidade
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Os teus dados são teus.
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Construímos o FinSight com segurança e privacidade como prioridade número um — não como uma funcionalidade adicional.
        </p>
      </div>

      {/* Princípios */}
      <div className="space-y-4 mb-16">
        {principles.map((p) => (
          <div key={p.title} className="card p-6 flex gap-4">
            <div className="text-2xl flex-shrink-0">{p.icon}</div>
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Infra */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Infraestrutura
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Base de dados', value: 'Supabase PostgreSQL', sub: 'Europa (West EU)' },
            { label: 'Hosting', value: 'Vercel Edge Network', sub: 'CDN global' },
            { label: 'AI Processing', value: 'Groq Cloud', sub: 'Dados não retidos' },
          ].map((item) => (
            <div key={item.label} className="card p-4">
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="card p-6 text-center"
        style={{ borderColor: 'var(--success)40', background: 'var(--success-subtle)' }}>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--success)' }}>
          ✅ Tens questões sobre privacidade ou segurança?
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Contacta-nos em <span style={{ color: 'var(--accent-text)' }}>seguranca@finsight.app</span>
        </p>
      </div>

    </main>
  )
}