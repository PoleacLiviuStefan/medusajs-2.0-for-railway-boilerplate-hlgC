import type {
    MiddlewaresConfig,
    MedusaRequest,
    MedusaResponse,
    MedusaNextFunction,
  } from "@medusajs/medusa";
  
  async function verifyFanCourierToken(
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
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
  