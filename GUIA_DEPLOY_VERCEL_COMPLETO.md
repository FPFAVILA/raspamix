# 🚀 Guia Completo de Deploy na Vercel - Do Zero ao Ar

## 📋 O que você vai precisar

- [ ] Conta no GitHub (gratuita)
- [ ] Conta na Vercel (gratuita)
- [ ] Seu código do projeto
- [ ] 15-20 minutos de tempo

---

## 📂 PASSO 1: Preparar o Projeto

### 1.1 Entenda a estrutura do projeto

Seu projeto tem esta estrutura:

```
projeto/
├── src/                    → Código React (será compilado)
├── public/                 → Arquivos estáticos (imagens, etc)
├── api/                    → Funções serverless (API Pix Up)
│   └── pixup/
│       ├── token.js        → Gera token Pix Up
│       ├── qrcode.js       → Gera QR Code Pix
│       └── webhook.js      → Recebe confirmação de pagamento
├── dist/                   → Build final (gerado automaticamente)
├── package.json            → Dependências do projeto
├── vite.config.ts          → Configuração do Vite
└── .env.production         → Variáveis de ambiente
```

### 1.2 O que acontece no build?

Quando você roda `npm run build`:

1. ✅ O Vite compila todo código do `src/` → gera arquivos em `dist/`
2. ✅ Os arquivos do `public/` são copiados para `dist/`
3. ✅ JavaScript é minificado e otimizado
4. ✅ CSS é processado e minificado
5. ❌ A pasta `api/` **NÃO** vai para `dist/` - ela fica separada

### 1.3 O que a Vercel vai fazer?

A Vercel é inteligente e detecta automaticamente:

- **Frontend (dist/)**: Servido como site estático
- **API (api/)**: Cada arquivo `.js` vira uma rota serverless
  - `api/pixup/token.js` → `https://seusite.vercel.app/api/pixup/token`
  - `api/pixup/qrcode.js` → `https://seusite.vercel.app/api/pixup/qrcode`
  - `api/pixup/webhook.js` → `https://seusite.vercel.app/api/pixup/webhook`

**IMPORTANTE:** Você **NÃO** precisa fazer build local antes de enviar para a Vercel. A Vercel faz o build automaticamente na nuvem!

---

## 🔧 PASSO 2: Subir o Código para o GitHub

### 2.1 Criar conta no GitHub (se não tiver)

1. Acesse: https://github.com/signup
2. Crie sua conta gratuita
3. Confirme seu email

### 2.2 Criar um novo repositório

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `raspadinha-pixup` (ou outro nome)
   - **Description**: "Sistema de raspadinha com pagamento Pix"
   - Marque: ✅ **Private** (para manter privado)
   - **NÃO** marque "Add a README file"
3. Clique em **"Create repository"**

### 2.3 Subir seu código para o GitHub

#### Opção A: Usando GitHub Desktop (MAIS FÁCIL)

1. Baixe o GitHub Desktop: https://desktop.github.com/
2. Instale e faça login com sua conta
3. Clique em **"File"** → **"Add Local Repository"**
4. Selecione a pasta do seu projeto
5. Clique em **"Publish repository"**
6. Marque ✅ "Keep this code private"
7. Clique em **"Publish repository"**

#### Opção B: Usando linha de comando

Abra o terminal na pasta do projeto e execute:

```bash
git init
git add .
git commit -m "Primeiro commit - Sistema Raspadinha"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/raspadinha-pixup.git
git push -u origin main
```

Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub.

---

## ☁️ PASSO 3: Deploy na Vercel

### 3.1 Criar conta na Vercel

1. Acesse: https://vercel.com/signup
2. Clique em **"Continue with GitHub"**
3. Autorize a Vercel a acessar seu GitHub
4. Pronto! Sua conta está criada

### 3.2 Importar o projeto

1. No painel da Vercel, clique em **"Add New..."** → **"Project"**
2. Na lista, encontre o repositório `raspadinha-pixup`
3. Clique em **"Import"**

### 3.3 Configurar o projeto

Na tela de configuração:

#### Build & Development Settings

✅ Deixe tudo como está. A Vercel detecta automaticamente que é um projeto Vite:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**NÃO MUDE NADA AQUI!**

#### Root Directory

✅ Deixe em branco (use a raiz do projeto)

---

## 🔐 PASSO 4: Configurar Variáveis de Ambiente

**ESTE É O PASSO MAIS IMPORTANTE!**

Antes de fazer deploy, você precisa configurar as credenciais da API Pix Up.

