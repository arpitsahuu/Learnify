import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../userModel";
import { ICourse } from "./courseModel";

interface IReview extends Document {
  course: ICourse["_id"];
  rating: number;
  review: string;
  user: IUser["_id"];
}

const reviewSchema: Schema<IReview> = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  review: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
