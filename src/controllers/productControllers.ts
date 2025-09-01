import express, { Request, Response, NextFunction } from "express";
import { routesPrefix } from "../utils/config";


export const productRouter = express.Router();


productRouter.get(routesPrefix + "/products", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await getProducts();
        res.status(StatusCode.Ok).json(products);
    } catch (error) {
        console.log(error);
        res.status(StatusCode.ServerError).send("Error. please try again later")
    }
})

