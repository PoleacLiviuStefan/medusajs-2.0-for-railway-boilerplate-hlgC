import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { Pool } from "pg";

// Inițializează conexiunea cu PostgreSQL folosind `DATABASE_URL`
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Endpoint pentru a obține toate cursurile
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // dacă trimiți cookie-uri/sesiuni
  try {
    const result = await pool.query(`SELECT id, name, start_dates, end_dates FROM course`);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nu s-au găsit cursuri" });
    }
    res.json({ courses: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint pentru a actualiza datele de start și de sfârșit ale unui curs
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id, start_dates, end_dates } = req.body;
  try {
    await pool.query(
      `UPDATE course SET start_dates = $1::date[], end_dates = $2::date[] WHERE id = $3`,
      [start_dates, end_dates, id]
    );
    res.status(200).json({ message: "Cursul a fost actualizat" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint pentru a șterge o anumită dată de start și de sfârșit dintr-un curs
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { courseId, startDateToDelete, endDateToDelete } = req.body;

  try {
    // Verificăm dacă `courseId`, `startDateToDelete`, și `endDateToDelete` sunt furnizate
    if (!courseId || !startDateToDelete || !endDateToDelete) {
      return res.status(400).json({ error: "ID-ul cursului, data de start și data de sfârșit sunt necesare" });
    }

    // Ștergem `startDateToDelete` și `endDateToDelete` din array-urile `start_dates` și `end_dates`
    const result = await pool.query(
      `UPDATE course
      SET start_dates = array_remove(start_dates, $2::date),
          end_dates = array_remove(end_dates, $3::date)
      WHERE id = $1
      RETURNING *`, // Returnează linia actualizată pentru confirmare
      [courseId, startDateToDelete, endDateToDelete]
    );

    // Verificăm dacă ștergerea a avut loc cu succes
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cursul nu a fost găsit sau datele nu au existat" });
    }

    res.status(200).json({ message: "Datele de start și sfârșit au fost șterse cu succes" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
