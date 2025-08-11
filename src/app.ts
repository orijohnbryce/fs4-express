import express, { NextFunction, Request, Response } from "express"
import path from "path";


const server = express()

server.use(express.json()) // load body into "request" object

server.get("/", (request: Request, response: Response, next: NextFunction) => {        
    response.status(200).send("hello world!")
})

server.post("/post-example", (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);    
    res.status(200).send("OK")
})


server.listen(3030, () => console.log("Express server started.\nhttp://localhost:3030"));
