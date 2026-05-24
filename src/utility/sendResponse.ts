import type { Response } from "express";

interface ISendResponse {
    res: Response;
    statusCode: number;
    success: boolean;
    message: string;
    data?: unknown;
    errors?: unknown;
}

export const sendResponse = ({
    res,
    statusCode,
    success,
    message,
    data,
    errors,
}: ISendResponse) => {
    const response: Record<string, unknown> = {
        success,
        message,
    };

    if (data !== undefined) response.data = data;
    if (errors !== undefined) response.errors = errors;

    res.status(statusCode).json(response);
};