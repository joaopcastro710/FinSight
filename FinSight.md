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