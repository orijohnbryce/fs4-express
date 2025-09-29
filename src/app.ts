import express, { NextFunction, Request, Response } from "express"
import { openDb, runQuery } from "./dal/dal";
import { productRoutes } from "./controllers/productControllers";
import { orderRoutes } from "./controllers/orderControllers";
import { errorHandler } from "./middlewares/errorHandler";
import { logMiddleware } from "./middlewares/logMiddleware";
import { authRouter } from "./controllers/userControllers";
import fileUpload from "express-fileupload";

const server = express();

server.use(express.json()); // load body into "request" object
server.use(fileUpload())
server.use(logMiddleware)

server.use(productRoutes);
server.use(orderRoutes);
server.use(authRouter);

server.use(errorHandler);

server.listen(3030, () => console.log("Express server started.\nhttp://localhost:3030"));
