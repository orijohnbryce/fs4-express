import { Database as DB, RunResult } from "better-sqlite3";

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