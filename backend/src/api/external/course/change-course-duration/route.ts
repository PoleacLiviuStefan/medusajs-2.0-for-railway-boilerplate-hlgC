import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { Pool } from "pg";

// Inițializează conexiunea cu PostgreSQL folosind `DATABASE_URL`
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware pentru setările CORS
const setCorsHeaders = (res: MedusaResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
    setCorsHeaders(res);
    res.status(200).end();
  };
  

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
    setCorsHeaders(res);
  
    const { courseId, duration } = req.body;
  
    if (!courseId || typeof duration !== "number" || duration <= 0) {
      return res.status(400).json({ error: "ID-ul cursului și durata validă sunt necesare" });
    }
  
    try {
      const result = await pool.query(
        `UPDATE course SET duration = $1 WHERE id = $2 RETURNING *`,
        [duration, courseId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Cursul nu a fost găsit" });
      }
  
      res.status(200).json({
        message: "Durata cursului a fost actualizată cu succes",
        updatedCourse: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };