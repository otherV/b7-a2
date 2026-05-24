import pg from "pg";
import config from "./index";

const { Pool } = pg;

const pool = new Pool({
    connectionString: config.db.connectionString,
    ssl: true,
});

pool.connect()
    .then(() => console.log("PostgreSQL connected ✅"))
    .catch((err) => console.error("PostgreSQL connection error ❌:", err));

export default pool;