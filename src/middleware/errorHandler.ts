import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../utility/sendResponse";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);
    sendResponse({
        res,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Something went wrong",
        errors: err.message,
    });
};

export default errorHandler;