import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Se estiver autenticado vai para o dashboard
  // Se não estiver vai para o about
  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/about')
  }
}