import express, { Request, Response, NextFunction } from "express";
import { routesPrefix } from "../utils/config";
import { getProducts } from "../services/productService";


export const productRouter = express.Router();


productRouter.get("/products", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await getProducts();
        res.status(200).json(products);
    } catch (error) {
        // maybe use log helper
        console.log(error);
        res.status(500).send("Error. please try again later")
    }
})

