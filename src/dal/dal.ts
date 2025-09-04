import fs from "fs";
import Database, { Database as DB, RunResult } from "better-sqlite3";
import { DB_FILE } from "../utils/config";


export async function openDb(dbFile: string = DB_FILE): DB {

    if (!fs.existsSync(dbFile)) {
        fs.writeFileSync(dbFile, "");
    }

    const db = new Database(dbFile,
        {
            fileMustExist: false,
            verbose: undefined   // do we want to see the queries? could be set to console.log            
            // verbose: console.log
        });

    return db;
}

export async function runQuery(
    sql: string,
    // params: Record<string, unknown> | unknown[] = []
): Promise<unknown[] | { changes: number; lastInsertRowid: number | bigint }> {

    const db = await openDb();
    const stmt = db.prepare(sql);  // compiles an SQL statement.

    // .run() / .all() / .get() → belong to a prepared statement (db.prepare(sql)),

    // stmt.all(...) → executes the statement and returns all matching rows as an array of objects.
    // stmt.get(...) → executes the statement and returns single first matching row as a single object.
    // stmt.run(...) → executes the statement and returns only metadata (number of rows changed, and id of the last inserted row (only meaningful for INSERT)).

    // better-sqlite3 exposes whether the statement reads rows
    if ((stmt as any).reader === true) {
        // SELECT
        return stmt.all();
        // return Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
    } else {
        // INSERT/UPDATE/DELETE
        // const res: RunResult = Array.isArray(params)
        //     ? stmt.run(...params)
        //     : stmt.run(params);
        const res: RunResult = stmt.run();
        return { changes: res.changes, lastInsertRowid: res.lastInsertRowid };
    }

    // TODO: db.close()
}