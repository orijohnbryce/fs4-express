"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMW = verifyTokenMW;
const authHelpers_1 = require("../utils/helpers/authHelpers");
function verifyTokenMW(req, res, next) {
    var _a;
    // console.log(req.header("Authorization").substring(7));
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.substring(7);
    const user = (0, authHelpers_1.verifyToken)(token);
    // (req as any).user = user;
    res.locals.user = user;
    next();
}
