import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utility/sendResponse";
import type { ICreateIssueBody } from "./issues.types";
import { createIssue } from "./issues.queries";

export const create = async (req: Request, res: Response) => {
    try {
        const body = req.body as ICreateIssueBody;
        const reporterId = req.user!.id;
        const issue = await createIssue(body, reporterId);
        sendResponse({
            res,
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "Issue created successfully",
            data: issue,
        });
    } catch (error) {
        sendResponse({
            res,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Something went wrong",
            errors: error,
        });
    }
};