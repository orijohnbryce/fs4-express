"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDb = openDb;
exports.runQuery = runQuery;
const fs_1 = __importDefault(require("fs"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const config_1 = require("../utils/config");
// import { DB_FILE } from "../utils/config";
function openDb() {
    return __awaiter(this, arguments, void 0, function* (dbFile = config_1.appConfig.DB_FILE) {
        if (!fs_1.default.existsSync(dbFile)) {
            fs_1.default.writeFileSync(dbFile, "");
        }
        const db = new better_sqlite3_1.default(dbFile, {
            fileMustExist: false,
            verbose: undefined // do we want to see the queries? could be set to console.log            
            // verbose: console.log
        });
        return db;
    });
}
function runQuery(sql_1) {
    return __awaiter(this, arguments, void 0, function* (sql, params = []) {
        // console.log("about to run:");
        // console.log(sql);   
        const db = yield openDb();
        const stmt = db.prepare(sql); // compiles an SQL statement.
        // .run() / .all() / .get() → belong to a prepared statement (db.prepare(sql)),
        // stmt.all(...) → executes the statement and returns all matching rows as an array of objects.
        // stmt.get(...) → executes the statement and returns single first matching row as a single object.
        // stmt.run(...) → executes the statement and returns only metadata (number of rows changed, and id of the last inserted row (only meaningful for INSERT)).
        // better-sqlite3 exposes whether the statement reads rows
        if (stmt.reader === true) {
            // SELECT
            // return stmt.all();  // sql-injection מסוכן        
            return Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
        }
        else {
            // INSERT/UPDATE/DELETE
            const res = Array.isArray(params)
                ? stmt.run(...params)
                : stmt.run(params);
            // const res: RunResult = stmt.run();
            return { changes: res.changes, lastInsertRowid: res.lastInsertRowid };
        }
        // TODO: db.close()
    });
}
