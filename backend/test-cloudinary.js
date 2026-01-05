import dotenv from "dotenv";
dotenv.config(); // 🚨 REQUIRED

import { v2 as cloudinary } from "cloudinary";

console.log("ENV CHECK FROM TEST:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const res = await cloudinary.uploader.upload(
  "https://res.cloudinary.com/demo/image/upload/sample.jpg"
);

console.log("UPLOAD SUCCESS:", res.secure_url);
