"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMiddleware = logMiddleware;
const logHelpers_1 = require("../utils/helpers/logHelpers");
function logMiddleware(req, res, next) {
    const msg = `${new Date().toISOString()}: new ${req.method} call from ${req.ip} to: ${req.url}`;
    (0, logHelpers_1.logIt)(msg);
    next();
}
