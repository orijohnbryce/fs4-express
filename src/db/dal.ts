import Database, { Database as DB, RunResult } from "better-sqlite3";
import path from "path";
import fs from "fs";
import { DB_FILE } from "../utils/config";

export function openDb(dbFile = DB_FILE): DB {
    const full = path.resolve(process.cwd(), dbFile);
    if (!fs.existsSync(full)) fs.writeFileSync(full, "");
    const db = new Database(full, {
      fileMustExist: false,
      verbose: undefined, // set to console.log to see queries
    });
    
    db.pragma("foreign_keys = ON");
  
    return db;
  }


export function runQuery(
    db: DB,
    sql: string
): unknown[] | { changes: number; lastInsertRowid: number | bigint } {
    const stmt = db.prepare(sql);
    if ((stmt as any).reader === true) {
        return stmt.all();
    } else {
        const res: RunResult = stmt.run();
        return { changes: res.changes, lastInsertRowid: res.lastInsertRowid };
    }
}


// run with params
export function runQueryParams(
    db: DB,
    sql: string,
    params: Record<string, unknown> | unknown[] = []
): unknown[] | { changes: number; lastInsertRowid: number | bigint } {
    const stmt = db.prepare(sql);
    if ((stmt as any).reader === true) {
        return Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
    } else {
        const res: RunResult = Array.isArray(params) ? stmt.run(...params) : stmt.run(params);
        return { changes: res.changes, lastInsertRowid: res.lastInsertRowid };
    }
}