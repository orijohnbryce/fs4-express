import { NextFunction, Request, Response } from "express";
import { AppException } from "../models/exeptions";
import { StatusCode } from "../models/statusCode";

export function errorHandler(error: any, request: Request, response: Response, next: NextFunction) {

    if (error instanceof AppException) {
        response.status(error.status).send(error.message);
        return;
    }

    console.log(`errorHandler caught new error:\n${error}`);
    // console.log(error.message);
    // console.log(error.stack);
    // unknown error

    response.status(StatusCode.ServerError).send("Internal Server Error")
}