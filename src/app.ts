import express, { NextFunction, Request, Response } from "express"
import { addCar, deleteCar, loadCars } from "./utils/helpers/csvHelpers"
import { Car } from "./types"
import { logIt } from "./utils/helpers/logHelpers"
import { logMiddleware } from "./middlewares/logMiddleware"
import { doorManMW } from "./middlewares/doormanMiddleware"
import { carValidationMW } from "./middlewares/carValidation"


const server = express()

server.use(express.json()) // load body into "request" object

server.use(logMiddleware)
// server.use(doorManMW)  // uncomment on production


const extraMw = (request: Request, response: Response, next: NextFunction)=>{
    console.log("This is extra MW");
    next();
}


server.get("/api/v1/cars", extraMw, async (request: Request, response: Response, next: NextFunction) => {

    console.log(request.query);
    const min = request.query.min ? +request.query.min : -Infinity
    const max = request.query.max ? +request.query.max : Infinity
    const q = request.query.q ? (request.query.q as string).toLowerCase() : ""

    const cars = await loadCars();
    const res = cars.filter((c: Car) => c.price > min 
                                        && c.price < max 
                                        && c.name.toLowerCase().includes(q));
    response.status(200).json(res);
})

server.get("/api/v1/cars/search/:q", async (request: Request, response: Response, next: NextFunction) => {
    const cars = await loadCars();
    const res = cars.filter((c: Car) => c.name.toLowerCase().includes(request.params.q.toLowerCase()))
    response.status(200).json(res);
})

server.get("/api/v1/cars/:id", async (request: Request, response: Response, next: NextFunction) => {
    if (request.params.id) {
        const id = +request.params.id;
        const cars = await loadCars();
        const car = cars.filter((c) => c.id === id)
        if (car.length === 0)
            response.status(404).send("car-id not found");
        else
            response.status(200).json(car[0]);
    }
    else {
        response.status(200).json({});
    }
})

server.post("/api/v1/car", carValidationMW, async (req: Request, res: Response, next: NextFunction) => {

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
        return; // must be here, to avoid double return. 
        // (or move res.status(200) to be before the catch section)
    }
    res.status(201).send("OK")
})

server.put("/api/v1/car/:id", carValidationMW, async (req: Request, res: Response, next: NextFunction) => {

    // try..

    await deleteCar(+req.params.id)
    const updatedCar: Car = req.body;
    await addCar(updatedCar);
    res.status(200).json(updatedCar)
})

server.delete("/api/v1/car/:id", async (req: Request, res: Response, next: NextFunction) => {
    await deleteCar(+req.params.id);
    res.status(204).send("deleted")
})

server.use(async (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send(`route ${req.originalUrl} not found!`)
})

server.listen(3030, () => {
    console.log("Express server started.\nhttp://localhost:3030")
})
