'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }
  function handleDragLeave() { setIsDragging(false) }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) validateAndSetFile(f)
  }
  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) validateAndSetFile(f)
  }
  function validateAndSetFile(f: File) {
    setError(null)
    if (!f.name.endsWith('.csv')) { setError('Apenas ficheiros .csv são aceites.'); return }
    if (f.size > 5 * 1024 * 1024) { setError('Máximo 5MB.'); return }
    setFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/csv', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      setSuccess(data.message)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch {
      setError('Erro de ligação.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* Navbar simples */}
      <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
        className="sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="text-sm" style={{ color: 'var(--text-muted)' }}>
            ← Dashboard
          </Link>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Importar CSV
          </span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Importar Extrato
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Faz upload do teu extrato bancário em formato CSV
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="card cursor-pointer transition-all p-12 text-center"
          style={{
            borderStyle: 'dashed',
            borderColor: isDragging ? 'var(--accent-hover)'
              : file ? 'var(--success)'
              : 'var(--border)',
            background: isDragging ? 'var(--accent-subtle)'
              : file ? 'var(--success-subtle)'
              : 'var(--bg-surface)',
          }}
        >
          <input ref={fileInputRef} type="file" accept=".csv"
            onChange={handleFileInput} className="hidden" />
          {file ? (
            <div>
              <div className="text-3xl mb-2">📄</div>
              <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                {file.name}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {(file.size / 1024).toFixed(1)} KB · Clica para mudar
              </p>
            </div>
          ) : (
            <div>
              <div className="text-3xl mb-2">📂</div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Arrasta o ficheiro CSV aqui
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                ou clica para escolher · máximo 5MB
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg text-sm"
            style={{ background: 'var(--error-subtle)', color: 'var(--error)', border: '1px solid #EF444430' }}>
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg text-sm"
            style={{ background: 'var(--success-subtle)', color: 'var(--success)', border: '1px solid #10B98130' }}>
            ✅ {success} A redirecionar...
          </div>
        )}

        {file && !success && (
          <button onClick={handleUpload} disabled={loading}
            className="btn-primary w-full justify-center py-2.5">
            {loading ? '⏳ A processar...' : '🚀 Importar Transações'}
          </button>
        )}

        {/* Info */}
        <div className="card p-4"
          style={{ background: 'var(--accent-subtle)', borderColor: 'var(--accent)' + '40' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent-text)' }}>
            💡 Formato esperado
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            O ficheiro deve ter colunas de data, descrição e valor. O FinSight detecta automaticamente os formatos dos bancos portugueses mais comuns.
          </p>
        </div>
      </main>
    </div>
  )
}