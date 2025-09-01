import express, { NextFunction, Request, Response } from "express"
import path from "path";
import { APP_PORT } from "./utils/config";


const server = express()

server.use(express.json()) // load body into "request" object

server.use((request: Request, response: Response, next: NextFunction) => {        
    response.status(404).send(`Route ${request.url} not found!`)
})

server.listen(APP_PORT, () => console.log(`Express server started.\nhttp://localhost:${APP_PORT}`));
