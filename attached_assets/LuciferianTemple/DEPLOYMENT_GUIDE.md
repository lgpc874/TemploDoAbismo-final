# Guia de Deploy - Templo do Abismo

## Arquitetura de Deployment

### Frontend: Vercel
- Deploy do client React/TypeScript
- Serving estático otimizado
- Configuração automática de build

### Backend: Supabase
- Database PostgreSQL
- API REST automática
- Autenticação integrada
- Storage de arquivos

## Passos para Deploy

### 1. Preparação do Frontend para Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# No diretório do projeto
cd client
vercel
```

### 2. Configuração das Variáveis de Ambiente

No dashboard do Vercel, adicionar:

```env
VITE_SUPABASE_URL=https://nqexwgnscvpfhuonbafr.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
VITE_STRIPE_PUBLIC_KEY=sua_stripe_public_key_aqui
```

### 3. Configuração do Supabase

No dashboard do Supabase (https://app.supabase.com):

1. **Configurar CORS**:
   - Adicionar domínio do Vercel em Authentication > Settings
   - Site URL: `https://seu-projeto.vercel.app`

2. **Row Level Security (RLS)**:
   - Já configurado no projeto atual
   - Políticas ativas para users, grimoires, etc.

3. **Variáveis do Servidor** (se necessário):
   ```env
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
   STRIPE_SECRET_KEY=sua_stripe_secret_key
   ```

### 4. Estrutura de Arquivos para Vercel

```
client/
├── src/
├── public/
├── package.json
├── vite.config.ts
├── vercel.json (opcional)
└── ...
```

### 5. Build Configuration

O Vercel detectará automaticamente que é um projeto Vite e usará:
- Build command: `npm run build`
- Output directory: `dist`
- Development command: `npm run dev`

## Adaptações Necessárias

### 1. Remover Dependências do Backend Express

O frontend funcionará diretamente com Supabase, removendo:
- Rotas Express
- Middleware de autenticação personalizado
- Storage local

### 2. Client-Side Authentication

Usar autenticação nativa do Supabase:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)
```

### 3. API Calls Diretas

Substituir chamadas para `/api/*` por calls diretos ao Supabase:
```typescript
// Antes: fetch('/api/grimoires')
// Depois: supabase.from('grimoires').select('*')
```

## Benefícios desta Arquitetura

- **Performance**: Frontend estático no CDN do Vercel
- **Escalabilidade**: Supabase gerencia toda a infraestrutura
- **Simplicidade**: Menos servidores para gerenciar
- **Custo**: Tier gratuito generoso em ambas plataformas
- **Edge Functions**: Disponível no Supabase se precisar de lógica server-side

## Próximos Passos

1. Adaptar o cliente para usar Supabase diretamente
2. Configurar variáveis de ambiente
3. Testar build local
4. Deploy no Vercel
5. Configurar domínio personalizado (opcional)