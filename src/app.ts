import express, { NextFunction, Request, Response } from "express"
import { openDb, runQuery } from "./dal/dal";
import { productRoutes } from "./controllers/productControllers";
import { orderRoutes } from "./controllers/orderControllers";
import { errorHandler } from "./middlewares/errorHandler";
import { logMiddleware } from "./middlewares/logMiddleware";
import { authRouter } from "./controllers/userControllers";
import fileUpload from "express-fileupload";
import cors from "cors";
import expressRateLimit from "express-rate-limit";

import { appConfig } from "./utils/config";

const server = express();

// CORS
// server.use(cors()) //  Allow All origins
server.use(cors({origin: [
    "http://127.0.0.1:3000"    
]}))

// D.O.S (rate limit) - per IP
server.use(expressRateLimit({
    windowMs: 1000 * 1,  // 1 sec
    max: 2 // max 2 calls
}))

server.use(express.json()); // load body into "request" object
server.use(fileUpload())
server.use(logMiddleware)

server.use(productRoutes);
server.use(orderRoutes);
server.use(authRouter);

server.use(errorHandler);

server.listen(appConfig.port, () => console.log(`Express server started.\nhttp://localhost:${appConfig.port}`));
