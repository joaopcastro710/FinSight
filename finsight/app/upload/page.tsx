'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Quando o utilizador arrasta um ficheiro para cima da zona
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault() // necessário para permitir o drop
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  // Quando o utilizador larga o ficheiro na zona
  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) validateAndSetFile(droppedFile)
  }

  // Quando o utilizador clica e escolhe ficheiro manualmente
  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) validateAndSetFile(selectedFile)
  }

  function validateAndSetFile(f: File) {
    setError(null)
    if (!f.name.endsWith('.csv')) {
      setError('Apenas ficheiros .csv são aceites.')
      return
    }
    if (f.size > 5 * 1024 * 1024) { // 5MB
      setError('O ficheiro não pode ter mais de 5MB.')
      return
    }
    setFile(f)
  }

  async function handleUpload() {
    if (!file) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    // FormData é a forma standard de enviar ficheiros via HTTP
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/csv', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao processar o ficheiro.')
        setLoading(false)
        return
      }

      setSuccess(data.message)

      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => router.push('/dashboard'), 2000)

    } catch {
      setError('Erro de ligação. Verifica a tua internet.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Importar Extrato</h1>
          <p className="text-gray-500 mt-1">
            Faz upload do teu extrato bancário em formato CSV
          </p>
        </div>

        {/* Zona de drag & drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors
            ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
          />

          {file ? (
            // Ficheiro selecionado
            <div>
              <div className="text-4xl mb-3">📄</div>
              <p className="font-semibold text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(file.size / 1024).toFixed(1)} KB — Clica para mudar
              </p>
            </div>
          ) : (
            // Estado inicial
            <div>
              <div className="text-4xl mb-3">📂</div>
              <p className="font-semibold text-gray-700">
                Arrasta o ficheiro CSV aqui
              </p>
              <p className="text-sm text-gray-400 mt-1">
                ou clica para escolher — máximo 5MB
              </p>
            </div>
          )}
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Mensagem de sucesso */}
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            ✅ {success} A redirecionar para o dashboard...
          </div>
        )}

        {/* Botão de upload */}
        {file && !success && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '⏳ A processar...' : '🚀 Importar Transações'}
          </button>
        )}

        {/* Ajuda sobre formato */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm font-medium text-blue-800 mb-2">
            💡 Formato esperado do CSV
          </p>
          <p className="text-sm text-blue-600">
            O ficheiro deve ter colunas de <strong>data</strong>, <strong>descrição</strong> e <strong>valor</strong>.
            O FinSight detecta automaticamente os nomes das colunas dos bancos portugueses mais comuns (CGD, BPI, Millennium, Santander, etc.).
          </p>
        </div>

      </div>
    </div>
  )
}