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
exports.createUser = createUser;
exports.login = login;
exports.getAllUsers = getAllUsers;
exports.deleteUser = deleteUser;
const dal_1 = require("../dal/dal");
const exceptions_1 = require("../models/exceptions");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const authHelpers_1 = require("../utils/helpers/authHelpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        user.validate();
        // TODO: better to use UUID as id for user, instead of auto-increment.
        const passwordHash = yield bcrypt_1.default.hash(user.password + process.env.HASH_PEPPER, 12);
        let q = `INSERT INTO "user" (username, email, password_hash)
             VALUES (?, ?, ?)
    `;
        console.log("dbg", q);
        yield (0, dal_1.runQuery)(q, [user.username, user.email, String(passwordHash)]);
        const token = (0, authHelpers_1.createToken)(user);
        // optional: update DB with the new created token
        return token;
    });
}
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        /* If given credentials are ok, generate and return new token  */
        // sql-injection risk
        // const q = `SELECT * FROM "user" WHERE email='${email}' AND password_hash='${password}'`
        // "email": "admin@email.com' -- "  // sql injection risk
        // sql-injection protected:
        // const q = `SELECT * FROM "user" WHERE email=? AND password_hash=?`        
        // const res = await runQuery(q, [email, password]) as any;
        const q = `SELECT * FROM "user" WHERE email=?`;
        const res = yield (0, dal_1.runQuery)(q, [email]);
        const user = res[0];
        const pepper = process.env.HASH_PEPPER;
        const match = yield bcrypt_1.default.compare(password + pepper, user.password_hash);
        if (!match) {
            throw new exceptions_1.UnauthorizedError();
        }
        if (res.length !== 1)
            throw new exceptions_1.UnauthorizedError();
        const um = new UserModel_1.default(user);
        const token = (0, authHelpers_1.createToken)(um);
        // optional: update DB with the new created token
        return token;
    });
}
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `SELECT * FROM 'user'`;
        const rawUsers = yield (0, dal_1.runQuery)(q);
        const users = rawUsers.map((u) => {
            return new UserModel_1.default(u);
        });
        return users;
    });
}
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. need to delete all orders that belong to customer that linked to user
        // 2. need to delete the customer that linked to the user
        // 3. delete the user
        throw new exceptions_1.UnknownError("Not Implemented Yet");
    });
}
