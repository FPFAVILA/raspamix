# 🚀 GUIA COMPLETO: HOSPEDAGEM RASPADINHA FC

## 📋 ÍNDICE
1. [Visão Geral](#visão-geral)
2. [Criar Conta Supabase](#1-criar-conta-supabase)
3. [Configurar Banco de Dados](#2-configurar-banco-de-dados)
4. [Criar Edge Functions](#3-criar-edge-functions)
5. [Hospedar Frontend no Vercel](#4-hospedar-frontend-no-vercel)
6. [Configurar Domínios](#5-configurar-domínios)
7. [Configurar Webhook Pixup](#6-configurar-webhook-pixup)
8. [Testar Tudo](#7-testar-tudo)

---

## 📌 VISÃO GERAL

### O que você vai fazer:
- ✅ **Frontend**: Hospedar no Vercel (100% grátis)
- ✅ **Backend**: Supabase Edge Functions (100% grátis, até 500mil requisições/mês)
- ✅ **Banco de Dados**: Supabase PostgreSQL (100% grátis, até 500MB)
- ✅ **Domínio**: Configurar `raspadinhafc.shop` para apontar para o Vercel
- ✅ **API**: Configurar `api.raspadinhafc.shop` para receber webhooks do Pixup

### Custo total: R$ 0,00/mês

---

## 1️⃣ CRIAR CONTA SUPABASE

### Passo 1.1: Acessar o Supabase
1. Abra seu navegador
2. Acesse: https://supabase.com
3. Clique em **"Start your project"** (botão verde)

### Passo 1.2: Criar conta
1. Clique em **"Sign Up"** (Cadastrar)
2. Escolha **"Continue with GitHub"** (recomendado) OU use seu email
3. Se escolher GitHub:
   - Clique em **"Authorize Supabase"**
   - Pronto! Você estará logado automaticamente

### Passo 1.3: Criar projeto
1. Você verá a tela "Create a new project"
2. Preencha:
   - **Organization**: Crie uma nova (ex: "Raspadinha")
   - **Name**: `raspadinha-fc`
   - **Database Password**: Clique em **"Generate a password"** e COPIE essa senha (guarde bem!)
   - **Region**: Escolha **"South America (São Paulo)"** (mais próximo = mais rápido)
   - **Pricing Plan**: **Free** (já vem selecionado)
3. Clique em **"Create new project"**
4. **AGUARDE 2-3 MINUTOS** enquanto o Supabase cria seu banco de dados

### Passo 1.4: Copiar credenciais
Quando o projeto estiver pronto:
1. No menu lateral esquerdo, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Você verá:
   - **Project URL**: `https://xxxxx.supabase.co` ← COPIE ISSO
   - **anon public**: `eyJhbG...` (uma chave longa) ← COPIE ISSO
   - **service_role secret**: `eyJhbG...` (outra chave) ← COPIE ISSO

**💾 SALVE ESSAS 3 INFORMAÇÕES EM UM BLOCO DE NOTAS!**

---

## 2️⃣ CONFIGURAR BANCO DE DADOS

### Passo 2.1: Acessar o SQL Editor
1. No menu lateral esquerdo do Supabase, clique em **"SQL Editor"**
2. Clique em **"New query"** (novo botão de +)

### Passo 2.2: Criar tabelas
Cole este código SQL e clique em **"Run"** (botão verde):

```sql
/*
  # CRIAR BANCO DE DADOS RASPADINHA FC

  1. Tabelas:
    - users: Dados dos usuários (nome, email, telefone, saldo)
    - payments: Histórico de pagamentos PIX
    - game_state: Estado do jogo (raspadinhas usadas, prêmios ganhos)

  2. Segurança:
    - RLS (Row Level Security) habilitado em todas as tabelas
    - Políticas para controlar acesso aos dados
*/

-- TABELA: USERS (Usuários)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABELA: PAYMENTS (Pagamentos PIX)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transaction_id TEXT UNIQUE NOT NULL,
  external_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  qrcode TEXT,
  date_approval TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABELA: GAME_STATE (Estado do jogo)
CREATE TABLE IF NOT EXISTS game_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  scratch_cards_used INTEGER DEFAULT 0,
  has_won_iphone BOOLEAN DEFAULT false,
  total_winnings DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURANÇA: USERS
-- Permitir que qualquer pessoa crie um usuário (registro)
CREATE POLICY "Permitir criar usuário"
  ON users FOR INSERT
  WITH CHECK (true);

-- Permitir que qualquer pessoa leia usuários (para consultas)
CREATE POLICY "Permitir ler usuários"
  ON users FOR SELECT
  USING (true);

-- Permitir atualizar saldo (backend atualiza via service_role)
CREATE POLICY "Permitir atualizar usuário"
  ON users FOR UPDATE
  USING (true);

-- POLÍTICAS DE SEGURANÇA: PAYMENTS
-- Permitir criar pagamentos
CREATE POLICY "Permitir criar pagamento"
  ON payments FOR INSERT
  WITH CHECK (true);

-- Permitir ler pagamentos
CREATE POLICY "Permitir ler pagamentos"
  ON payments FOR SELECT
  USING (true);

-- Permitir atualizar status de pagamentos
CREATE POLICY "Permitir atualizar pagamento"
  ON payments FOR UPDATE
  USING (true);

-- POLÍTICAS DE SEGURANÇA: GAME_STATE
-- Permitir criar estado do jogo
CREATE POLICY "Permitir criar estado do jogo"
  ON game_state FOR INSERT
  WITH CHECK (true);

-- Permitir ler estado do jogo
CREATE POLICY "Permitir ler estado do jogo"
  ON game_state FOR SELECT
  USING (true);

-- Permitir atualizar estado do jogo
CREATE POLICY "Permitir atualizar estado do jogo"
  ON game_state FOR UPDATE
  USING (true);

-- CRIAR ÍNDICES PARA MELHOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_external_id ON payments(external_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_game_state_user_id ON game_state(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

3. Você verá **"Success. No rows returned"** ← Isso significa que funcionou!

---

## 3️⃣ CRIAR EDGE FUNCTIONS

Agora vamos criar as funções que vão substituir seu backend Node.js.

### Passo 3.1: Abrir terminal
1. Abra o terminal/prompt de comando no seu computador
2. Navegue até a pasta do seu projeto

### Passo 3.2: Instalar Supabase CLI
**No Windows:**
```bash
npm install -g supabase
```

**Verificar instalação:**
```bash
supabase --version
```

### Passo 3.3: Login no Supabase
```bash
supabase login
```
- Isso vai abrir seu navegador
- Clique em **"Authorize"**
- Volte para o terminal

### Passo 3.4: Link com seu projeto
```bash
supabase link --project-ref SEU_PROJECT_REF
```

**Como encontrar SEU_PROJECT_REF:**
1. No Supabase, vá em **Settings** → **General**
2. Copie o **Reference ID** (ex: `abcdefghijklmnop`)
3. Cole no comando acima

### Passo 3.5: Criar função de Webhook
```bash
supabase functions new pixup-webhook
```

Agora abra o arquivo `supabase/functions/pixup-webhook/index.ts` e cole:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  // Lidar com OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    console.log('📨 WEBHOOK PIXUP RECEBIDO');

    const body = await req.json();
    const { requestBody } = body;

    if (!requestBody) {
      console.error('❌ Webhook sem requestBody');
      return new Response(
        JSON.stringify({ received: true, error: 'Missing requestBody' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      transactionType,
      transactionId,
      external_id,
      amount,
      status,
      dateApproval,
    } = requestBody;

    console.log('📊 Dados:', { transactionType, transactionId, status });

    // Validar: RECEIVEPIX + PAID
    if (transactionType === 'RECEIVEPIX' && status === 'PAID') {
      console.log('🎉 PAGAMENTO CONFIRMADO!');

      // Conectar ao Supabase
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Buscar usuário pelo external_id (formato: rfc_timestamp_userid)
      const userId = external_id.split('_')[2];

      // Atualizar pagamento no banco
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'PAID',
          date_approval: dateApproval,
          updated_at: new Date().toISOString(),
        })
        .eq('transaction_id', transactionId);

      if (paymentError) {
        console.error('❌ Erro ao atualizar pagamento:', paymentError);
      }

      // Atualizar saldo do usuário
      const { data: payment } = await supabase
        .from('payments')
        .select('user_id, amount')
        .eq('transaction_id', transactionId)
        .single();

      if (payment) {
        const { error: balanceError } = await supabase.rpc('add_balance', {
          p_user_id: payment.user_id,
          p_amount: payment.amount,
        });

        if (balanceError) {
          console.error('❌ Erro ao atualizar saldo:', balanceError);
        } else {
          console.log('✅ Saldo atualizado!');
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true, timestamp: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Erro:', error);
    return new Response(
      JSON.stringify({ received: true, error: 'Internal error' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Passo 3.6: Criar função para gerar PIX
```bash
supabase functions new create-pix
```

Abra `supabase/functions/create-pix/index.ts` e cole:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import axiod from 'https://deno.land/x/axiod/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const PIXUP_CLIENT_ID = 'fpfavila_7210532199606632';
const PIXUP_CLIENT_SECRET = 'e6f941fcdf8ad4793e5c5ef9d3fbd6e3c6f3a595d94d0785a24f072a8afcb386';
const PIXUP_BASE_URL = 'https://api.pixupbr.com';

let tokenCache = {
  accessToken: null as string | null,
  expiresAt: 0,
};

async function getAccessToken() {
  const now = Date.now();

  if (tokenCache.accessToken && tokenCache.expiresAt > now + 300000) {
    return tokenCache.accessToken;
  }

  const credentials = `${PIXUP_CLIENT_ID}:${PIXUP_CLIENT_SECRET}`;
  const base64Credentials = btoa(credentials);

  const response = await axiod.post(
    `${PIXUP_BASE_URL}/v2/oauth/token`,
    { grant_type: 'client_credentials' },
    {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      },
    }
  );

  tokenCache.accessToken = response.data.access_token;
  tokenCache.expiresAt = Date.now() + response.data.expires_in * 1000;

  return tokenCache.accessToken;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { amount, user_id } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valor inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Conectar ao Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar dados do usuário
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuário não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar external_id
    const external_id = `rfc_${Date.now()}_${user_id}`;

    // Obter token do Pixup
    const accessToken = await getAccessToken();

    // Criar PIX
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/pixup-webhook`;

    const pixPayload = {
      amount: parseFloat(amount),
      external_id,
      postbackUrl: webhookUrl,
      payerQuestion: `Pagamento - R$ ${amount}`,
      payer: {
        name: 'Fellipe Alves',
        document: '03930975106',
        email: 'fpgtav@gmail.com',
      },
    };

    const pixResponse = await axiod.post(
      `${PIXUP_BASE_URL}/v2/pix/qrcode`,
      pixPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Salvar pagamento no banco
    await supabase.from('payments').insert({
      user_id,
      transaction_id: pixResponse.data.transactionId,
      external_id,
      amount: parseFloat(amount),
      status: 'PENDING',
      qrcode: pixResponse.data.qrcode,
    });

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: pixResponse.data.transactionId,
        qrcode: pixResponse.data.qrcode,
        amount: pixResponse.data.amount,
        external_id: pixResponse.data.external_id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Erro:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Passo 3.7: Deploy das funções
```bash
supabase functions deploy pixup-webhook
supabase functions deploy create-pix
```

Aguarde alguns segundos. Você verá:
```
✓ Deployed Function pixup-webhook
✓ Deployed Function create-pix
```

**🎉 SUCESSO! Suas funções estão online!**

---

## 4️⃣ HOSPEDAR FRONTEND NO VERCEL

### Passo 4.1: Criar conta Vercel
1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel no GitHub

### Passo 4.2: Subir projeto para GitHub
Se você ainda não tem seu projeto no GitHub:

1. Crie um repositório:
   - Acesse https://github.com/new
   - Nome: `raspadinha-fc`
   - Deixe **Public**
   - Clique em **"Create repository"**

2. No terminal, na pasta do seu projeto:
```bash
git init
git add .
git commit -m "Primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/raspadinha-fc.git
git push -u origin main
```

### Passo 4.3: Importar no Vercel
1. No Vercel, clique em **"Add New..." → "Project"**
2. Clique em **"Import"** no seu repositório `raspadinha-fc`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Clique em **"Environment Variables"** e adicione:
   ```
   VITE_SUPABASE_URL = https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGci...
   ```
   (Use as credenciais que você copiou do Supabase)
5. Clique em **"Deploy"**

### Passo 4.4: Aguardar deploy
Aguarde 2-3 minutos. Você verá: **"🎉 Congratulations!"**

Seu site estará em: `https://raspadinha-fc.vercel.app`

---

## 5️⃣ CONFIGURAR DOMÍNIOS

### Passo 5.1: Adicionar domínio no Vercel

1. No Vercel, vá em **Settings → Domains**
2. Digite: `raspadinhafc.shop`
3. Clique em **"Add"**
4. Você verá instruções para configurar DNS

### Passo 5.2: Configurar DNS do domínio

Acesse o painel onde você comprou o domínio `raspadinhafc.shop` (ex: Registro.br, GoDaddy, Hostinger).

**Adicione estes registros DNS:**

| Tipo  | Nome               | Valor                         | TTL  |
|-------|--------------------|-------------------------------|------|
| A     | @                  | 76.76.21.21                   | 3600 |
| CNAME | www                | cname.vercel-dns.com          | 3600 |
| CNAME | api                | SEU_PROJECT_REF.supabase.co   | 3600 |

**⚠️ IMPORTANTE:**
- Substitua `SEU_PROJECT_REF` pelo seu Project Reference do Supabase
- Exemplo: `abcdefghijklmnop.supabase.co`

### Passo 5.3: Aguardar propagação DNS
- Isso pode levar de 5 minutos a 48 horas
- Geralmente leva 15-30 minutos

**Testar propagação:**
```bash
nslookup raspadinhafc.shop
```

Quando estiver pronto, você verá o IP `76.76.21.21`.

---

## 6️⃣ CONFIGURAR WEBHOOK PIXUP

### Passo 6.1: Obter URL da Edge Function
1. No Supabase, vá em **Edge Functions**
2. Clique em **pixup-webhook**
3. Copie a URL: `https://xxxxx.supabase.co/functions/v1/pixup-webhook`

### Passo 6.2: Configurar no painel Pixup
1. Acesse o painel do Pixup: https://app.pixupbr.com
2. Faça login
3. Vá em **Configurações → Webhooks**
4. Cole a URL da Edge Function
5. Clique em **"Salvar"**

---

## 7️⃣ TESTAR TUDO

### Teste 1: Frontend
1. Acesse: `https://raspadinhafc.shop`
2. Faça um cadastro
3. Você deve ver a tela do jogo

### Teste 2: Gerar PIX
1. Clique em **"Adicionar Saldo"**
2. Digite um valor (ex: R$ 10,00)
3. Deve gerar um QR Code

### Teste 3: Webhook
1. Faça um pagamento de teste (pode ser R$ 0,01)
2. Aguarde alguns segundos
3. O saldo deve atualizar automaticamente

### Teste 4: Verificar logs
No Supabase:
1. Vá em **Edge Functions → pixup-webhook**
2. Clique em **"Logs"**
3. Você verá os logs do webhook

---

## ✅ CHECKLIST FINAL

- [ ] Conta Supabase criada
- [ ] Banco de dados configurado (tabelas criadas)
- [ ] Edge Functions deployadas (pixup-webhook e create-pix)
- [ ] Projeto no GitHub
- [ ] Deploy no Vercel funcionando
- [ ] Domínio `raspadinhafc.shop` apontando para Vercel
- [ ] Subdomínio `api.raspadinhafc.shop` apontando para Supabase
- [ ] Webhook configurado no painel Pixup
- [ ] Teste de pagamento funcionando

---

## 🆘 PRECISA DE AJUDA?

Se algo não funcionar, me mande essa mensagem:

```
Preciso de ajuda com a hospedagem. Estou na etapa: [NOME DA ETAPA]
O erro que estou recebendo é: [DESCREVA O ERRO]
```

---

## 🎉 PARABÉNS!

Seu projeto está 100% funcional e hospedado GRATUITAMENTE!

**Recursos usados:**
- ✅ Vercel: Frontend (Grátis)
- ✅ Supabase: Backend + Banco (Grátis)
- ✅ Domínio personalizado: raspadinhafc.shop

**Custo mensal: R$ 0,00**
