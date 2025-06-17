# Deploy no Vercel + Supabase - Templo do Abismo

## 🎯 Arquitetura Final

**Frontend**: Vercel (React/TypeScript estático)
**Backend**: Supabase (PostgreSQL + API REST automática)

## 📋 Preparação Rápida

### 1. Configurar Variáveis no Vercel

No dashboard do Vercel, adicione estas variáveis de ambiente:

```
VITE_SUPABASE_URL=https://nqexwgnscvpfhuonbafr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZXh3Z25zY3ZwZmh1b25iYWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODgzNjYsImV4cCI6MjA2NTc2NDM2Nn0.Cc6MdK8Ykyz_Bme0pZzE4bHcIh1p-WUPEt-y8z-Q6lI
VITE_STRIPE_PUBLIC_KEY=pk_test_sua_chave_stripe_aqui
```

### 2. Configurar Supabase CORS

No dashboard do Supabase (https://app.supabase.com):

1. **Authentication > Settings > Site URL**:
   ```
   https://seu-projeto.vercel.app
   ```

2. **Authentication > Settings > Additional URLs**:
   ```
   https://seu-projeto.vercel.app/**
   ```

### 3. Deploy no Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# No diretório /client
cd client
vercel --prod
```

## 🔧 Arquivos Necessários (Já Criados)

✅ `client/vercel.json` - Configuração do Vercel
✅ `client/src/lib/supabase.ts` - Cliente Supabase direto
✅ `client/.env.example` - Template das variáveis
✅ `client/package.json` - Dependências otimizadas

## 🗄️ Database (Supabase)

O projeto Supabase atual já está configurado com:

- ✅ 5 seções da biblioteca
- ✅ 6 grimórios funcionais  
- ✅ 1 usuário admin ativo
- ✅ Políticas RLS configuradas
- ✅ Tabelas otimizadas

**URL**: https://nqexwgnscvpfhuonbafr.supabase.co
**Status**: Funcionando perfeitamente

## 🚀 Vantagens desta Arquitetura

1. **Performance**: Frontend servido via CDN global
2. **Custo**: Tier gratuito em ambas plataformas
3. **Escalabilidade**: Infraestrutura gerenciada
4. **Simplicidade**: Apenas 2 serviços para gerenciar
5. **Velocidade**: Deploy em segundos

## 📱 Funcionalidades Preservadas

- ✅ Sistema de autenticação completo
- ✅ Biblioteca de grimórios com seções
- ✅ Leitor estilo Kindle responsivo
- ✅ Painel administrativo funcional
- ✅ Sistema de progresso de leitura
- ✅ Design místico luciferiano
- ✅ Responsividade total

## 🔄 Workflow de Deploy

1. **Desenvolvimento**: Continuar no Replit normalmente
2. **Teste**: Validar funcionalidades localmente
3. **Deploy**: Push para Vercel com um comando
4. **Monitoring**: Dashboard automático do Vercel

O sistema está pronto para deployment imediato!