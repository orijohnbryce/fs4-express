import express, { NextFunction, Request, Response } from "express"
import { openDb, runQuery } from "./dal/dal";
import { productRoutes } from "./controllers/productControllers";

const server = express();

server.use(express.json()); // load body into "request" object

server.use(productRoutes);

server.listen(3030, () => console.log("Express server started.\nhttp://localhost:3030"));
