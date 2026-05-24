import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { createUser, findUserByEmail } from "./auth.queries";
import type { IRegisterBody, ILoginBody, IJwtPayload } from "./auth.types";
import { sendResponse } from "../../utility/sendResponse";
import config from "../../config";

export const register = async (req: Request, res: Response) => {
    try {
        const body = req.body as IRegisterBody;

        const existing = await findUserByEmail(body.email);
        if (existing) {
            return sendResponse({
                res,
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Email already in use",
            });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await createUser(body, hashedPassword);

        sendResponse({
            res,
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "User registered successfully",
            data: user,
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

export const login = async (req: Request, res: Response) => {
    try {
        const body = req.body as ILoginBody;

        const user = await findUserByEmail(body.email);
        if (!user) {
            return sendResponse({
                res,
                statusCode: StatusCodes.UNAUTHORIZED,
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(body.password, user.password as string);
        if (!isMatch) {
            return sendResponse({
                res,
                statusCode: StatusCodes.UNAUTHORIZED,
                success: false,
                message: "Invalid email or password",
            });
        }

        const payload: IJwtPayload = {
            id: user.id as number,
            name: user.name as string,
            role: user.role as "contributor" | "maintainer",
        };

        const token = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });

        sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
            },
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