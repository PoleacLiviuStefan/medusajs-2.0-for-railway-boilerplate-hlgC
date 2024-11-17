import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { token, shipmentDetails } = req.body;

    const response = await axios.post(
      "https://api.fancourier.ro/intern-awb",
      shipmentDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({
      status: "success",
      awbNumber: response.data.data[0].awbNumber,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Generare AWB eșuată.",
      error: error.message,
    });
  }
}
