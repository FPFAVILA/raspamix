export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const clientId = process.env.PIXUP_CLIENT_ID;
    const clientSecret = process.env.PIXUP_CLIENT_SECRET;
    const apiUrl = process.env.PIXUP_API_URL;

    if (!clientId || !clientSecret || !apiUrl) {
      return res.status(500).json({ error: "Configuração Pix Up incompleta" });
    }

    const credentials = `${clientId}:${clientSecret}`;
    const base64Credentials = Buffer.from(credentials).toString("base64");

    const response = await fetch(`${apiUrl}/oauth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao gerar token Pix Up:", error);
    return res.status(500).json({ error: error.message });
  }
}
