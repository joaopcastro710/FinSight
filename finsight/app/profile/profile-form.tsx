'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CURRENCIES, type Profile } from '@/types'
import type { User } from '@supabase/supabase-js'
import DeleteAccountModal from './delete-account-modal'

type Props = {
  user: User
  profile: Profile | null
}

export default function ProfileForm({ user, profile }: Props) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [nif, setNif] = useState(profile?.nif || '')
  const [currency, setCurrency] = useState(profile?.currency || 'EUR')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo e tamanho
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são aceites.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem não pode ter mais de 2MB.')
      return
    }

    setUploading(true)
    setError(null)

    // Nome do ficheiro: userId/avatar.extensão
    const ext = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setError('Erro ao fazer upload da imagem.')
      setUploading(false)
      return
    }

    // Obter URL pública
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    setAvatarUrl(data.publicUrl)
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)

    // Validar NIF português (9 dígitos) se preenchido
    if (nif && !/^\d{9}$/.test(nif)) {
      setError('O NIF deve ter 9 dígitos.')
      setSaving(false)
      return
    }

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName || null,
        nif: nif || null,
        currency,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      })

    if (upsertError) {
      setError('Erro ao guardar o perfil.')
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
    router.refresh()

    setTimeout(() => setSuccess(false), 3000)
  }

  const selectedCurrency = CURRENCIES.find(c => c.code === currency)

  return (
    <>
      <div className="space-y-5">

        {/* Avatar */}
        <div className="card p-6">
          <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
            FOTO DE PERFIL
          </h2>
          <div className="flex items-center gap-5">
            {/* Preview do avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden"
              style={{ background: 'var(--bg-elevated)', border: '2px solid var(--border)' }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar"
                  className="w-full h-full object-cover" />
              ) : (
                <span>{fullName ? fullName[0].toUpperCase() : '👤'}</span>
              )}
            </div>

            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                {uploading ? '⏳ A carregar...' : '📷 Alterar foto'}
              </button>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                JPG, PNG ou WebP · máximo 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Dados pessoais */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            DADOS PESSOAIS
          </h2>

          {/* Email — só leitura */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              EMAIL
            </label>
            <div className="input flex items-center gap-2 cursor-not-allowed opacity-60">
              <span>{user.email}</span>
              <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                não editável
              </span>
            </div>
          </div>

          {/* Nome completo */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              NOME COMPLETO
            </label>
            <input
              className="input"
              type="text"
              placeholder="O teu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* NIF */}
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              NIF
            </label>
            <input
              className="input"
              type="text"
              placeholder="123456789"
              maxLength={9}
              value={nif}
              onChange={(e) => setNif(e.target.value.replace(/\D/g, ''))}
            />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Apenas dígitos, 9 caracteres
            </p>
          </div>
        </div>

        {/* Preferências */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            PREFERÊNCIAS
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              MOEDA
            </label>
            <select
              className="input"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                  {c.symbol} — {c.name} ({c.code})
                </option>
              ))}
            </select>
            {selectedCurrency && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Os valores serão apresentados em {selectedCurrency.symbol}
              </p>
            )}
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="p-3 rounded-lg text-sm"
            style={{ background: 'var(--error-subtle)', color: 'var(--error)', border: '1px solid #EF444430' }}>
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg text-sm"
            style={{ background: 'var(--success-subtle)', color: 'var(--success)', border: '1px solid #10B98130' }}>
            ✅ Perfil guardado com sucesso!
          </div>
        )}

        {/* Botão guardar */}
        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center py-2.5">
          {saving ? '⏳ A guardar...' : '💾 Guardar Alterações'}
        </button>

        {/* Zona de perigo */}
        <div className="card p-6"
          style={{ borderColor: '#EF444430' }}>
          <h2 className="text-sm font-medium mb-1" style={{ color: 'var(--error)' }}>
            ZONA DE PERIGO
          </h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Apagar a conta remove permanentemente todos os teus dados — transações, insights e perfil. Esta ação não pode ser revertida.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-xs py-1.5 px-3 rounded-lg transition-colors font-medium"
            style={{
              background: 'var(--error-subtle)',
              color: 'var(--error)',
              border: '1px solid #EF444430'
            }}
          >
            🗑️ Apagar Conta
          </button>
        </div>

      </div>

      {/* Modal de confirmação */}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          userId={user.id}
        />
      )}
    </>
  )
}