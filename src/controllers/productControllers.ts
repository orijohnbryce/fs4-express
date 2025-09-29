import express, { NextFunction, Request, Response } from "express"
import { addProduct, getProductById, getProducts, getProductsPaged, saveProductImage } from "../services/productServices";
import { StatusCode } from "../models/statusCode";
import ProductModel from "../models/ProductModel";
import { verifyTokenMW } from "../middlewares/verifyTokenMW";
import { verifyTokenAdminMW } from "../middlewares/verifyTokenAdminMW";
import fileUpload from "express-fileupload";
import { ValidationError } from "../models/exceptions";

export const productRoutes = express.Router();

productRoutes.get("/products-paged", async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const products = await getProductsPaged(page || 1, limit || 5);
    res.status(StatusCode.Ok).json(products);
})

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

productRoutes.post("/products", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {

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

productRoutes.post("/product-image/:productId", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction)=>{
    const productId = Number(req.params.productId);

    const files = req.files as {[fieldname: string]: fileUpload.UploadedFile};
    const image = files?.["image"];

    if (!image)
        throw new ValidationError("'image' is require");

    const imagePath = await saveProductImage(productId, image);

    res.status(StatusCode.Created).json({
        message: "image added",
        imagePath
    })
})