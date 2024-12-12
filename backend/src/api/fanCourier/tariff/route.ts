import { Request, Response } from "express";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  try {
    const { tariffDetails } = req.body;

    // Construire URL complet pentru debugging
    const baseUrl = "https://api.fancourier.ro/reports/awb/internal-tariff";
    const queryParams = {
      ...tariffDetails,
      "info[service]": "Cont Colector",
      "info[payment]": "expeditor",
      "info[packages][parcel]": "1",
      "info[weight]": "1",
      clientId: process.env.FAN_COURIER_CLIENT_ID,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    const fullUrl = `${baseUrl}?${queryString}`;

    console.log("Requesting URL:", fullUrl);

    // Efectuează cererea GET
    const response = await axios.get(baseUrl, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${process.env.FAN_COURIER_TOKEN}`,
      },
    });

    // Trimite răspunsul către client
    res.status(200).json({
      status: "success",
      tariff: response.data.data,
    });
  } catch (error: any) {
    console.error(
      "Fan Courier API Error: ",
      error.response?.data || error.message
    );

    res.status(500).json({
      status: "error",
      message: "Calcularea tarifului a eșuat.",
      error: error.response?.data || error.message,
    });
  }
}
