import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import errorHandler from "../utils/errorHandler";
import axios from "axios";
import { redis } from "../models/redis";
import LayoutModel from "../models/layout.model";

// CREATET LAYOUT
export const createLayout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { type, faq, categories } = req.body;
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findById(id);
      if (isTypeExist) {
        return next(new errorHandler(`${type} already exist`, 400));
      }
      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }
      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);

// EDIT LAYOUT
export const editLayout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({type});
      console.log(isTypeExist)
      if (isTypeExist) {
        if (type === "FAQ") {
          const { faq } = req.body;
          const FaqItem = await LayoutModel.findOne({ type: "FAQ" });
          const faqItems = await Promise.all(
            faq.map(async (item: any) => {
              return {
                question: item.question,
                answer: item.answer,
              };
            })
          );
          await LayoutModel.findByIdAndUpdate(FaqItem?._id, {
            type: "FAQ",
            faq: faqItems,
          });
        }
        if (type === "Categories") {
          const { categories } = req.body;
          const categoriesData = await LayoutModel.findOne({
            type: "Categories",
          });
          const categoriesItems = await Promise.all(
            categories.map(async (item: any) => {
              return {
                title: item.title,
              };
            })
          );
          await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
            type: "Categories",
            categories: categoriesItems,
          });
        }

        res.status(200).json({
          success: true,
          message: "Layout Updated successfully",
        });
      } else {
        console.log("enter else")
        if (type === "FAQ") {
          const { faq } = req.body;
          const faqItems = await Promise.all(
            faq.map(async (item: any) => {
              return {
                question: item.question,
                answer: item.answer,
              };
            })
          );
          await LayoutModel.create({ type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
          const { categories } = req.body;
          const categoriesItems = await Promise.all(
            categories.map(async (item: any) => {
              return {
                title: item.title,
              };
            })
          );
          await LayoutModel.create({
            type: "Categories",
            categories: categoriesItems,
          });
        }

        res.status(200).json({
          success: true,
          message: "Layout created successfully",
        });
      }
    } catch (error: any) {
      console.log(error);

      return next(new errorHandler(error.message, 500));
    }
  }
);

// GET LAYOUT BY TYPE
export const getLayoutByType = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type } = req.params;
      const layout = await LayoutModel.findOne({ type });
      res.status(201).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new errorHandler(error.message, 500));
    }
  }
);
