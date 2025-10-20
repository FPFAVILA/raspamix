export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, external_id } = req.body;

    if (!amount || !external_id) {
      return res.status(400).json({ error: "amount e external_id são obrigatórios" });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.host}`;
    const apiUrl = process.env.PIXUP_API_URL;

    const tokenResponse = await fetch(`${baseUrl}/api/pixup/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(400).json({
        error: "Falha ao gerar token Pix Up",
        details: tokenData
      });
    }

    const payer = {
      name: "Fellipe Alves",
      email: "fpgtav@gmail.com",
      document: "03930975106"
    };

    const pixPayload = {
      amount: parseFloat(amount),
      external_id: String(external_id),
      payer,
      payerQuestion: `Pagamento do pedido #${external_id}`,
      postbackUrl: `${baseUrl}/api/pixup/webhook`
    };

    const response = await fetch(`${apiUrl}/pix/qrcode`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pixPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao gerar QR Code Pix:", error);
    return res.status(500).json({ error: error.message });
  }
}
