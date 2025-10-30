"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
class OrderModel {
    constructor(id, customerId, orderDate, status, address, note) {
        this.id = id;
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.status = status;
        this.address = address;
        this.note = note;
    }
}
exports.OrderModel = OrderModel;
const o = new OrderModel(1, 2, new Date(), "new");
