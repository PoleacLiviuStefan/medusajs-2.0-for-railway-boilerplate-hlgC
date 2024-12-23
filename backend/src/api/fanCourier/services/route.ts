import { Request, Response } from "express";
import axios from "axios";

export async function GET(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    const response = await axios.get("https://api.fancourier.ro/reports/services", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status(200).json({
      status: "success",
      services: response.data.data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Nu s-au putut obține serviciile.",
      error: error.message,
    });
  }
}
