"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productControllers_1 = require("./controllers/productControllers");
const orderControllers_1 = require("./controllers/orderControllers");
const errorHandler_1 = require("./middlewares/errorHandler");
const logMiddleware_1 = require("./middlewares/logMiddleware");
const userControllers_1 = require("./controllers/userControllers");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("./utils/config");
const server = (0, express_1.default)();
// CORS
// server.use(cors()) //  Allow All origins
server.use((0, cors_1.default)({ origin: [
        "http://127.0.0.1:3000"
    ] }));
// D.O.S (rate limit) - per IP
server.use((0, express_rate_limit_1.default)({
    windowMs: 1000 * 1, // 1 sec
    max: 2 // max 2 calls
}));
server.use(express_1.default.json()); // load body into "request" object
server.use((0, express_fileupload_1.default)());
server.use(logMiddleware_1.logMiddleware);
server.use(productControllers_1.productRoutes);
server.use(orderControllers_1.orderRoutes);
server.use(userControllers_1.authRouter);
server.use(errorHandler_1.errorHandler);
server.listen(config_1.appConfig.port, () => console.log(`Express server started.\nhttp://localhost:${config_1.appConfig.port}`));
