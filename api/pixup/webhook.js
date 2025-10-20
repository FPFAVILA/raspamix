export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body.requestBody;

    console.log("Webhook Pix Up recebido:", JSON.stringify(event, null, 2));

    if (event?.status === "PAID") {
      console.log("Pagamento confirmado:", {
        transactionId: event.transactionId,
        external_id: event.external_id,
        amount: event.amount,
        dateApproval: event.dateApproval,
        payer: event.creditParty
      });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook Pix Up:", error);
    return res.status(500).json({ error: error.message });
  }
}
