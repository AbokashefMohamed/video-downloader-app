import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import probeRoutes from "./routes/probeRoutes.js";

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/probe", probeRoutes);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
