import express, { NextFunction, Request, Response } from "express"
import { addCar, loadCars } from "./helpers/csvHelpers"
import { Car } from "./types"


const server = express()

server.use(express.json()) // load body into "request" object

server.get("/api/v1/cars",  async (request: Request, response: Response, next: NextFunction) => {
    const cars = await loadCars();
    response.status(200).json(cars);
})

server.get("/api/v1/cars/:id",  async (request: Request, response: Response, next: NextFunction) => {
    const id = +request.params.id;
    const cars = await loadCars();
    const car = cars.filter((c)=>c.id === id)
    if (car.length === 0)        
        response.status(404).send("car-id not found");
    else
        response.status(200).json(car[0]);
})


server.post("/api/v1/car",async  (req: Request, res: Response, next: NextFunction) => {    
    
    // TODO: validate body is valid CAR object
    /*
    for example, 
    if req.body.model?.length === 0:
        res.status(400).send(...)    
    */
    try {        
        await addCar(req.body as Car)
    } catch (error) {
        res.status(500).send("some error, please retry later .. ")
        return;
    }
    res.status(200).send("OK")
})

server.listen(3030, () => console.log("Express server started.\nhttp://localhost:3030"));
