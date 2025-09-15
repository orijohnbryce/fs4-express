import express, { NextFunction, Request, Response } from "express"
import { createOrder, getOrderByCustomerId, getOrderProducts } from "../services/orderServices";
import { OrderStatus } from "../types/types";
import { StatusCode } from "../models/statusCode";


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
        res.status(StatusCode.Ok).send(`Order created. id: ${newOrderId}`);
    } catch (error) {
        console.log(error);
        res.status(StatusCode.ServerError).json(error);
    }

})

orderRoutes.get("/customer-orders/:id", 
    async (req: Request, res: Response, next: NextFunction)=>{

        const customerId = Number(req.params.id);
        const returnData = {}
        const orders = await getOrderByCustomerId(customerId);

        for (const o of orders) {
            const orderProducts = await getOrderProducts(o.id);
            returnData[o.id] = {
                orderDate: o.orderDate,
                status: o.status,
                note: o.note,
                products: orderProducts
            };
        }
        res.status(StatusCode.Ok).json(returnData);       
    })