### 4.1 Adicionar variáveis de ambiente

1. Na tela de configuração, expanda **"Environment Variables"**
2. Adicione **UMA POR UMA** as seguintes variáveis:

#### Variável 1:
- **Name**: `PIXUP_CLIENT_ID`
- **Value**: `fpfavila_0241736713049671`
- Clique em **"Add"**

#### Variável 2:
- **Name**: `PIXUP_CLIENT_SECRET`
- **Value**: `385c2026f228aefce8109fba489ac639f6729b8a4d5da10960b159f7c80a98ab`
- Clique em **"Add"**

#### Variável 3:
- **Name**: `PIXUP_API_URL`
- **Value**: `https://api.pixupbr.com/v2`
- Clique em **"Add"**

#### Variável 4:
- **Name**: `NEXT_PUBLIC_BASE_URL`
- **Value**: (DEIXE EM BRANCO POR ENQUANTO - vamos preencher depois)
- Clique em **"Add"**

#### Variáveis do Supabase (se existirem):
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://0ec90b57d6e95fcbda19832f.supabase.co`
- Clique em **"Add"**

- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw`
- Clique em **"Add"**

### 4.2 Fazer o primeiro deploy

Depois de adicionar todas as variáveis, clique em **"Deploy"**

🎉 A Vercel vai:
1. Baixar seu código do GitHub
2. Instalar as dependências (`npm install`)
3. Fazer o build (`npm run build`)
4. Configurar as funções serverless da pasta `api/`
5. Publicar seu site

**Aguarde 2-3 minutos...**

---

## 🎯 PASSO 5: Atualizar a URL do Webhook

Quando o deploy terminar, você vai ver uma tela com:

✅ **Congratulations!** 🎉

### 5.1 Copiar a URL do site

Você vai ver algo como:

```
https://raspadinha-pixup-abc123.vercel.app
```

**Copie esta URL!**

### 5.2 Atualizar a variável de ambiente

1. No painel da Vercel, clique em **"Settings"** (no topo)
2. No menu lateral, clique em **"Environment Variables"**
3. Encontre a variável `NEXT_PUBLIC_BASE_URL`
4. Clique nos 3 pontinhos → **"Edit"**
5. Cole a URL que você copiou (exemplo: `https://raspadinha-pixup-abc123.vercel.app`)
6. Clique em **"Save"**

### 5.3 Fazer redeploy

1. Volte para a aba **"Deployments"**
2. No deployment mais recente, clique nos 3 pontinhos → **"Redeploy"**
3. Marque ✅ **"Use existing Build Cache"**
4. Clique em **"Redeploy"**

Aguarde mais 1-2 minutos...

---

## ✅ PASSO 6: Testar se está funcionando

### 6.1 Abrir o site

Clique no link do seu site (ex: `https://raspadinha-pixup-abc123.vercel.app`)

O site deve carregar normalmente!

### 6.2 Testar a API Pix Up

Abra as **Ferramentas do Desenvolvedor** no navegador:

- Chrome/Edge: Pressione `F12`
- Firefox: Pressione `F12`
- Safari: Cmd+Option+I (Mac)

No **Console**, cole e execute:

```javascript
fetch('https://SEU-SITE.vercel.app/api/pixup/qrcode', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 10.00, external_id: 'teste123' })
})
.then(r => r.json())
.then(data => console.log('Resposta:', data))
.catch(err => console.error('Erro:', err))
```

**Substitua** `SEU-SITE` pela URL real do seu site!

### 6.3 Verificar o resultado

Se tudo estiver certo, você verá no console:

```javascript
Resposta: {
  transactionId: "c327ce8bee2a18565...",
  external_id: "teste123",
  qrcode: "00020126580014br.gov.bcb.pix...",
  qrcodeImage: "data:image/png;base64,...",
  amount: 10.00,
  status: "PENDING"
}
```

🎉 **SUCESSO!** A API Pix Up está funcionando!

---

## 🔄 Como fazer alterações no futuro

### Opção 1: Editar pelo GitHub (mais fácil)

1. Acesse seu repositório no GitHub
2. Navegue até o arquivo que quer editar
3. Clique no ícone de lápis ✏️
4. Faça suas alterações
5. Clique em **"Commit changes"**
6. A Vercel vai automaticamente fazer redeploy!

### Opção 2: Editar localmente

1. Faça suas alterações no código local
2. Use o GitHub Desktop ou linha de comando:
   ```bash
   git add .
   git commit -m "Descrição da alteração"
   git push
   ```
3. A Vercel vai automaticamente fazer redeploy!

---

