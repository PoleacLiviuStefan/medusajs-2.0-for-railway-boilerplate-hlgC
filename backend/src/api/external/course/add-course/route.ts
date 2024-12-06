import { Request, Response } from "express";
import { Pool } from "pg";

// Inițializează conexiunea cu PostgreSQL folosind `DATABASE_URL`
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const POST = async (req: Request, res: Response) => {
  const { name, duration } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Numele cursului este necesar" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO course (name, start_dates, duration) VALUES ($1, $2, $3) RETURNING *`,
      [name, [], duration || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
