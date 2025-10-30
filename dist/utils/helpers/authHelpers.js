"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { tokenSecretKey } from "../config";
const exceptions_1 = require("../../models/exceptions");
const config_1 = require("../config");
function createToken(user) {
    const userWithoutPassword = Object.assign({}, user);
    delete userWithoutPassword.password;
    const container = { userWithoutPassword };
    const token = jsonwebtoken_1.default.sign(container, config_1.appConfig.tokenSecretKey);
    return token;
}
function verifyToken(token, adminRequired = false) {
    try {
        const res = jsonwebtoken_1.default.verify(token, config_1.appConfig.tokenSecretKey);
        if (adminRequired && !res.userWithoutPassword.isAdmin)
            throw "sdf"; // we don't care about this error. it will re-raise from the catch
        return res.userWithoutPassword;
    }
    catch (error) {
        throw new exceptions_1.UnauthorizedError();
    }
}
// createToken({id: 123, username: "david", password: "123", email: "david@email.com", isAdmin: true})
// verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2l0aG91dFBhc3N3b3JkIjp7ImlkIjoxMjMsInVzZXJuYW1lIjoiZGF2aWQiLCJlbWFpbCI6ImRhdmlkQGVtYWlsLmNvbSIsImlzQWRtaW4iOnRydWV9LCJpYXQiOjE3NTg4MTg5Mjl9.EwFrwLJ2ET-9rFr8t7OM2Pe1JFoVUjwQYzC3mv8UK7o")
