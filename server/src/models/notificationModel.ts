import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./userModel";

interface INotification extends Document {
  title: string;
  message: string;
  user: IUser["_id"];
  status: "unread" | "read";
}

const notificationSchema: Schema<INotification> = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread"
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
