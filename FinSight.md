# FinSight

> O FinSight é uma aplicação web que eprmite ao utilizador fazer upload do seu extrato bancário em formato CSV, e em segundos receber dashboards visuais com as suas despesas categorizadas automaticamente e insights gerados por IA - como se tivesse um consultor financeiro pessoal.

```
Com o FinSight:

- Upload do CSV em segundos, sem configurações
- Categorização automática das transações 
- Dashboard visual com gráficos de despesas
- Insights gerados por IA: "Gastaste 23% mais em restaurantes este mês"
- Sem necessidade de login bancário - apenas o ficheiro CSV
```

## Stack Tecnológica

- **Frontend** : Next.js + TypeScript + Tailwind CSS
- **Backend** : Node.js + Express (API Rputes do Next.js)
- **Database** : PostgreSQL via Supabase
- **Auth** : Supabase Auth
- **AI** : Anthropic Claude API (ou OpenAI)
- **Deploy** : Vercel (frontend) + Railway (backend opcional)
- **Controlo** : Git + GitHub

## Arquitetura

### Estrutura de Pastas

```
finsight/
|- app/                 <- Next.js App Router (páginas e layouts)
|   |-(auth)/           <- Grupo de rotas: login, singup
|   |-dashboard/        <- Dashboard principal (protegido)~
|   |-upload/           <- Página de upload de CSV
|   |-api/              <- API Routes (backend Node.js)
|       |- csv/         <- Endpoint para processar CSV
|       |- insights/    <- Endpoint para chamar AI
|       |-transactions/ <- CRUD de transações
|- components/          <- Componentes React reutilizáveis
|   |-ui/               <- Botões, inputs, cards (design system)
|   |-charts/           <- Gráficos (Recharts)
|   |-layout/           <- Navbar, Sidebar, Footer
|- lib/                 <- Utilizadores: supabase client, ai client
|- types/               <- TypeScript types e interfaces
|- hooks/               <- Custom Reach hooks
|- public/              <- Assets estáticos
|- supabase/            <- Migrations SQL e seed data
```

### Fluxo de Dados

Como os dados fluem na aplicação:
1. Utilizador faz login via Supabase Auth (email + passoword)
2. Utilizador faz upload de ficheiro CSV na página /upload
3. API Route /api/csv processa o ficheiro: lê linhas, limpa dados, categoriza
4. Transações categorizadas são guardadas no PostgreSQL (Supabase)
5. Dashboard faz fetch das transações e renderiza gráficos
6. Utilizador pede insights -> API Route /api/insights chama Claude/OpenAI
7. Resposta AI é apresentada como card de recomendação no dashboard

### Modelo de Dados Simplificado 

| Tabela  | Campos Principais | Relação |
| ------------- | ------------- | ------------- |
| users  | id, email,name,created_at  | Supabase Auth (automático) |
| transactions | id, user_id, date, description, amount, category, source| Pertence a user |
| categories | id, name, color, icon | Referenciada por transactions |
| insights | id, user_id, content, generated_at | Pertence a user | 


Password Supabase: $YV3r8D*-*C_gn+


# Flow

## Sprint 1 - Setup & Autenticação 

1. Ter todas as ferramentas instaladas
2. Criar o projeto:
    - correr o comando `npx create-next-app@latest finsight`
    - entrar na pasta e instalar as dependências necessárias:
        - `npm install @supabase/supabase-js @supabase/ssr`
        - `npm install csv-parse recharts`
        - `npm install @google/generative-ai`
    - iniciar o servidor com `npm run dev`
3. Configurar o Supabase: o supabase vai funcionar como uma base de dados PostgreSQL com um painel visual, autenticação pronta a usar, e uma API gerada automaticamente. Em vez de construir um sistema de login do zero, o SUpabase trata disso.
    - 1. Criar conta no supabase.com
    - 2. New Project com o nome do projeto, uma password forte e pront
    - 3. Procurar as credenciais na API: Project URL e public key
    - 4. Na base do projeto, cria um ficheiro chamado `.env.local` e coloca:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. AUTH-01 a AUTH-05
O Next.js com App Router tem dois "mundos" separados:
- Server Components - correm no servidor, não têm acesso a estado do browser
- Client Components - correm no browser, têm interatividade (useState, eventos, etc)
Para o Supabase funcionar bem nos dois mundos, vais criar dois clients diferentes. Por isso é que instalamos `@supabase/ssr`.
1. Criar a pasta `lib/supabase/` com os dois ficheiros:

