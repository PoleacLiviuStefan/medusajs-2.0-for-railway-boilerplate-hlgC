import type { MiddlewaresConfig } from "@medusajs/medusa";
import type { Request, Response, NextFunction } from "express";
  
  async function verifyFanCourierToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers.authorization?.replace("Bearer ", "");
  
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Token-ul de autentificare este necesar.",
      });
    }
  
    next();
  }
  
  export const config: MiddlewaresConfig = {
    routes: [
      {
        matcher: "/api/fan-courier/*",
        middlewares: [verifyFanCourierToken],
      },
    ],
  };
  