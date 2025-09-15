import express, { NextFunction, Request, Response } from "express"
import { createOrder } from "../services/orderServices";
import { OrderStatus } from "../types/types";


export const orderRoutes = express.Router();

orderRoutes.post("/order", async (req: Request, res: Response, next: NextFunction) => {

    try {
        // console.log(req.body);
        const data = {
            customerId: req.body.customerId,
            address: req.body.address,
            status: req.body.status as OrderStatus,
            notes: req.body.notes,
            products: req.body.products,
        };

        const newOrderId = await createOrder(data);
        res.send(`Order created. id: ${newOrderId}`);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

})