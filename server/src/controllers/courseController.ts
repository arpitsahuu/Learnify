import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import errorHandler from "../utils/errorHandler";
import axios from "axios";

export const generateVideoUrl = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { videoId } = req.body;
            const response = await axios.post(
              `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
              { ttl: 300 },
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
                },
              }
            );
            res.json(response.data);
          } catch (error: any) {
            return next(new errorHandler(error.message, 400));
        }
    }
  );