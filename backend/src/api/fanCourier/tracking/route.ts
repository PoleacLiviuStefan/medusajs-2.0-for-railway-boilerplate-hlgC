import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import axios from "axios";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const { awb } = req.query;

    const response = await axios.get(
      `https://api.fancourier.ro/reports/awb/tracking?awb[]=${awb}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({
      status: "success",
      tracking: response.data.data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Tracking-ul AWB-ului a eșuat.",
      error: error.message,
    });
  }
}
