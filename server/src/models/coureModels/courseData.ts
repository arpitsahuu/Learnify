import mongoose, { Document, Schema, Types } from "mongoose";

interface IQuery extends Document {
  _id: Types.ObjectId;
}

export interface ICourseData extends Document {
  videoUrl: string;
  title: string;
  videoSection: string;
  description: string;
  videoLength: number;
  videoPlayer: string;
  links: string;
  suggestion: string;
  query: Types.ObjectId[] | IQuery[];
  course: Types.ObjectId;
}

const courseDataSchema: Schema<ICourseData> = new Schema({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: String,
  suggestion: String,
  query: [{
    type: Schema.Types.ObjectId,
    ref: 'Query'
  }],
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
});

const CourseData = mongoose.model<ICourseData>("CourseData", courseDataSchema);

export default CourseData;
