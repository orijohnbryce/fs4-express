import { NextFunction, Request, Response } from "express";


export const doorManMW = (req: Request, res: Response, next: NextFunction) => {
    const k = "I-love-fullstack";

    if (req.header("doorman-key") !== k){
        res.status(403).end();
    }else {
        next();
    }
}