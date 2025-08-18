import { NextFunction, Request, Response } from "express";
import { logIt } from "../utils/helpers/logHelpers";

export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const time = new Date().toLocaleString("en-IL", { timeZone: "Asia/Jerusalem" });
    const ipv6 = req.ip;

    // convert to ipv4
    const ip = ipv6 === '::1' ? '127.0.0.1' : ipv6.replace(/^::ffff:/, '');


    res.on("finish", async () => {
        const logMsg = `[${time}]: ${ip} ${req.method} ${req.originalUrl} ${res.statusCode}`
        await logIt(logMsg);
    })

    res.on("close", () => {
        const logMsg = `[${time}]: ${ip} ${req.method} ${req.originalUrl} CONNECTION LOST`
        logIt(logMsg);
    })
    next();
}

