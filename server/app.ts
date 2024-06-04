/* imports */
require("dotenv").config({ path: "./.env" });
import express, { NextFunction, Request, Response } from "express";
import connectDB from "./src/models/dbConnection";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./src/middlewares/error";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();

/* middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();

import morgan from "morgan"
app.use(morgan("dev"));

/* router */
import router from "./src/routes/userRouter";


// app.use("/api/items", itemsRoutes);
app.use("/api/v1/user", router);

/* 404 */
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Router ${req.originalUrl} not forund `) as any;
  err.statusCode = 404;
  next(err);
});

/* error Handling */
app.use(ErrorMiddleware);

/* server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
