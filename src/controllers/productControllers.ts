import express, { NextFunction, Request, Response } from "express"
import { getProductById, getProducts } from "../services/productServices";
import { StatusCode } from "../models/statusCode";


export const productRoutes = express.Router();

productRoutes.get("/products/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pid = Number(req.params.id);
        if (isNaN(pid)) {
            res.status(StatusCode.BadRequest).send("id must be positive number")
            return;
        }
        const product = await getProductById(pid);
        res.status(StatusCode.Ok).json(product)
    } catch (error) {

        console.log(error.message);
        // if (error.message?.includes("Product not found!")){
        //     res.status(400).send("Product not found!")
        // }        

        res.status(StatusCode.ServerError).send("Internal Server Error")
        // todo: send email to the programmer with error details.
    }
})



productRoutes.get("/products", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
        const name = req.query.name ? String(req.query.name) : undefined;
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
        // (name?: string, minPrice?: number, maxPrice?: number, categoryId?: number)
        const products = await getProducts(name, minPrice, maxPrice, categoryId);
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

