import fs from "fs";
import path from "path";
import axios from "axios";

export default async function refreshFanCourierToken() {
  try {
    // Apelează API-ul pentru autentificare
    const response = await axios.post("https://api.fancourier.ro/login", {
      username: process.env.FAN_COURIER_USERNAME, // Setează în `.env`
      password: process.env.FAN_COURIER_PASSWORD, // Setează în `.env`
    });

    console.log("Răspuns API FAN Courier:", response.data);

    // Extragere token și data expirării din răspuns
    const { token, expires_in } = response.data;

    if (!token) {
      console.error("Token-ul nu a fost găsit în răspunsul API.");
      return;
    }

    // Calculăm timestamp-ul expirării
    const expiresAt = Date.now() + (expires_in || 86400) * 1000; // `expires_in` în secunde

    // Salvăm token-ul în cache
    const cacheDir = path.resolve(__dirname, "../cache");
    const filePath = path.join(cacheDir, "fan_courier_token.json");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    fs.writeFileSync(
      filePath,
      JSON.stringify({ token, expiresAt }, null, 2) // Formatare JSON
    );

    console.log("Bearer token actualizat cu succes:", token);
  } catch (error) {
    // Gestionăm erorile
    if (axios.isAxiosError(error)) {
      console.error(
        "Eroare la actualizarea Bearer token-ului:",
        error.response?.data || error.message
      );
    } else {
      console.error("Eroare neașteptată:", error.message);
    }
  }
}

export const config = {
  name: "refresh-fan-courier-token",
  schedule: "0 0 * * *", // Rulează zilnic la miezul nopții
};
