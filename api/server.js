import express, { json } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const port = process.env.PORT || 8080;

import authRoutes from "./routes/auth.routes.js";

import userRoutes from "./routes/user.routes.js";

import mongoDB from "./db/connectMongo.js";

// Middleware

// Default middleware
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3rd Party middleware
app.use(cors());
app.use(cookieParser());

// Database Connection

// Main API URL Here

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

// root api
app.use("/", (req, res) => {
  res.json("server is running");
});

app.listen(port, () => {
  console.log(`backend server is running using ${port}`);
  mongoDB();
});
