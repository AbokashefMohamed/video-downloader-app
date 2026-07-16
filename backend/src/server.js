import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import probeRoutes from "./routes/probeRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";


const PORT = process.env.PORT || 3000;
const app = express();

// allow requests from the frontend
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


// health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/probe", probeRoutes);
app.use("/api/download", downloadRoutes);
await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
