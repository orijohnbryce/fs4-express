import { NextFunction, Request, Response } from "express";
import { AppException } from "../models/exeptions";
import { StatusCode } from "../models/statusCode";
import { logIt } from "../utils/helpers/logHelpers";

export function errorHandler(error: any, request: Request, response: Response, next: NextFunction) {

    if (error instanceof AppException) {
        response.status(error.status).send(error.message);
        return;
    }

    // unknown error
    // console.log(`errorHandler caught new error:\n${error}`);
    const msg = `Unknown error. message: ${error.message}.\nTB:\n${error.stack}`
    logIt(msg, true);

    // TODO: send email     

    response.status(StatusCode.ServerError).send("Internal Server Error")
}