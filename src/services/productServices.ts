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

export async function getProducts(name?:string, minPrice?:number, maxPrice?:number):Promise<ProductModel[]> {
    let q = `select * from product where is_active=1`;

    if (name)
        q += ` AND name LIKE '%${name}%'`

    if (minPrice)
        q += ` AND price >= ${minPrice}`
    
    if (maxPrice)
        q += ` AND price <= ${maxPrice}`

    const res = await runQuery(q) as ProductModel[];
    const products = [];
    res.map((row)=>products.push(new ProductModel(
        row.id,
        row.sku,
        row.name,
        row.isActive,
        row.price,
        row.stock,
        row.description
    )))

    return res;
}



getProducts("pho", undefined, 70).then(res=>console.log(res))