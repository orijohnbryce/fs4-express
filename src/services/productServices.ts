import { runQuery } from "../dal/dal";
import ProductModel from "../models/ProductModel";

export async function getProductById(id: number): Promise<ProductModel | null> {
    const q = `SELECT * FROM product WHERE id=${id}`
    const res = await runQuery(q) as ProductModel[];
    const row = res[0]

    if (res.length == 0)
        return null;

    const p = new ProductModel(
        row.id,
        row.sku,
        row.name,
        row.isActive,
        row.price,
        row.stock,
        row.description
    )
    return p;
}
