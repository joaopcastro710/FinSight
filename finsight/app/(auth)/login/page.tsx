'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou password incorretos.')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-base)' }}>

      {/* Card central */}
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ background: 'var(--accent)', boxShadow: '0 0 24px #1E40AF40' }}>
            <span className="text-xl">💡</span>
          </div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            FinSight
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Entra na tua conta
          </p>
        </div>

        {/* Form card */}
        <div className="card p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm"
              style={{ background: 'var(--error-subtle)', color: 'var(--error)', border: '1px solid #EF444430' }}>
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              EMAIL
            </label>
            <input
              className="input"
              type="email"
              placeholder="o@teu.email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              PASSWORD
            </label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full justify-center py-2.5"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </div>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          Não tens conta?{' '}
          <Link href="/signup" style={{ color: 'var(--accent-text)' }}
            className="hover:underline font-medium">
            Cria uma aqui
          </Link>
        </p>
      </div>
    </div>
  )
}