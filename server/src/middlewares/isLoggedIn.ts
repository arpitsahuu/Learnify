// isLoggedIn.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: any; // Define the user property here
}

export const isLoggedIn = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  // Check if user is logged in
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "accessSecret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
