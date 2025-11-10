import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/helpers/authHelpers";

export function verifyTokenAdminMW(req: Request, res: Response, next: NextFunction) {

    // console.log(req.header("Authorization").substring(7));

    // const token = req.header("Authorization")?.substring(7);
    // const user = verifyToken(token, true);        
    // res.locals.user = user;
    
    next();
}