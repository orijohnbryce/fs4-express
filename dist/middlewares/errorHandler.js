"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const exceptions_1 = require("../models/exceptions");
const statusCode_1 = require("../models/statusCode");
const logHelpers_1 = require("../utils/helpers/logHelpers");
function errorHandler(error, request, response, next) {
    if (error instanceof exceptions_1.AppException) {
        response.status(error.status).send(error.message);
        return;
    }
    // unknown error
    // console.log(`errorHandler caught new error:\n${error}`);
    const msg = `Unknown error. message: ${error.message}.\nTB:\n${error.stack}`;
    (0, logHelpers_1.logIt)(msg, true);
    // TODO: send email     
    response.status(statusCode_1.StatusCode.ServerError).send("Internal Server Error");
}
