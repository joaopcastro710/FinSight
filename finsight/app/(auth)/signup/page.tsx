'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSignup() {
    setLoading(true)
    setError(null)
    if (password !== confirmPassword) {
      setError('As passwords não coincidem.')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'var(--bg-base)' }}>
        <div className="card p-8 text-center max-w-sm w-full">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Conta criada!
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Já podes entrar na tua conta.
          </p>
          <Link href="/login" className="btn-primary justify-center w-full py-2.5">
            Ir para o Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ background: 'var(--accent)', boxShadow: '0 0 24px #1E40AF40' }}>
            <span className="text-xl">💡</span>
          </div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            FinSight
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Cria a tua conta gratuita
          </p>
        </div>

        <div className="card p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm"
              style={{ background: 'var(--error-subtle)', color: 'var(--error)', border: '1px solid #EF444430' }}>
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>EMAIL</label>
            <input className="input" type="email" placeholder="o@teu.email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>PASSWORD</label>
            <input className="input" type="password" placeholder="Mínimo 6 caracteres"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>CONFIRMAR PASSWORD</label>
            <input className="input" type="password" placeholder="Repete a password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignup()} />
          </div>

          <button onClick={handleSignup} disabled={loading}
            className="btn-primary w-full justify-center py-2.5">
            {loading ? 'A criar...' : 'Criar Conta'}
          </button>
        </div>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          Já tens conta?{' '}
          <Link href="/login" style={{ color: 'var(--accent-text)' }} className="hover:underline font-medium">
            Entra aqui
          </Link>
        </p>
      </div>
    </div>
  )
}