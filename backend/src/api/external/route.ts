import { Request, Response } from "express";
import { Pool } from "pg";

// Inițializează conexiunea cu PostgreSQL folosind `DATABASE_URL`
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Endpoint pentru a obține toate cursurile
export const GET = async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.STORE_CORS);
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // dacă trimiți cookie-uri/sesiuni
  try {
    const result = await pool.query(`SELECT id, name, start_dates, duration FROM course`);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nu s-au găsit cursuri" });
    }
    res.json({ courses: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint pentru a actualiza datele de start și durata unui curs
export const POST = async (req: Request, res: Response) => {
  const { id, start_dates, duration } = req.body;
  try {
    await pool.query(
      `UPDATE course SET start_dates = $1::date[], duration = $2 WHERE id = $3`,
      [start_dates, duration, id]
    );
    res.status(200).json({ message: "Cursul a fost actualizat" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint pentru a șterge o anumită dată de start dintr-un curs
export const DELETE = async (req, res) => {
  const { courseId, dateIndex } = req.body;

  if (!courseId || dateIndex === undefined) {
    return res.status(400).json({ error: "ID-ul cursului și indexul datei sunt necesare" });
  }

  try {
    // Selectează `start_dates` pentru a prelucra array-ul în memorie
    const courseResult = await pool.query(`SELECT start_dates FROM course WHERE id = $1`, [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: "Cursul nu a fost găsit" });
    }

    // Scoate elementul de la `dateIndex` din `start_dates`
    const start_dates = courseResult.rows[0].start_dates;
    start_dates.splice(dateIndex, 1);

    // Actualizează array-ul `start_dates` în baza de date
    await pool.query(
      `UPDATE course SET start_dates = $1::date[] WHERE id = $2`,
      [start_dates, courseId]
    );

    res.status(200).json({ message: "Data a fost ștearsă cu succes" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



