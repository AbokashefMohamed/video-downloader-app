import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = 3000;


app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});

await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});