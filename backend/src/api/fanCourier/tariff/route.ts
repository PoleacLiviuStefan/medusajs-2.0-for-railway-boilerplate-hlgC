import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { token, tariffDetails } = req.body;

    const response = await axios.get(
      "https://api.fancourier.ro/reports/awb/internal-tariff",
      {
        params: tariffDetails,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({
      status: "success",
      tariff: response.data.data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Calcularea tarifului a eșuat.",
      error: error.message,
    });
  }
}
