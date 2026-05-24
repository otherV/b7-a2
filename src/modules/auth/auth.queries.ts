import pool from "../../config/db";
import type { IRegisterBody } from "./auth.types";

export const createUser = async (data: IRegisterBody, hashedPassword: string) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at, updated_at`,
        [data.name, data.email, hashedPassword, data.role]
    );
    return result.rows[0] as Record<string, unknown>;
};

export const findUserByEmail = async (email: string) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0] as Record<string, unknown> | undefined;
};