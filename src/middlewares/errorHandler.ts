import { NextFunction, Request, Response } from "express";
import { AppException } from "../models/exeptions";
import { StatusCode } from "../models/statusCode";

export function errorHandler(error: any, request: Request, response: Response, next: NextFunction) {

    console.log(`errorHandler caught new error: ${error}`);
    // console.log(error.message);
    // console.log(error.stack);

    if (error instanceof AppException) {
        response.status(error.status).send(error.message);
        return;
    }
    // unknown error    
    response.status(StatusCode.ServerError).send("Internal Server Error")
}