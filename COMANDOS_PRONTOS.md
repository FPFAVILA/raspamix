# ⚡ COMANDOS PRONTOS - COPIA E COLA

## 📦 INSTALAR SUPABASE CLI

**Windows/Mac/Linux:**
```bash
npm install -g supabase
```

**Verificar:**
```bash
supabase --version
```

---

## 🔐 LOGIN E LINK

**Login:**
```bash
supabase login
```

**Link com projeto:**
```bash
supabase link --project-ref SEU_PROJECT_REF_AQUI
```

---

## 🎯 CRIAR EDGE FUNCTIONS

**Criar função webhook:**
```bash
supabase functions new pixup-webhook
```

**Criar função PIX:**
```bash
supabase functions new create-pix
```

---

## 🚀 DEPLOY EDGE FUNCTIONS

**Deploy tudo de uma vez:**
```bash
supabase functions deploy pixup-webhook && supabase functions deploy create-pix
```

**Ou separado:**
```bash
supabase functions deploy pixup-webhook
supabase functions deploy create-pix
```

---

## 📤 SUBIR PARA GITHUB

**Primeira vez:**
```bash
git init
git add .
git commit -m "Deploy inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/raspadinha-fc.git
git push -u origin main
```

**Atualizações posteriores:**
```bash
git add .
git commit -m "Atualização"
git push
```

---

## 🔍 TESTAR DNS

**Verificar domínio principal:**
```bash
nslookup raspadinhafc.shop
```

**Verificar subdomínio API:**
```bash
nslookup api.raspadinhafc.shop
```

---

## 📊 VER LOGS DAS EDGE FUNCTIONS

**Via terminal:**
```bash
supabase functions logs pixup-webhook
supabase functions logs create-pix
```

**Ou acesse o painel do Supabase:**
- Edge Functions → Selecione a função → Logs

---

## 🛠️ COMANDOS ÚTEIS

**Listar funções deployadas:**
```bash
supabase functions list
```

**Deletar uma função:**
```bash
supabase functions delete NOME_DA_FUNCAO
```

**Testar função localmente:**
```bash
supabase functions serve pixup-webhook
```

---

## 🆘 RESOLVER PROBLEMAS COMUNS

### Erro: "Project not linked"
```bash
supabase link --project-ref SEU_PROJECT_REF
```

### Erro: "Not logged in"
```bash
supabase login
```

### Erro ao fazer deploy
```bash
supabase functions deploy NOME_DA_FUNCAO --no-verify-jwt
```

### Limpar cache e fazer deploy novamente
```bash
rm -rf .supabase
supabase link --project-ref SEU_PROJECT_REF
supabase functions deploy pixup-webhook
supabase functions deploy create-pix
```

---

## 📋 CHECKLIST RÁPIDO

Copie e cole isso para acompanhar seu progresso:

```
[ ] Conta Supabase criada
[ ] Copiei: Project URL, anon key, service_role key
[ ] Executei o SQL para criar as tabelas
[ ] Instalei Supabase CLI (npm install -g supabase)
[ ] Fiz login (supabase login)
[ ] Linkei projeto (supabase link)
[ ] Criei função pixup-webhook
[ ] Criei função create-pix
[ ] Fiz deploy das funções
[ ] Subi projeto para GitHub
[ ] Criei conta Vercel
[ ] Importei repositório no Vercel
[ ] Adicionei variáveis de ambiente no Vercel
[ ] Deploy no Vercel concluído
[ ] Adicionei domínio raspadinhafc.shop no Vercel
[ ] Configurei DNS (A e CNAMEs)
[ ] Configurei webhook no painel Pixup
[ ] Testei cadastro
[ ] Testei geração de PIX
[ ] Testei pagamento real
```

---

## 💡 DICAS IMPORTANTES

1. **Sempre aguarde 2-3 minutos após cada deploy**
2. **DNS pode levar até 48h para propagar (geralmente 15-30 min)**
3. **Guarde bem suas credenciais do Supabase**
4. **Nunca commite arquivos .env para o GitHub**
5. **Use sempre HTTPS, nunca HTTP**

---

## 🔗 LINKS ÚTEIS

- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Pixup Dashboard:** https://app.pixupbr.com
- **GitHub:** https://github.com/SEU_USUARIO/raspadinha-fc

---

## 📞 SUPORTE

Se precisar de ajuda, me envie:

1. O que você estava fazendo
2. O erro que apareceu (copie e cole)
3. Screenshot (se possível)

Eu vou te ajudar a resolver! 🚀
