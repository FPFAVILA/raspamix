# 🚀 COMECE AQUI - PASSO A PASSO SIMPLIFICADO

## ⏱️ TEMPO TOTAL: ~45 minutos

---

## PASSO 1: CRIAR CONTA SUPABASE (5 min)

1. Acesse: https://supabase.com
2. Clique em **"Sign Up with GitHub"**
3. Crie novo projeto:
   - Nome: `raspadinha-fc`
   - Senha: Gere automática
   - Região: **South America (São Paulo)**
   - Plan: **Free**
4. Aguarde 2-3 minutos

**📋 COPIE E GUARDE:**
- Project URL: `https://xxxxx.supabase.co`
- anon key: `eyJhbGci...`
- service_role key: `eyJhbGci...`

---

## PASSO 2: CRIAR BANCO DE DADOS (2 min)

1. No Supabase, clique em **"SQL Editor"** → **"New query"**
2. Abra o arquivo `GUIA_COMPLETO_HOSPEDAGEM.md` (seção 2.2)
3. Copie TODO o código SQL
4. Cole no editor
5. Clique em **"Run"** (botão verde)
6. Deve aparecer: **"Success. No rows returned"** ✅

---

## PASSO 3: INSTALAR SUPABASE CLI (2 min)

Abra o terminal e execute:

```bash
npm install -g supabase
```

Teste:
```bash
supabase --version
```

---

## PASSO 4: FAZER LOGIN (1 min)

```bash
supabase login
```

- Vai abrir o navegador
- Clique em **"Authorize"**
- Volte para o terminal

---

## PASSO 5: LINKAR PROJETO (1 min)

```bash
supabase link --project-ref SEU_PROJECT_REF
```

**Como achar SEU_PROJECT_REF:**
- No Supabase: Settings → General → Reference ID
- Exemplo: `abcdefghijklmnop`

---

## PASSO 6: CRIAR EDGE FUNCTIONS (10 min)

### 6.1: Criar estrutura
```bash
supabase functions new pixup-webhook
supabase functions new create-pix
```

### 6.2: Copiar código

**Arquivo 1:** `supabase/functions/pixup-webhook/index.ts`
- Abra o arquivo `GUIA_COMPLETO_HOSPEDAGEM.md`
- Vá na seção 3.5
- Copie TODO o código TypeScript
- Cole no arquivo `index.ts`

**Arquivo 2:** `supabase/functions/create-pix/index.ts`
- Abra o arquivo `GUIA_COMPLETO_HOSPEDAGEM.md`
- Vá na seção 3.6
- Copie TODO o código TypeScript
- Cole no arquivo `index.ts`

### 6.3: Deploy
```bash
supabase functions deploy pixup-webhook
supabase functions deploy create-pix
```

Aguarde ver:
```
✓ Deployed Function pixup-webhook
✓ Deployed Function create-pix
```

---

## PASSO 7: SUBIR PARA GITHUB (3 min)

### 7.1: Criar repositório
1. Acesse: https://github.com/new
2. Nome: `raspadinha-fc`
3. Public
4. Clique **"Create repository"**

### 7.2: Enviar código
```bash
git init
git add .
git commit -m "Deploy inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/raspadinha-fc.git
git push -u origin main
```

---

## PASSO 8: HOSPEDAR NO VERCEL (5 min)

### 8.1: Criar conta
1. Acesse: https://vercel.com
2. **"Sign Up with GitHub"**

### 8.2: Importar projeto
1. Clique **"Add New..." → "Project"**
2. Selecione `raspadinha-fc`
3. Clique **"Import"**

### 8.3: Configurar
- Framework: **Vite**
- Build Command: `npm run build`
- Output: `dist`

### 8.4: Variáveis de ambiente
Clique em **"Environment Variables"** e adicione:

```
VITE_SUPABASE_URL
(cole seu Project URL)

VITE_SUPABASE_ANON_KEY
(cole seu anon key)
```

### 8.5: Deploy
Clique **"Deploy"** e aguarde 2-3 minutos.

Seu site estará em: `https://raspadinha-fc.vercel.app`

---

## PASSO 9: CONFIGURAR DOMÍNIO (5 min)

### 9.1: Adicionar no Vercel
1. No Vercel: **Settings → Domains**
2. Digite: `raspadinhafc.shop`
3. Clique **"Add"**

### 9.2: Configurar DNS
No painel do seu domínio (onde você comprou), adicione:

| Tipo  | Nome | Valor                     |
|-------|------|---------------------------|
| A     | @    | 76.76.21.21               |
| CNAME | www  | cname.vercel-dns.com      |

### 9.3: Aguardar (15-30 min)
Teste com:
```bash
nslookup raspadinhafc.shop
```

---

## PASSO 10: CONFIGURAR WEBHOOK PIXUP (2 min)

### 10.1: Copiar URL
No Supabase:
1. **Edge Functions → pixup-webhook**
2. Copie a URL: `https://xxxxx.supabase.co/functions/v1/pixup-webhook`

### 10.2: Configurar no Pixup
1. Acesse: https://app.pixupbr.com
2. **Configurações → Webhooks**
3. Cole a URL
4. **Salvar**

---

## PASSO 11: TESTAR! (5 min)

1. Acesse: `https://raspadinhafc.shop` (ou o domínio .vercel.app)
2. Faça um cadastro
3. Clique em **"Adicionar Saldo"**
4. Digite R$ 10,00
5. Deve gerar QR Code
6. Faça um pagamento teste
7. Aguarde 10 segundos
8. Saldo deve atualizar automaticamente ✅

---

## ✅ PRONTO!

Se tudo funcionou, você tem:

- ✅ Frontend hospedado no Vercel (grátis)
- ✅ Backend no Supabase Edge Functions (grátis)
- ✅ Banco de dados PostgreSQL (grátis)
- ✅ Domínio personalizado funcionando
- ✅ Webhook do Pixup funcionando
- ✅ Pagamentos PIX funcionando

**Custo mensal: R$ 0,00** 🎉

---

## 🆘 PRECISA DE AJUDA?

Me envie uma mensagem com:
1. Em qual passo você está
2. O erro que apareceu
3. Screenshot (se tiver)

Vou te ajudar! 🚀

---

## 📚 MAIS INFORMAÇÕES

- **GUIA_COMPLETO_HOSPEDAGEM.md** - Guia detalhado com explicações
- **COMANDOS_PRONTOS.md** - Lista de comandos úteis
