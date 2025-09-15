import { runQuery } from "../dal/dal";
import { OrderModel } from "../models/OrderModel";
import ProductModel from "../models/ProductModel";
import { OrderStatus } from "../types/types";

interface OrderProductDTO {
    productId: number;
    qty: number;
}

// DTO : data transfer object
interface CreateOrderDTO {
    customerId: number;
    address?: string;
    status?: OrderStatus;
    notes?: string;

    products: OrderProductDTO[];
}

export async function createOrder(data: CreateOrderDTO): Promise<number> {

    // create order record
    const orderQ = `
    INSERT INTO orders (customer_id, address, status, note)
    VALUES (
    ${data.customerId},
    '${data.address || ''}',
    '${data.status || 'new'}',
    '${data.notes || ''}'
    )
    `
    const order = await runQuery(orderQ) as any;
    const orderId = order.lastInsertRowid;

    // fetch all prices
    const productIds = data.products.map(p => p.productId);
    const pricesQ = `
    select id, price from product where id in (${productIds.join(",")})
    `
    const idPrices = await runQuery(pricesQ) as { id: number, price: number }[];


    // bulk values string:
    const valuesSql = idPrices.map(
        (ip) => {
            const { qty } = data.products.find((p) => p.productId == ip.id)
            return `(${orderId}, ${ip.id}, ${qty}, ${ip.price})`
        }
    ).join(",")

    // bulk insert all products to orders_product
    const insertQ = `
    INSERT INTO orders_product (order_id, product_id, qty, price) 
    VALUES ${valuesSql}
    `;

    await runQuery(insertQ);

    return orderId;

}


export async function getOrderByCustomerId(customerId: number): Promise<OrderModel[]> {
    const q = `SELECT * FROM orders WHERE customer_id = ${customerId} `;
    const res = await runQuery(q) as any[];

    const orders = res.map((o) => {
        return new OrderModel(o.id,
            o.customer_id,
            o.order_date,
            o.status,
            o.address,
            o.note
        )
    })

    return orders;
}


export async function getOrderProducts(orderId: number): Promise<any[]> {
    const q = `SELECT p.*, op.price as actual_price, op.qty as qty 
                FROM product p
                JOIN orders_product op
                ON p.id = op.product_id
                WHERE op.order_id = ${orderId}`;
    
    
    const res = await runQuery(q) as any[];
    return res;
}


// const data = { customerId: 2, products: [{ productId: 5, qty: 2 }] }
// createOrder(data)
//     .then((oid) => console.log(oid))

getOrderProducts(11).then((res)=>{console.log(res)})