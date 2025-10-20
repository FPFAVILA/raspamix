# Eventos do Facebook Pixel - Documentação

## Estrutura Simplificada

Este projeto usa eventos **simplificados** e **desduplicados** entre frontend e backend.

## Eventos Implementados

### 1. PageView (Automático)
- **Quando**: Ao carregar a página inicial
- **Onde**: `index.html`
- **Dados**: Básicos do pixel

### 2. Lead (Frontend)
- **Quando**: Usuário ganha o iPhone
- **Onde**: `WinningScreen.tsx`
- **Dados**:
  - content_name: "iPhone 13 Pro Max - Ganhou"
  - content_category: "Prize"
  - value: 4899
  - currency: "BRL"

### 3. Purchase (Frontend + Backend Desduplicado)

#### 3.1. Adição de Saldo
- **Quando**: Pagamento PIX confirmado para adicionar saldo
- **Onde**:
  - Frontend: `AddBalanceModal.tsx`
  - Backend: `server.js` (webhook)
- **Desduplicação**: event_id = `purchase_balance_{transactionId}`
- **Dados**:
  - content_name: "Saldo Raspadinha"
  - content_category: "Gaming Credits"
  - value: {valor pago}
  - currency: "BRL"

#### 3.2. Pagamento de Frete
- **Quando**: Pagamento PIX confirmado para frete expresso
- **Onde**:
  - Frontend: `PrizeRedemptionFlow.tsx`
  - Backend: `server.js` (webhook)
- **Desduplicação**: event_id = `purchase_shipping_{transactionId}`
- **Dados**:
  - content_name: "iPhone 13 Pro Max - Frete {tipo}"
  - content_category: "Shipping"
  - value: {valor do frete}
  - currency: "BRL"

## Desduplicação

### Como Funciona

1. **Frontend gera event_id único**
   - Formato: `{evento}_{timestamp}_{random}`
   - Exemplo: `purchase_shipping_1234567890_abc123`

2. **Frontend envia para Backend via API**
   - Dados incluem: customer_data, product_data, event_id

3. **Backend armazena no cache**
   - Webhook recebe confirmação de pagamento
   - Backend verifica se event_id já foi processado
   - Se não, envia para Conversions API com mesmo event_id
   - Se sim, ignora (desduplicação)

4. **Facebook dedup lica automaticamente**
   - Facebook recebe evento do Pixel (frontend)
   - Facebook recebe evento da API (backend)
   - Como ambos têm mesmo event_id, Facebook conta apenas 1 vez

### Benefícios

- ✅ Não duplica eventos
- ✅ Maior precisão de rastreamento
- ✅ Melhor otimização de campanhas
- ✅ Eventos separados por domínio (raspadinha/zkimports)

## Eventos Removidos

Os seguintes eventos foram **removidos** para simplificação:

- ~~ViewContent~~ (modal de prêmio em dinheiro)
- ~~AddPaymentInfo~~ (redundante com Purchase)
- ~~InitiateCheckout~~ (substituído por Lead)

## Fluxo de Eventos

```
1. Usuário acessa site → PageView (automático)
2. Usuário ganha iPhone → Lead (frontend)
3. Usuário paga frete → Purchase (frontend + backend desduplicado)
4. Usuário adiciona saldo → Purchase (frontend + backend desduplicado)
```

## Configuração do Backend

O backend suporta **múltiplos domínios** com pixels diferentes:

- **raspadinhafc.shop**: Pixel ID `1317059129421017`
- **zkimports.pro**: Pixel ID `1309804263550614`

Cada domínio tem seus próprios:
- Access Token
- Cache de eventos processados
- Desduplicação separada

## Logs e Debugging

### Frontend
```javascript
console.log(`📊 [FB PIXEL] Evento: ${eventName} | ID: ${eventId}`);
```

### Backend
```javascript
console.log('📊 [FB PIXEL] Evento enviado: Purchase');
console.log('📊 Event ID:', eventId);
console.log('📊 Domínio:', domain);
```

## Testes

Para testar a desduplicação:

1. Abra DevTools Console
2. Monitore logs do Facebook Pixel
3. Complete um fluxo de pagamento
4. Verifique que o event_id é o mesmo no frontend e backend
5. Confirme no Facebook Events Manager que aparece apenas 1 evento
