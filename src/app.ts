import express from "express";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import issuesRoutes from "./modules/issues/issues.routes";
import errorHandler from "./middleware/errorHandler";
import { sendResponse } from "./utility/sendResponse";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "DevPulse API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issuesRoutes);

app.use((req, res) => {
    sendResponse({
        res,
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

app.use(errorHandler);

export default app;