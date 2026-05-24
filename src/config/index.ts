import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
    port: Number(process.env.PORT),
    db: {
        connectionString: process.env.DATABASE_URL as string,
    },
    jwt: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: "7d" as const,
    },
};

export default config;