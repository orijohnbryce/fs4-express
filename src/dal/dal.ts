import { appConfig } from "../utils/config";
import { Pool } from "pg";

export async function openDb() { }

let pool: any;
if (Number(process.env.IS_PROD) === 1) {
    pool = new Pool({
        connectionString: appConfig.DB_URL,
        ssl: {
            rejectUnauthorized: false  // For testing. Use proper CA in production.
        }
    })
} else {
    pool = new Pool({
        connectionString: appConfig.DB_URL,
    })
}

export async function getDbClient() {
    return pool.connect();
}

export async function runQuery(q: string, params: any[] = [], client: any = undefined) {
    const executor = client || pool;
    const res = await executor.query(q);
    return res.command === "SELECT" ? res.rows : { changes: res.rowCount, lastInsertRowid: res.rows?.[0]?.id };
}

// runQuery("select version();").then(res => console.log(res));