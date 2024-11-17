import fs from "fs";
import path from "path";
import axios from "axios";

export default async function refreshFanCourierToken() {
  try {
    const response = await axios.post("https://api.fancourier.ro/login", {
      username: process.env.FAN_COURIER_USERNAME, // Setează în `.env`
      password: process.env.FAN_COURIER_PASSWORD, // Setează în `.env`
    });

    console.log("Răspuns API FAN Courier:", response.data);

    const { token } = response.data;

    if (!token) {
      console.error("Token-ul nu a fost găsit în răspunsul API.");
      return;
    }

    const cacheDir = path.resolve(__dirname, "../cache");
    const filePath = path.join(cacheDir, "fan_courier_token.json");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify({ token, expiresAt: Date.now() + 86400000 }));
    console.log("Bearer token actualizat cu succes:", token);
  } catch (error) {
    console.error("Eroare la actualizarea Bearer token-ului:", error.message);
  }
}

export const config = {
  name: "refresh-fan-courier-token",
  schedule: "0 0 * * *", // Rulează zilnic la miezul nopții
};