## 🆘 Problemas Comuns e Soluções

### ❌ Erro: "Failed to build"

**Solução:**
1. Vá em **"Settings"** → **"General"**
2. Verifique se **"Build Command"** é `npm run build`
3. Verifique se **"Output Directory"** é `dist`

### ❌ Erro: "API não responde"

**Solução:**
1. Vá em **"Settings"** → **"Environment Variables"**
2. Verifique se TODAS as variáveis estão preenchidas
3. Verifique se `NEXT_PUBLIC_BASE_URL` tem a URL correta
4. Faça um redeploy

### ❌ Erro: "Credenciais inválidas" na API Pix Up

**Solução:**
1. Verifique se `PIXUP_CLIENT_ID` e `PIXUP_CLIENT_SECRET` estão corretos
2. NÃO adicione espaços antes ou depois das credenciais
3. Copie e cole exatamente como está neste guia

### ❌ Site carrega mas é só uma tela branca

**Solução:**
1. Pressione F12 para abrir o Console
2. Veja se há erros em vermelho
3. Provavelmente é erro de variável de ambiente do Supabase
4. Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas

---

## 📊 Entendendo o que fica onde

### Durante o desenvolvimento local:
```
projeto/
├── src/              → Seu código React
├── api/              → Funções serverless
├── public/           → Arquivos estáticos
└── .env.production   → Variáveis (NÃO vai pro build)
```

### Após rodar `npm run build`:
```
projeto/
├── dist/             → Build compilado (frontend)
│   ├── index.html
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   └── (arquivos do public/)
└── api/              → Fica separado (backend)
```

### Na Vercel (em produção):
```
Vercel Deploy
├── Frontend (dist/)
│   → Servido via CDN global
│   → https://seusite.vercel.app/
│
└── API (api/)
    → Serverless functions
    → https://seusite.vercel.app/api/pixup/token
    → https://seusite.vercel.app/api/pixup/qrcode
    → https://seusite.vercel.app/api/pixup/webhook
```

**IMPORTANTE:**
- ✅ A pasta `api/` **NÃO** precisa estar em `dist/`
- ✅ A Vercel lê `api/` diretamente do repositório
- ✅ Cada arquivo `.js` em `api/` vira uma rota automática
- ✅ O arquivo `.env.production` **NÃO** vai para produção (use as Environment Variables da Vercel)

---

## 🎓 Resumo Final

1. ✅ Suba seu código para o GitHub
2. ✅ Importe o projeto na Vercel
3. ✅ Configure as variáveis de ambiente
4. ✅ Faça o deploy
5. ✅ Atualize `NEXT_PUBLIC_BASE_URL` com a URL gerada
6. ✅ Faça redeploy
7. ✅ Teste a API no console do navegador

**Pronto!** Seu sistema está no ar! 🚀

---

## 📞 Links Úteis

- **Documentação Vercel**: https://vercel.com/docs
- **GitHub Desktop**: https://desktop.github.com/
- **Painel Vercel**: https://vercel.com/dashboard
- **Seu projeto**: https://github.com/SEU-USUARIO/raspadinha-pixup

---

## 💡 Dicas Profissionais

### Domínio personalizado (opcional)

Se você quiser usar seu próprio domínio (ex: `raspadinha.com`):

1. Compre um domínio (Registro.br, GoDaddy, etc)
2. Na Vercel, vá em **"Settings"** → **"Domains"**
3. Clique em **"Add Domain"**
4. Siga as instruções para configurar o DNS
5. Atualize `NEXT_PUBLIC_BASE_URL` com seu novo domínio

### Logs e Monitoramento

Para ver logs das funções serverless:

1. Vá em **"Deployments"**
2. Clique no deployment ativo
3. Clique em **"Functions"**
4. Selecione a função (ex: `api/pixup/qrcode.js`)
5. Veja os logs em tempo real

### Rollback (voltar versão anterior)

Se algo der errado:

1. Vá em **"Deployments"**
2. Encontre um deployment anterior que funcionava
3. Clique nos 3 pontinhos → **"Promote to Production"**

---

## ✨ Parabéns!

Você fez o deploy de um sistema completo com:

- ✅ Frontend React com Vite
- ✅ API serverless para processar pagamentos Pix
- ✅ Integração com API Pix Up
- ✅ Webhook para confirmação de pagamentos
- ✅ Deploy automático via GitHub

**Tudo sem precisar de servidor VPS, sem configurar servidor, sem dor de cabeça!**

🎉 **Seu sistema está no ar e pronto para receber pagamentos!** 🎉
