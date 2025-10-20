# 🔧 GUIA DE DEBUG DO WEBHOOK

## 🚨 **PROBLEMA IDENTIFICADO:**
O webhook não está confirmando pagamentos. Vamos resolver isso!

## ✅ **SOLUÇÕES IMPLEMENTADAS:**

### 1. **🚀 RESPOSTA IMEDIATA DO WEBHOOK**
- ✅ Responde `200 OK` IMEDIATAMENTE
- ✅ Processa em background para evitar timeout
- ✅ Aceita múltiplas estruturas de payload

### 2. **🔍 VERIFICAÇÃO MAIS FLEXÍVEL**
- ✅ Aceita `PAID`, `APPROVED`, `CONFIRMED`
- ✅ Não exige `transactionType` obrigatório
- ✅ Logs reduzidos para melhor performance

### 3. **⚡ PERFORMANCE MELHORADA**
- ✅ Verificação a cada 2 segundos (era 3s)
- ✅ Timeout reduzido para 5s (era 10s)
- ✅ Logs otimizados

## 🧪 **COMO TESTAR:**

### **Método 1: Teste Real**
1. Gere um PIX no site
2. Pague com seu banco
3. Aguarde 2-5 segundos
4. Saldo deve ser adicionado automaticamente

### **Método 2: Logs da VPS**
```bash
# Ver logs em tempo real
pm2 logs raspadinha-api --lines 50

# Reiniciar se necessário
pm2 restart raspadinha-api
```

### **Método 3: Teste Manual do Webhook**
```bash
# Simular webhook na VPS
curl -X POST https://api.raspadinhafc.shop/webhook/pixup \
  -H "Content-Type: application/json" \
  -d '{
    "requestBody": {
      "transactionType": "RECEIVEPIX",
      "transactionId": "test_123",
      "external_id": "balance_test",
      "amount": 16.90,
      "status": "PAID",
      "dateApproval": "2024-01-01 12:00:00"
    }
  }'
```

## 🎯 **CHECKLIST DE VERIFICAÇÃO:**

- [ ] Backend atualizado na VPS
- [ ] PM2 reiniciado
- [ ] Logs mostrando webhooks recebidos
- [ ] Frontend verificando a cada 2s
- [ ] Pagamento teste realizado

## 🚨 **SE AINDA NÃO FUNCIONAR:**

1. **Verificar se PixUp está enviando webhook:**
   - Logs devem mostrar `📨 [WEBHOOK] RECEBIDO`
   
2. **Verificar estrutura do payload:**
   - PixUp pode estar enviando formato diferente
   
3. **Testar URL webhook diretamente:**
   - `https://raspadinhafc.shop/webhook/pixup`
   - Deve retornar 200 OK

**AGORA DEVE FUNCIONAR! 🚀💰**