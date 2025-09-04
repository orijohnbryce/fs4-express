import express, { Request, Response, NextFunction } from "express";
import { getProducts, updateProduct, getProductById } from "../services/productService";
import ProductModel from "../models/ProductModel";


export const productRouter = express.Router();


productRouter.get("/products", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, minPrice, maxPrice } = req.query;
        
        const filters = {
            name: name as string,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined
        };

        const products = await getProducts(filters);
        res.status(200).json(products);
    } catch (error) {
        // maybe use log helper
        console.log(error);
        res.status(500).send("Error. please try again later")
    }
});

productRouter.patch("/products/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = Number(req.params.id);
        
        // First, fetch the existing product
        const existingProduct = await getProductById(productId);
        if (!existingProduct) {
            return res.status(404).send("Product not found");
        }
        
        // Merge existing data with updates
        const updatedProduct = {
            sku: req.body.sku !== undefined ? req.body.sku : existingProduct.sku,
            name: req.body.name !== undefined ? req.body.name : existingProduct.name,
            description: req.body.description !== undefined ? req.body.description : existingProduct.description,
            price: req.body.price !== undefined ? req.body.price : existingProduct.price,
            stock: req.body.stock !== undefined ? req.body.stock : existingProduct.stock,
            isActive: req.body.isActive !== undefined ? req.body.isActive : existingProduct.isActive
        };
        
        await updateProduct(productId, updatedProduct);
        res.status(200).send("Product updated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error. please try again later");
    }
});

