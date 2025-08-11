import express, { NextFunction, Request, Response } from "express"


const cars = [    
    { model: "Jaguar", year: 2018 },
    { model: "Tesla", year: 2019 },
    { model: "Suzuki", year: 2019 },
    { model: "Ford", year: 2022 },
]

const server = express()

server.use(express.json()) // load body into "request" object

server.get("/api/v1/cars", (request: Request, response: Response, next: NextFunction) => {
    response.status(200).json(cars)
})


server.post("/api/v1/car", (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    cars.push(req.body);
    res.status(200).send("OK")
})


server.listen(3030, () => console.log("Express server started.\nhttp://localhost:3030"));
