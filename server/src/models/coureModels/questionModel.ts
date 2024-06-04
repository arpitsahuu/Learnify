import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../userModel";
import { ICourse } from "./courseModel";

interface IQuery extends Document {
  user: IUser["_id"];
  query: string;
  reply: string;
  courseData: ICourse["_id"];
}

const querySchema: Schema<IQuery> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  query: {
    type: String,
    required: true
  },
  reply: String,
  courseData: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true
  }
});

const Query = mongoose.model<IQuery>("Query", querySchema);

export default Query;
