# 🚀 INSTRUÇÕES COMPLETAS PARA VPS

## 📁 **ARQUIVOS QUE DEVEM ESTAR NA VPS:**

### **Pasta: `/home/raspadinhafc-api/htdocs/api.raspadinhafc.shop/`**

```
api.raspadinhafc.shop/
├── .env                    ← ARQUIVO CRÍTICO!
├── .gitignore
├── server.js               ← ARQUIVO PRINCIPAL
├── package.json
├── package-lock.json
├── ecosystem.config.cjs    ← CONFIGURAÇÃO PM2
├── node_modules/           ← DEPENDÊNCIAS
└── logs/                   ← LOGS DO PM2
```

## 🔧 **COMANDOS PARA EXECUTAR NA VPS:**

### **1. Navegar para a pasta:**
```bash
cd /home/raspadinhafc-api/htdocs/api.raspadinhafc.shop/
```

### **2. Instalar dependências:**
```bash
npm install
```

### **3. Verificar se o .env existe:**
```bash
cat .env
```

### **4. Se não existir, criar o .env:**
```bash
nano .env
```

**Conteúdo do .env:**
```
# CONFIGURAÇÕES PIXUP - FPFAVILA
PIXUP_CLIENT_ID=fpfavila_7210532199606632
PIXUP_CLIENT_SECRET=e6f941fcdf8ad4793e5c5ef9d3fbd6e3c6f3a595d94d0785a24f072a8afcb386

# WEBHOOK URL - BACKEND
WEBHOOK_PUBLIC_URL=https://api.raspadinhafc.shop/webhook/pixup

# DADOS DO PAGADOR
PAYER_NAME=Fellipe Alves
PAYER_DOCUMENT=03930975106
PAYER_EMAIL=fpgtav@gmail.com

# SERVIDOR
PORT=3000
NODE_ENV=production

# CORS
ALLOWED_ORIGIN=https://raspadinhafc.shop
```

### **5. Reiniciar PM2:**
```bash
pm2 restart raspadinha-api
```

### **6. Verificar logs:**
```bash
pm2 logs raspadinha-api --lines 50
```

### **7. Testar API:**
```bash
curl https://api.raspadinhafc.shop/api/health
```

## ✅ **VERIFICAÇÕES:**

### **Status do PM2:**
```bash
pm2 status
```

### **Logs em tempo real:**
```bash
pm2 logs raspadinha-api
```

### **Reiniciar se necessário:**
```bash
pm2 restart raspadinha-api
```

## 🎯 **RESULTADO ESPERADO:**

Quando acessar `https://api.raspadinhafc.shop/api/health` deve retornar:

```json
{
  "status": "ok",
  "pixup_configured": true,
  "webhook_url": "https://api.raspadinhafc.shop/webhook/pixup",
  "payer": {
    "name": "Fellipe Alves",
    "email": "fpgtav@gmail.com",
    "document": "CONFIGURADO ✅"
  }
}
```

**SE TUDO ESTIVER OK, O PIX VAI FUNCIONAR! 🎉💰**