import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utility/sendResponse";
import type { ICreateIssueBody, IIssueFilters, IUpdateIssueBody, IUpdateStatusBody } from "./issues.types";
import { createIssue, getAllIssues, getIssueById, findUsersByIds, updateIssue, updateIssueStatus, deleteIssue } from "./issues.queries";

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

export const getAll = async (req: Request, res: Response) => {
    try {
        const filters: IIssueFilters = {};
        const { sort, type, status } = req.query as {
            sort?: "newest" | "oldest";
            type?: "bug" | "feature_request";
            status?: "open" | "in_progress" | "resolved";
        };

        if (sort) filters.sort = sort;
        if (type) filters.type = type;
        if (status) filters.status = status;

        const issues = await getAllIssues(filters);

        const reporterIds = [...new Set(issues.map((i) => i["reporter_id"] as number))];
        const reporters = await findUsersByIds(reporterIds);
        const reporterMap = Object.fromEntries(reporters.map((r) => [r["id"], r]));

        const data = issues.map((issue) => ({
            ...issue,
            reporter: reporterMap[issue["reporter_id"] as number] ?? null,
        }));

        sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issues retrieved successfully",
            data,
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

export const getOne = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            return sendResponse({
                res,
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Invalid ID format provided",
                errors: "ID must be a valid number",
            });
        }

        const issue = await getIssueById(id);
        if (!issue) {
            return sendResponse({
                res,
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue not found",
            });
        }

        const reporters = await findUsersByIds([issue["reporter_id"] as number]);
        const data = { ...issue, reporter: reporters[0] ?? null };

        sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue retrieved successfully",
            data,
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

export const update = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        if (isNaN(id)) {
            return sendResponse({
                res,
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Invalid ID format provided",
                errors: "ID must be a valid number",
            });
        }

        const body = req.body as IUpdateIssueBody;
        const { role, id: userId } = req.user!;

        const issue = await getIssueById(id);
        if (!issue) {
            return sendResponse({
                res,
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue not found",
            });
        }

        if (role === "contributor") {
            if (issue["reporter_id"] !== userId) {
                return sendResponse({
                    res,
                    statusCode: StatusCodes.FORBIDDEN,
                    success: false,
                    message: "You can only update your own issues",
                });
            }
            if (issue["status"] !== "open") {
                return sendResponse({
                    res,
                    statusCode: StatusCodes.CONFLICT,
                    success: false,
                    message: "You can only update open issues",
                });
            }
        }

        const updated = await updateIssue(id, body);
        sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue updated successfully",
            data: updated,
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

export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            return sendResponse({
                res,
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Invalid ID format provided",
                errors: "ID must be a valid number",
            });
        }


        const { status } = req.body as IUpdateStatusBody;

        const issue = await getIssueById(id);
        if (!issue) {
            return sendResponse({
                res,
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue not found",
            });
        }

        const updated = await updateIssueStatus(id, status);
        sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: "Issue status updated successfully",
            data: updated,
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

export const remove = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            return sendResponse({
                res,
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Invalid ID format provided",
                errors: "ID must be a valid number",
            });
        }

        const issue = await getIssueById(id);
        if (!issue) {
            return sendResponse({
                res,
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue not found",
            });
        }

        await deleteIssue(id);
        sendResponse({
            res,
            statusCode: StatusCodes.NO_CONTENT,
            success: true,
            message: "Issue deleted successfully",
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