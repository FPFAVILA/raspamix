# Integração Pix Up - Vercel Serverless Functions

## 🎯 Objetivo
Integração completa da API Pix Up usando serverless functions da Vercel, sem necessidade de VPS ou backend externo.

## 📂 Estrutura de Arquivos

```
/api/pixup/
  ├── token.js      → Gera token de autenticação Pix Up
  ├── qrcode.js     → Gera QR Code Pix com dados fixos do pagador
  └── webhook.js    → Recebe confirmação de pagamento (opcional)
```

## 🔑 Variáveis de Ambiente (Vercel)

Configure essas variáveis no painel da Vercel (Settings → Environment Variables):

```
PIXUP_CLIENT_ID=fpfavila_0241736713049671
PIXUP_CLIENT_SECRET=385c2026f228aefce8109fba489ac639f6729b8a4d5da10960b159f7c80a98ab
PIXUP_API_URL=https://api.pixupbr.com/v2
NEXT_PUBLIC_BASE_URL=https://raspadinhafc.shop
```

## 📘 Endpoints Criados

### 1. POST /api/pixup/token
Gera o token de acesso Bearer para autenticação na API Pix Up.

**Resposta de Sucesso (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 2. POST /api/pixup/qrcode
Gera o QR Code Pix com dados fixos do pagador.

**Body da Requisição:**
```json
{
  "amount": 15.00,
  "external_id": "pedido_12345"
}
```

**Resposta de Sucesso (200):**
```json
{
  "transactionId": "c327ce8bee2a18565ec2m1zdu6px2keu",
  "external_id": "pedido_12345",
  "qrcode": "00020126580014br.gov.bcb.pix...",
  "qrcodeImage": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "amount": 15.00,
  "status": "PENDING"
}
```

### 3. POST /api/pixup/webhook
Recebe notificações de pagamento da Pix Up (opcional).

**Payload Recebido:**
```json
{
  "requestBody": {
    "transactionType": "RECEIVEPIX",
    "transactionId": "c327ce8bee2a18565ec2m1zdu6px2keu",
    "external_id": "pedido_12345",
    "amount": 15.00,
    "status": "PAID",
    "dateApproval": "2024-10-07 16:07:10",
    "creditParty": {
      "name": "Monkey D. Luffy",
      "email": "monkeydluffy@gmail.com",
      "taxId": "999999999"
    }
  }
}
```

## 👤 Dados Fixos do Pagador

Todos os pagamentos usam automaticamente estes dados:

```javascript
{
  name: "Fellipe Alves",
  email: "fpgtav@gmail.com",
  document: "03930975106"
}
```

## 🔄 Fluxo de Funcionamento

1. Frontend chama `/api/pixup/qrcode` com valor e ID do pedido
2. A função solicita token em `/api/pixup/token`
3. Com o token, gera o QR Code na API Pix Up
4. Retorna o QR Code (imagem e código "copia e cola") para o frontend
5. Quando o pagamento é confirmado, Pix Up envia webhook para `/api/pixup/webhook`

## 💻 Como Usar no Frontend

```javascript
// Exemplo de chamada para gerar Pix
async function gerarPix(valor, pedidoId) {
  try {
    const response = await fetch('/api/pixup/qrcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: valor,
        external_id: pedidoId
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Usar data.qrcodeImage para exibir QR Code
      // Usar data.qrcode para "copia e cola"
      console.log('QR Code gerado:', data);
    } else {
      console.error('Erro ao gerar Pix:', data);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}
```

## ✅ Vantagens Desta Implementação

- ✅ 100% compatível com Vercel (sem VPS necessário)
- ✅ Sem banco de dados externo
- ✅ Dados do pagador fixos (evita erros)
- ✅ Token gerado automaticamente
- ✅ Webhook configurado (opcional)
- ✅ Código limpo e funcional

## 🚀 Deploy na Vercel

1. Faça push do código para o repositório Git
2. Configure as variáveis de ambiente no painel da Vercel
3. A Vercel detectará automaticamente as funções em `/api/`
4. As rotas estarão disponíveis em:
   - `https://seusite.vercel.app/api/pixup/token`
   - `https://seusite.vercel.app/api/pixup/qrcode`
   - `https://seusite.vercel.app/api/pixup/webhook`

## 🔒 Segurança

- Credenciais armazenadas apenas em variáveis de ambiente
- Nunca expostas no código do frontend
- Token gerado dinamicamente a cada requisição
- HTTPS obrigatório na Vercel

## 📝 Notas Importantes

- O webhook é opcional - a geração de Pix funciona sem ele
- Os dados do pagador são sempre os mesmos (requisito do projeto)
- Não há persistência de dados - tudo é processado em tempo real
- A API Pix Up retorna o status "PENDING" - a confirmação vem via webhook
