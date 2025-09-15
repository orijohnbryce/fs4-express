import express, { NextFunction, Request, Response } from "express"
import { openDb, runQuery } from "./dal/dal";
import { productRoutes } from "./controllers/productControllers";
import { orderRoutes } from "./controllers/orderControllers";

const server = express();

server.use(express.json()); // load body into "request" object

server.use(productRoutes);
server.use(orderRoutes);

server.listen(3030, () => console.log("Express server started.\nhttp://localhost:3030"));
