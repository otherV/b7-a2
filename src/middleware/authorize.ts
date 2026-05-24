import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../utility/sendResponse";

const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return sendResponse({
                res,
                statusCode: StatusCodes.FORBIDDEN,
                success: false,
                message: "You do not have permission to perform this action",
            });
        }
        next();
    };
};

export default authorize;