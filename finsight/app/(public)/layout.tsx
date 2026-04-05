import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Navbar pública */}
      <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
        className="sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'var(--accent)' }}>
              💡
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              FinSight
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}>
              Sobre
            </Link>
            <Link href="/security" className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}>
              Segurança
            </Link>
            <Link href="/faq" className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}>
              FAQ
            </Link>
            <Link href="/login" className="btn-primary text-xs py-1.5 px-3">
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      {children}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)' }} className="mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
              style={{ background: 'var(--accent)' }}>
              💡
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              FinSight
            </span>
          </div>
          <div className="flex items-center gap-6">
            {[
              { href: '/about', label: 'Sobre' },
              { href: '/security', label: 'Segurança' },
              { href: '/faq', label: 'FAQ' },
            ].map(link => (
              <Link key={link.href} href={link.href}
                className="text-xs hover:opacity-80 transition-opacity"
                style={{ color: 'var(--text-muted)' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 FinSight
          </p>
        </div>
      </footer>
    </div>
  )
}