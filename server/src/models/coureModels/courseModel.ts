import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  name: string;
  description: string;
  price: number;
  estimatedPrice: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  tags: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: any[]; // Define the type for reviews
  rating: number;
  purchased: number;
}

const courseSchema: Schema<ICourse> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is Required']
  },
  description: {
    type: String,
    required: [true, "Course Description is Required"]
  },
  price: {
    type: Number,
    required: [true, "Price is Required"]
  },
  estimatedPrice: {
    type: Number,
    required: [true, "Estimated Price is Required"]
  },
  thumbnail: {
    public_id: {
      type: String,
      // required: true
    },
    url: {
      type: String,
      // required: true
    }
  },
  tags: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: [true, "Course Level is Required"]
  },
  demoUrl: {
    type: String,
    required: true
  },
  benefits: [{ title: String }],
  prerequisites: [{ title: String }],
  reviews: [],
  rating: {
    type: Number,
    default: 0
  },
  purchased: {
    type: Number,
    default: 0
  }
});

const Course = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
