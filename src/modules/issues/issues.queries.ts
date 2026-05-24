import pool from "../../config/db";
import type { ICreateIssueBody, IIssueFilters } from "./issues.types";

export const createIssue = async (data: ICreateIssueBody, reporterId: number) => {
    const result = await pool.query(
        `INSERT INTO issues (title, description, type, reporter_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [data.title, data.description, data.type, reporterId]
    );
    return result.rows[0] as Record<string, unknown>;
};


export const getAllIssues = async (filters: IIssueFilters) => {
    let query = `SELECT * FROM issues`;
    const values: unknown[] = [];
    const conditions: string[] = [];
    let paramIndex = 1;

    if (filters.type) {
        conditions.push(`type = $${paramIndex}`);
        values.push(filters.type);
        paramIndex++;
    }

    if (filters.status) {
        conditions.push(`status = $${paramIndex}`);
        values.push(filters.status);
        paramIndex++;
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY created_at ${filters.sort === "oldest" ? "ASC" : "DESC"}`;

    const result = await pool.query(query, values);
    return result.rows as Record<string, unknown>[];
};

export const findUsersByIds = async (ids: number[]) => {
    const result = await pool.query(
        `SELECT id, name, role FROM users WHERE id = ANY($1)`,
        [ids]
    );
    return result.rows as Record<string, unknown>[];
};