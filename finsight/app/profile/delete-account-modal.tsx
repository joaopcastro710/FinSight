'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  onClose: () => void
  userId: string
}

export default function DeleteAccountModal({ onClose, userId }: Props) {
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (confirm !== 'APAGAR') return
    setLoading(true)
    setError(null)

    // Apagar todos os dados do utilizador
    // As tabelas com ON DELETE CASCADE tratam do resto
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      setError('Erro ao apagar os dados.')
      setLoading(false)
      return
    }

    // Fazer logout
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}>

      {/* Modal — stopPropagation para não fechar ao clicar dentro */}
      <div className="card p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}>

        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--error)' }}>
          Apagar Conta
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Esta ação é <strong>permanente e irreversível</strong>. Todos os teus dados serão apagados.
        </p>
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          Para confirmar, escreve <strong style={{ color: 'var(--text-primary)' }}>APAGAR</strong> abaixo:
        </p>

        <input
          className="input mb-4"
          type="text"
          placeholder="APAGAR"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && (
          <p className="text-sm mb-3" style={{ color: 'var(--error)' }}>{error}</p>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center py-2">
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={confirm !== 'APAGAR' || loading}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: confirm === 'APAGAR' ? 'var(--error)' : 'var(--bg-elevated)',
              color: confirm === 'APAGAR' ? 'white' : 'var(--text-muted)',
              cursor: confirm === 'APAGAR' ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? '⏳ A apagar...' : '🗑️ Apagar Tudo'}
          </button>
        </div>
      </div>
    </div>
  )
}