`lib/supabase/client.ts`
```
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

`lib/supabase/server.ts`

```
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies só podem ser escritos em middleware
          }
        },
      },
    }
  )
}
```

E porquê dois ficheiros? O cliente do browser usa cookies do browser. O cliente do servidor lê e escreve cookies via Next.js. Se usasses o cliente errado no lugar errado, a sessão do utilizador não seria reconhecida. 

2. Criar o Middleware. O middleware é um ficheiro especial do Next.js que corre antes de qualquer página carregar. Vamos usá-lo para duas coisas: renovar a sessão do utilizador automáticamente, e redirecionar para login se alguém tentar aceder ao dashboard sem estar autenticado.

```
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Renovar a sessão — IMPORTANTE: não remover esta linha
  const { data: { user } } = await supabase.auth.getUser()

  // Se o utilizador não está autenticado e tenta aceder a rotas protegidas
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Se o utilizador já está autenticado e tenta aceder ao login/signup
  if (
    user &&
    (request.nextUrl.pathname === '/login' ||
     request.nextUrl.pathname === '/signup')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

3. Criar as Páginas de Login e Signup (AUTH-01 e AUTH-02)
    - 1. Apagar o conteúdo do ficheiro app/global.css e substituir por
        ```
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        ```
    - 2. Criar uma estrutura de pastas. No Next.js, cada pasta dentro de `app/` é uma rota. Os parênteses `(auth)` criam um grupo de rotas - agrupa páginas relacionadas sem afetar o URL.
        - `app/(auth)/login/page.tsx`

        ```
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

            const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
            })

            if (error) {
            setError('Email ou password incorretos.')
            setLoading(false)
            return
            }

            router.push('/dashboard')
            router.refresh()
        }

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
                
                {/* Header */}
                <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">💡 FinSight</h1>
                <p className="text-gray-500 mt-1">Entra na tua conta</p>
                </div>

                {/* Erro */}
                {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
                )}

                {/* Formulário */}
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                    </label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="o@teu.email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                    </label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'A entrar...' : 'Entrar'}
                </button>
                </div>

                {/* Link para signup */}
                <p className="mt-6 text-center text-sm text-gray-500">
                Não tens conta?{' '}
                <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                    Cria uma aqui
                </Link>
                </p>
            </div>
            </div>
        )
        }
        ```
        - `app/(auth)/signup/page.tsx`
        ```
        'use client'

        import { useState } from 'react'
        import { useRouter } from 'next/navigation'
        import Link from 'next/link'
        import { createClient } from '@/lib/supabase/client'

        export default function SignupPage() {
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const [confirmPassword, setConfirmPassword] = useState('')
        const [error, setError] = useState<string | null>(null)
        const [success, setSuccess] = useState(false)
        const [loading, setLoading] = useState(false)
        const router = useRouter()
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

            const { error } = await supabase.auth.signUp({
            email,
            password,
            })

            if (error) {
            setError('Erro ao criar conta. Tenta novamente.')
            setLoading(false)
            return
            }

            // Supabase envia email de confirmação por defeito
            // Para desenvolvimento, vamos desativar isso no Supabase dashboard
            setSuccess(true)
            setLoading(false)
        }

        if (success) {
            return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md text-center">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Conta criada!</h2>
                <p className="text-gray-500 mb-6">
                    Verifica o teu email para confirmar a conta, ou entra diretamente se a confirmação estiver desativada.
                </p>
                <Link
                    href="/login"
                    className="inline-block py-2 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Ir para o Login
                </Link>
                </div>
            </div>
            )
        }

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">

                {/* Header */}
                <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">💡 FinSight</h1>
                <p className="text-gray-500 mt-1">Cria a tua conta gratuita</p>
                </div>

                {/* Erro */}
                {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
                )}

                {/* Formulário */}
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                    </label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="o@teu.email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                    </label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Password
                    </label>
                    <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repete a password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'A criar conta...' : 'Criar Conta'}
                </button>
                </div>

                {/* Link para login */}
                <p className="mt-6 text-center text-sm text-gray-500">
                Já tens conta?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Entra aqui
                </Link>
                </p>
            </div>
            </div>
        )
        }
        ```
        - uma dashboard temporária:
        ```
        import { createClient } from '@/lib/supabase/server'
        import { redirect } from 'next/navigation'

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
        ```
        - e um botão de logout
        ```
        'use client'

        import { createClient } from '@/lib/supabase/client'
        import { useRouter } from 'next/navigation'

        export default function LogoutButton() {
        const router = useRouter()
        const supabase = createClient()

        async function handleLogout() {
            await supabase.auth.signOut()
            router.push('/login')
            router.refresh()
        }

        return (
            <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
            Terminar Sessão
            </button>
        )
        }
        ```