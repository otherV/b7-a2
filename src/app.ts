import express from "express";
import cors from "cors";
import "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "DevPulse API is running 🚀" });
});

export default app;