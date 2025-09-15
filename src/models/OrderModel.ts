import { OrderStatus } from "../types/types";

export class OrderModel {
    id?: number;
    customerId: number;
    orderDate: Date;
    status: OrderStatus;
    address?: string;
    note?: string;
    
    constructor(
        id: number | undefined,
        customerId: number,
        orderDate: Date,
        status: OrderStatus,
        address?: string,
        note?: string
    ) {
        this.id = id;
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.status = status;
        this.address = address;
        this.note = note;
    }
}

const o = new OrderModel(1, 2, new Date(), "new")