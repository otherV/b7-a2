import express from "express";
import cors from "cors";
import "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import issuesRoutes from "./modules/issues/issues.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "DevPulse API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issuesRoutes);

export default app;