import { Request, Response } from "express";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Middleware pentru setările CORS
const setCorsHeaders = (res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};


// Funcție pentru a răspunde la cererile OPTIONS (preflight)
export const OPTIONS = async (req: Request, res: Response) => {
  setCorsHeaders(res);
  res.status(200).end();
};

// Endpoint DELETE - Șterge un curs
export const DELETE = async (req: Request, res: Response) => {
  setCorsHeaders(res);

  const { courseId } = req.body;
  try {
    await pool.query(`DELETE FROM course WHERE id = $1`, [courseId]);
    res.status(200).json({ message: "Cursul a fost șters cu succes" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint POST - Adaugă o dată de start și durata unui curs
export const POST = async (req: Request, res: Response) => {
  setCorsHeaders(res);

  const { courseId, newDate} = req.body;
  try {
    await pool.query(
      `UPDATE course
SET start_dates = array_append(COALESCE(start_dates, '{}'), $1::date)
WHERE id = $2;
`,
      [newDate,courseId]
    );
    res.status(200).json({ message: "Data de start și durata au fost adăugate cu succes" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint PATCH - Actualizează numele unui curs
export const PATCH = async (req:Request, res:Response) => {
  setCorsHeaders(res);

  const { courseId, newName } = req.body;

  try {
    await pool.query(`UPDATE course SET name = $1 WHERE id = $2`, [newName, courseId]);
    res.status(200).json({ message: "Numele cursului a fost actualizat cu succes" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint GET - Obține toate cursurile cu datele de start și durata
export const GET = async (req:Request, res:Response) => {
  setCorsHeaders(res);

  try {
    const result = await pool.query(`SELECT id, name, start_dates, duration FROM course`);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nu există cursuri disponibile" });
    }

    res.status(200).json({ courses: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
