import pool from "../../config/db";
import type { ICreateIssueBody } from "./issues.types";

export const createIssue = async (data: ICreateIssueBody, reporterId: number) => {
    const result = await pool.query(
        `INSERT INTO issues (title, description, type, reporter_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [data.title, data.description, data.type, reporterId]
    );
    return result.rows[0] as Record<string, unknown>;
};