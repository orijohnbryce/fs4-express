import express, { NextFunction, Request, Response } from "express"
import { getProducts } from "../services/productServices";


export const productRoutes = express.Router();

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