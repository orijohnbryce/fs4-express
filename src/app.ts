import express, { NextFunction, Request, Response } from "express"
import { openDb, runQuery } from "./dal/dal";

const server = express()

server.use(express.json()) // load body into "request" object

server.listen(3030, () => console.log("Express server started.\nhttp://localhost:3030"));
