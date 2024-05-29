import express, { json } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const app = express();
const port = process.env.PORT || 8080;
import authRoutes from "./routes/auth.routes.js";
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

app.use("/", (req, res) => {
  res.json("server is running");
});

app.listen(port, () => {
  console.log(`backend server is running using ${port}`);
  mongoDB();
});
