import type { Request, Response } from "express";

export async function GET(
  req: Request,
  res: Response
): Promise<void> {
  res.sendStatus(200);
}
