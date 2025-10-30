"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const exceptions_1 = require("./exceptions");
class UserModel {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.token = user.token;
        this.isAdmin = user.isAdmin;
    }
    validate() {
        const res = UserModel.validationSchema.validate(this);
        if (res.error)
            throw new exceptions_1.ValidationError(res.error.details[0].message);
    }
}
UserModel.validationSchema = joi_1.default.object({
    id: joi_1.default.number().optional().positive(),
    username: joi_1.default.string().required().min(3).max(20),
    password: joi_1.default.string().required().min(4).max(20), // todo: add regex for strong password requirements
    email: joi_1.default.string().email(),
    isAdmin: joi_1.default.boolean().optional(),
    token: joi_1.default.string().max(300).optional()
});
exports.default = UserModel;
