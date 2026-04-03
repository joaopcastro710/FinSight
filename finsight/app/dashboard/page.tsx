import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard 📊</h1>
        <p className="text-gray-500 mb-8">Bem-vindo, {user.email}</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <p className="text-gray-500 mb-4">
            Ainda não tens transações. Começa por importar o teu extrato bancário.
          </p>
          <Link
            href="/upload"
            className="inline-block py-2 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            📂 Importar CSV
          </Link>
        </div>

        <LogoutButton />
      </div>
    </div>
  )
}