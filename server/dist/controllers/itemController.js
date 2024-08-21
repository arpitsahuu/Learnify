"use strict";
// import { Request, Response } from "express";
// import Item, { IItem } from "../models/indexModel";
// import catchAsyncError from "../middlewares/catchAsyncError";
// export const getAllItems = catchAsyncError(
//   async (req: Request, res: Response): Promise<void> => {
//     const items: IItem[] = await Item.find();
//     res.status(200).json(items);
//   }
// );
// export const createItem = catchAsyncError(
//   async (req: Request, res: Response): Promise<void> => {
//     const { name, quantity } = req.body;
//     const newItem: IItem = new Item({ name, quantity });
//     const savedItem: IItem = await newItem.save();
//     await newItem.save();
//     res.status(200).json(savedItem);
//   }
// );
// export const updateItem = catchAsyncError(
//   async (req: Request, res: Response): Promise<void> => {
//     const { name, quantity } = req.body;
//     const itemId: string = req.params.id;
//     const updatedItem: IItem | null = await Item.findByIdAndUpdate(
//       itemId,
//       {
//         name,
//         quantity,
//       },
//       { new: true }
//     );
//     if (!updatedItem) {
//       res.status(404).json({ message: "Item not found" });
//       return;
//     }
//     const saveItem: IItem = await updatedItem.save();
//     res.status(200).json(saveItem);
//   }
// );
// export const deleteItem = catchAsyncError(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const itemId: string = req.params.id;
//     const deletedItem: IItem | null = await Item.findByIdAndDelete(itemId);
//     if (!deletedItem) {
//       res.status(404).json({ message: "Item not found" });
//       return;
//     }
//     res.json({ message: "Item deleted successfully" });
//   }
// );
