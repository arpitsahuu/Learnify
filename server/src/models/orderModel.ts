import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./userModel";
import { ICourse } from "./coureModels/courseModel";

interface IOrder extends Document {
  user: IUser["_id"];
  course: ICourse["_id"];
  paymentInfo?: object;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    paymentInfo: {
      type: Object,
      razorpay_order_id:String,
      razorpay_payment_id:String,
      razorpay_signature:String,
    }
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
