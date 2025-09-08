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

async function getAllCategoriesById(parentCategoryId: number): Promise<number[]> {

    const categoryIds = [parentCategoryId];

    const q = `select id from category where parent_id = ${parentCategoryId}`;

    const children = await runQuery(q) as any[];

    for (const child of children) {
        categoryIds.push(...(await getAllCategoriesById(child.id)));
    }

    return categoryIds;
}

export async function getProducts(name?: string, minPrice?: number, maxPrice?: number, categoryId?: number): Promise<ProductModel[]> {
    let q = `SELECT p.* FROM product p`;

    if (categoryId != undefined) {
        const categoryIds = await getAllCategoriesById(categoryId);
        q += ` JOIN product_category pc ON  pc.product_id = p.id WHERE pc.category_id IN (${categoryIds.join(",")})`;
    }
    q += ` AND p.is_active=1`
    if (name)
        q += ` AND p.name LIKE '%${name}%'`

    if (minPrice != undefined)
        q += ` AND p.price >= ${minPrice}`

    if (maxPrice != undefined)
        q += ` AND p.price <= ${maxPrice}`

    const res = await runQuery(q) as ProductModel[];
    const products = [];
    res.map((row) => products.push(new ProductModel(
        row.id,
        row.sku,
        row.name,
        row.isActive,
        row.price,
        row.stock,
        row.description
    )))

    return products;
}

export async function deleteProduct(productId: number): Promise<void> {
    const q = `DELETE FROM product WHERE ID = ${productId}`;
    await runQuery(q);
}

export async function addProduct(product: Omit<ProductModel, 'id'>) {
    const q = `INSERT INTO product 
    (sku, name, is_active, price, stock , description)
    VALUES (
        ${product.sku},
        ${product.name},
        ${product.isActive ? 1 : 0},
        ${product.price},
        ${product.stock},
        '${product.description || ''}'
    )
    `
    const res = await runQuery(q) as any;
    return res.lastInsertRowid;
}

export async function updateProduct(p : ProductModel) {
    const q = `
    UPDATE product SET 
    sku = ${p.sku},
    name = ${p.name},
    is_active = ${p.isActive ? 1 : 0},
    price = ${p.price},
    stock = ${p.stock},
    description = '${p.description || "NULL"}'
    `
    await runQuery(q);
}