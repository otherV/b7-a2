import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import type { IJwtPayload } from "../modules/auth/auth.types";
import { sendResponse } from "../utility/sendResponse";
import config from "../config";


const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return sendResponse({
            res,
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "No token provided",
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as IJwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        sendResponse({
            res,
            statusCode: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default authenticate;