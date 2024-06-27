import cloudinary from "cloudinary"

export const cloud = cloudinary.v2.config({
  cloud_name: "dcj2gzytt",
  api_key: process.env.CLOUDINARY_PUBLIC_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});