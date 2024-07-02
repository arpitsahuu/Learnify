import mongoose, { Document, Schema, Types } from "mongoose";

interface IQuery extends Document {
  _id: Types.ObjectId;
}

interface ILink extends Document {
  title: string;
  url: string;
}

export interface ICourseData extends Document {
  videoUrl: string;
  title: string;
  videoSection: string;
  description: string;
  videoLength: string;
  videoPlayer: string;
  links: [ILink];
  suggestion: string;
  query: Types.ObjectId[] | IQuery[];
  course: Types.ObjectId;
}

const courseDataSchema: Schema<ICourseData> = new Schema({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: String,
  videoPlayer: String,
  links: [{
    title:String,
    url:String,
  }],
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

const CourseData = mongoose.model<ICourseData>("courseData", courseDataSchema);

export default CourseData;
