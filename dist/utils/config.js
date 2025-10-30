"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class BaseConfig {
    constructor() {
        // readonly routsPrefix = "/api/v1/";
        this.accessLogFile = __dirname + "\\..\\..\\logs\\accessLog.log";
        this.errorLogFile = path_1.default.resolve(__dirname, "..", "..", "logs", "errorLog.log");
        this.productImagesPrefix = path_1.default.resolve(__dirname, "..", "..", "assets", "images");
        this.tokenSecretKey = process.env.TOKEN_SECRET_KEY;
    }
}
class DevConfig extends BaseConfig {
    constructor() {
        super(...arguments);
        this.DB_FILE = __dirname + "\\..\\..\\sqlite.db";
        this.port = 3030;
    }
}
class ProdConfig extends BaseConfig {
    constructor() {
        super(...arguments);
        this.DB_FILE = __dirname + "\\..\\..\\prod_sqlite.db";
        this.port = 3033;
    }
}
exports.appConfig = Number(global.process.env.IS_PROD) === 1 ? new ProdConfig() : new DevConfig();
// export const productImagesPrefix = path.resolve(__dirname, "..", "..", "assets", "images")
// // export const tokenSecretKey = "@#RNSDVS*#$RTN#Vdfgve4rt8923f@4f34f823F@Wvsdr23SDCV@#RF#WEVsdfv";
// export const tokenSecretKey = process.env.TOKEN_SECRET_KEY;
// export const DB_FILE = __dirname + "\\..\\..\\sqlite.db"
// export const accessLogFile = __dirname + "\\..\\..\\logs\\accessLog.log";
// //// better to work with "resolve"
// // export const errorLogFile  = __dirname + "\\..\\..\\logs\\errorLog.log";
// export const errorLogFile = path.resolve(__dirname, "..", "..", "logs", "errorLog.log");
