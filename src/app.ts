import express from "express";
import cors from "cors";
import "./config/db";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "DevPulse API is running 🚀" });
});

app.use("/api/auth", authRoutes);

export default app;