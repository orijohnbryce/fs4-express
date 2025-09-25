import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/helpers/authHelpers";



export function verifyTokenMW(req: Request, res: Response, next: NextFunction) {

    `
    Typical patterns:

        Stateless JWT (current approach) - we can remove DB token field entirely
        Stateful tokens - check DB token in verifyToken() for logout/invalidation support
        
    `
    const token = req.header("Authorization")?.substring(7) || "";
    const user = verifyToken(token);
    res.locals.user = user;  // locals - kind of temp storage
    next()
}


export function verifyTokenAdminMW(req: Request, res: Response,
    next: NextFunction) {
    const token =
        req.header("Authorization")?.substring(7) as string;
    
        console.log("Verify admin");
        
    verifyToken(token, true);
    next()
}

