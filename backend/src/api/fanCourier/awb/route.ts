import { Request, Response } from "express";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  try {
    const { shipments } = req.body;

    const response = await axios.post(
      "https://api.fancourier.ro/intern-awb",
      {
        clientId: 7299254,
        shipments: shipments,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FAN_COURIER_TOKEN}`,
        },
      }
    );

    console.log("Răspuns API primit:", response.data);

    const apiResponse = response.data.response;

    if (!apiResponse || !Array.isArray(apiResponse)) {
      throw new Error("Structura răspunsului API este invalidă.");
    }

    // Verifică dacă există un AWB generat cu succes


    if (apiResponse[0].errors) {
      return res.status(422).json({
        status: "error",
        message: "Generare AWB eșuată.",
        errors: apiResponse.map((entry: any) => entry.errors),
      });
    }

    res.status(200).json({
      status: "success",
      awbNumber: apiResponse[0].awbNumber,
    });
  } catch (error: any) {
    console.error("Error Response:", error.response?.data || error.message);
    res.status(500).json({
      status: "error",
      message: "Generare AWB eșuată.",
      error: error.response?.data || error.message,
    });
  }
}
