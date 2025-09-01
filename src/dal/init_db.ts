// db.ts
import fs from "fs";
import path from "path";
import Database, { Database as DB, RunResult } from "better-sqlite3";
import { DB_FILE } from "../config";
// import { dbFile } from "../config";


export function openDb(dbFile:string = DB_FILE): DB {
    
    if (!fs.existsSync(dbFile)) {
        fs.writeFileSync(dbFile, "");
    }

    const db = new Database(dbFile,
        {
            fileMustExist: false,
            // verbose: undefined   // do we want to see the queries? could be set to console.log            
            verbose: console.log
        });

    return db;
}


export function initCarsSchema(db: DB): void {

    /*
    ddl stands for Data Definition Language 
    – the part of SQL that defines schema (CREATE, ALTER, DROP …).
    */
    const ddl = `
    CREATE TABLE IF NOT EXISTS USER (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      name   TEXT    NOT NULL,
      email  TEXT    NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS CAR (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      name    TEXT    NOT NULL,
      km      INTEGER NOT NULL CHECK (km >= 0),
      engine  REAL    NOT NULL CHECK (engine > 0),
      year    INTEGER NOT NULL,
      price   REAL    NOT NULL CHECK (price >= 0)
    );

    CREATE TABLE IF NOT EXISTS RENT (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      car_id      INTEGER NOT NULL,
      user_id     INTEGER NOT NULL,
      start_date  TEXT    NOT NULL, -- ISO 8601
      end_date    TEXT,             -- ISO 8601
      returned    INTEGER NOT NULL DEFAULT 0 CHECK (returned IN (0,1)),
      CONSTRAINT fk_car  FOREIGN KEY (car_id)  REFERENCES CAR(id)  ON DELETE CASCADE,
      CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES USER(id) ON DELETE CASCADE 
    );

    CREATE INDEX IF NOT EXISTS idx_rent_car  ON RENT(car_id);
    CREATE INDEX IF NOT EXISTS idx_rent_user ON RENT(user_id);
  `;

    //   db.exec(sql) → runs a batch of SQL statements (schema creation, multiple commands at once).

    db.exec("BEGIN");
    try {
        db.exec(ddl);
        db.exec("COMMIT");
    } catch (e) {
        db.exec("ROLLBACK");
        throw e;
    }
}

/**
 * Runs a parameterized SQL statement.
 * - For SELECT-like statements, returns rows (array of objects).
 * - For INSERT/UPDATE/DELETE, returns { changes, lastInsertRowid }.
 */
export function runQuery(
    db: DB,
    sql: string,
    // params: Record<string, unknown> | unknown[] = []
): unknown[] | { changes: number; lastInsertRowid: number | bigint } {

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
}

/* ----------------------- Example usage (safe to remove) -------------------- */

const db = openDb();

initCarsSchema(db);

db.close();

