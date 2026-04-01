import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'


export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Se não há sessão, o middleware já redirecionou — mas é boa prática verificar aqui também
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard 📊</h1>
        <p className="text-gray-500 mb-8">Bem-vindo, {user.email}</p>
        
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-gray-500">
            O dashboard está em construção. Sprint 3 vai preencher isto! 🚧
          </p>
        </div>

        {/* Botão de logout temporário para testar */}
        <LogoutButton />
      </div>
    </div>
  )
}

// Componente client separado só para o botão de logout
// (precisa de ser 'use client' porque usa interatividade)