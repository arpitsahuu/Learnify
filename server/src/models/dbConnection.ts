import mongoose from "mongoose";

const mongodbUri : string = process.env.MONGODB_URL || "";

export const connectDB = async () => {
  try {
    await mongoose.connect(mongodbUri).then((data:any) =>{
      console.log(`Connected to MongoDB ${data.connection.host}`);
    })
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
