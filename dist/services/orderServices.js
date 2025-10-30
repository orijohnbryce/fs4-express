"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getOrderByCustomerId = getOrderByCustomerId;
exports.getOrderProducts = getOrderProducts;
const dal_1 = require("../dal/dal");
const OrderModel_1 = require("../models/OrderModel");
function createOrder(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // create order record
        const orderQ = `
    INSERT INTO orders (customer_id, address, status, note)
    VALUES (
    ${data.customerId},
    '${data.address || ''}',
    '${data.status || 'new'}',
    '${data.notes || ''}'
    )
    `;
        const order = yield (0, dal_1.runQuery)(orderQ);
        const orderId = order.lastInsertRowid;
        // fetch all prices
        const productIds = data.products.map(p => p.productId);
        const pricesQ = `
    select id, price from product where id in (${productIds.join(",")})
    `;
        const idPrices = yield (0, dal_1.runQuery)(pricesQ);
        // bulk values string:
        const valuesSql = idPrices.map((ip) => {
            const { qty } = data.products.find((p) => p.productId == ip.id);
            return `(${orderId}, ${ip.id}, ${qty}, ${ip.price})`;
        }).join(",");
        // bulk insert all products to orders_product
        const insertQ = `
    INSERT INTO orders_product (order_id, product_id, qty, price) 
    VALUES ${valuesSql}
    `;
        yield (0, dal_1.runQuery)(insertQ);
        return orderId;
    });
}
function getOrderByCustomerId(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `SELECT * FROM orders WHERE customer_id = ${customerId} `;
        const res = yield (0, dal_1.runQuery)(q);
        const orders = res.map((o) => {
            return new OrderModel_1.OrderModel(o.id, o.customer_id, o.order_date, o.status, o.address, o.note);
        });
        return orders;
    });
}
function getOrderProducts(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `SELECT p.*, op.price as actual_price, op.qty as qty 
                FROM product p
                JOIN orders_product op
                ON p.id = op.product_id
                WHERE op.order_id = ${orderId}`;
        const res = yield (0, dal_1.runQuery)(q);
        return res;
    });
}
// const data = { customerId: 2, products: [{ productId: 5, qty: 2 }] }
// createOrder(data)
//     .then((oid) => console.log(oid))
// getOrderProducts(11).then((res)=>{console.log(res)})
