import express, { NextFunction, Request, Response } from "express"
import path from "path";
import router from "./controllers/notesController";


const server = express()

server.use(express.json()) // load body into "request" object

// mount routes
server.use("/api/notes", router);

server.listen(3030, () => console.log("Express server started.\nhttp://localhost:3030"));
