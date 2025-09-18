import express, { NextFunction, Request, Response } from "express"
import { addProduct, getProductById, getProducts } from "../services/productServices";
import { StatusCode } from "../models/statusCode";
import ProductModel from "../models/ProductModel";

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
        next(error)  // since Express 5.X this is redundant
    }
})

productRoutes.get("/products", async (req: Request, res: Response, next: NextFunction) => {    
        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
        const name = req.query.name ? String(req.query.name) : undefined;
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
        // (name?: string, minPrice?: number, maxPrice?: number, categoryId?: number)
        const products = await getProducts(name, minPrice, maxPrice, categoryId);
        res.status(200).json(products);   
})

productRoutes.post("/products", async (req: Request, res: Response, next: NextFunction)=>{
    
    const newProduct = new ProductModel(
        undefined,
        req.body.sku,
        req.body.name,
        req.body.isActive ? req.body.isActive : 1,
        req.body.price,
        req.body.stock,
        req.body.description
    )

    const newId = await addProduct(newProduct);
    res.status(StatusCode.Ok).send(newId);
})
