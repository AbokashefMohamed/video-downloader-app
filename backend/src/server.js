import dotenv from "dotenv";
dotenv.config();


import express from "express";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import historyRoutes from "./routes/historyRoutes.js"
const PORT = 3000;

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});

await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});