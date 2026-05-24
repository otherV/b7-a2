import pg from "pg";
import config from "./index";

const { Pool } = pg;

const pool = new Pool({
    connectionString: config.db.connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client ⚠️:', err.message);
});

pool.connect()
    .then(() => console.log("PostgreSQL connected ✅"))
    .catch((err) => console.error("PostgreSQL connection error ❌:", err));

export default pool;