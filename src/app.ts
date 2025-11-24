import express, { NextFunction, Request, Response } from "express"
import handleSocketIo from "./services/socket-services"

const expressServer = express()

expressServer.use(express.json()) // load body into "request" object

expressServer.get("/", (request: Request, response: Response, next: NextFunction) => {        
    response.status(200).send("hello world!")
})


const httpsServer = expressServer.listen(4000, () => console.log("Express server started.\nhttp://localhost:4000"));

handleSocketIo(httpsServer);