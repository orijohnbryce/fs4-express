import { runQuery } from "../dal/dal";
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

export async function createOrder(data: CreateOrderDTO) {

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

createOrder({ customerId: 2, products: [{ productId: 5, qty: 2 }] })
    .then((oid) => console.log(oid))