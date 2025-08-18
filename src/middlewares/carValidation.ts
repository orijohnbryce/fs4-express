import { NextFunction, Request, Response } from "express";

export const carValidationMW = (req: Request, res: Response, next: NextFunction) => {
    const { id, name, km, engine, year, price } = req.body;

    const errors: string[] = []
    if (typeof id !== 'number') errors.push("id")
    if (typeof price !== 'number' || price < 0) errors.push("price")
    if (typeof year !== 'number') errors.push("year")
    if (typeof engine !== 'number') errors.push("engine")
    if (typeof km !== 'number') errors.push("km")
    if (typeof name !== 'string') errors.push("name")

    if (errors.length > 0) 
        return res.status(400).send(`Missing or invalid fields: ${errors.join(", ")}`)    
    next();
}