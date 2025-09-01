import express, { NextFunction, Request, Response } from "express"
import path from "path";
import { APP_PORT, routesPrefix } from "./utils/config";
import { productRouter } from "./controllers/productControllers";
import { init_db } from "./db/init_db";


const server = express()

server.use(express.json()) // load body into "request" object

// register routers
server.use(routesPrefix, productRouter);

server.use((request: Request, response: Response, next: NextFunction) => {        
    console.log("No route found for", request.url);
    
    response.status(404).send(`Route ${request.url} not found!`)
})

// init_db();

server.listen(APP_PORT, () => console.log(`Express server started.\nhttp://localhost:${APP_PORT}`));
