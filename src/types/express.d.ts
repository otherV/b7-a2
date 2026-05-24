import type { IJwtPayload } from "../modules/auth/auth.types";

declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload;
        }
    }
}

export { };