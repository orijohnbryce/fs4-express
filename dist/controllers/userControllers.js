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
exports.authRouter = void 0;
const express_1 = require("express");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const userServices_1 = require("../services/userServices");
const statusCode_1 = require("../models/statusCode");
const exceptions_1 = require("../models/exceptions");
const verifyTokenAdminMW_1 = require("../middlewares/verifyTokenAdminMW");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/user/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const um = new UserModel_1.default(req.body);
        const token = yield (0, userServices_1.createUser)(um);
        res.status(statusCode_1.StatusCode.Created).json(token);
    }
    catch (error) {
        if ((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.includes("UNIQUE constraint")) {
            next(new exceptions_1.ValidationError(error.message));
        }
        next(error);
    }
}));
exports.authRouter.post("/user/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, userServices_1.login)(req.body.email, req.body.password);
    res.status(statusCode_1.StatusCode.Ok).json(token);
}));
exports.authRouter.get("/users", verifyTokenAdminMW_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, userServices_1.getAllUsers)();
    res.status(statusCode_1.StatusCode.Ok).json(users);
}));
exports.authRouter.delete("/users/:id", verifyTokenAdminMW_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // we have access to "user" since it was added by the MW:
    console.log(res.locals.user);
    const id = Number(req.params.id);
    yield (0, userServices_1.deleteUser)(id);
    res.status(statusCode_1.StatusCode.Ok).send("successfully deleted");
}));
