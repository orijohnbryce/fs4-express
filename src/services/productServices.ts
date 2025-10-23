import { UploadedFile } from "express-fileupload";
import { runQuery } from "../dal/dal";
import { NotFoundError } from "../models/exceptions";
import ProductModel from "../models/ProductModel";
import { getAllCategoriesById } from "./categoryServices";
// import { productImagesPrefix } from "../utils/config";
import path from "path";
import { v4 as uuid } from "uuid";
import { appConfig } from "../utils/config";


export async function getProductsPaged(page: number = 1, limit: number = 5) {

    const q = `SELECT * FROM product LIMIT(${limit}) OFFSET(${(page - 1) * limit})`;

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

    const countQ = "select count(id) as count from product";
    const countRes = await runQuery(countQ) as any;
    console.log(countRes);

    const pagedRes: any = {
        total: countRes[0].count,
        page: page,
        limit: limit,
        results: products,
    }

    if (page * limit < (countRes[0].count)) {
        pagedRes.next = `http://localhost:3030/products-paged?page=${page + 1}`
    }

    return pagedRes
}


export async function getProductById(id: number): Promise<ProductModel | null> {
    const q = `SELECT * FROM product WHERE id=?`
    const res = await runQuery(q, [id]) as ProductModel[];
    const row = res[0]

    if (res.length == 0)
        // return null;
        // throw new Error("Product not found!");
        throw new NotFoundError(`Product with id ${id} not found!`)

    const imagesQ = `SELECT image_path FROM product_image
                     WHERE product_id=?`;
    
    const imagesRows = await runQuery(imagesQ, [id]) as {image_path: string}[];
    const imagePaths = imagesRows.map((im)=> `http://localhost:3030/product-image/${im.image_path}`);

    const p = new ProductModel(
        row.id,
        row.sku,
        row.name,
        row.isActive,
        row.price,
        row.stock,
        row.description,
        imagePaths,
    )
    return p;
}

export async function getProducts(name?: string, minPrice?: number, maxPrice?: number, categoryId?: number): Promise<ProductModel[]> {
    let q = `SELECT p.* FROM product p`;

    if (categoryId != undefined) {
        const categoryIds = await getAllCategoriesById(categoryId);
        q += ` JOIN product_category pc ON  pc.product_id = p.id WHERE pc.category_id IN (${categoryIds.join(",")}) AND p.is_active=1`;
    } else {
        q += ` WHERE p.is_active=1`
    }

    const params = []

    if (name){
        q += ` AND p.name LIKE '%${name}%'`
        params.push(name);
    }

    if (minPrice != undefined){
        q += ` AND p.price >= ${minPrice}`
        params.push(minPrice)
    }

    if (maxPrice != undefined){
        q += ` AND p.price <= ${maxPrice}`
        params.push(maxPrice)
    }

    const res = await runQuery(q, params) as ProductModel[];

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
    const q = `DELETE FROM product WHERE ID = ?`;
    await runQuery(q, [productId]);
}

// export async function addProduct(product: Omit<ProductModel, 'id'>) {
export async function addProduct(product: Partial<ProductModel>) {

    product.validate();

    const q = `INSERT INTO product 
    (sku, name, is_active, price, stock , description)
    VALUES (
        '${product.sku}',
        '${product.name}',
        ${product.isActive ? 1 : 0},
        ${product.price},
        ${product.stock},
        '${product.description || ''}'
    )
    `
    console.log(q);

    const res = await runQuery(q) as any;
    return res.lastInsertRowid;
}

export async function updateProduct(p: ProductModel) {
    const q = `
    UPDATE product SET 
    sku = '${p.sku}',
    name = '${p.name}',
    is_active = ${p.isActive ? 1 : 0},
    price = ${p.price},
    stock = ${p.stock},
    description = '${p.description || "NULL"}'
    `
    await runQuery(q);
}

export async function saveProductImage(productId: number, image: UploadedFile): Promise<string> {

    // my_file.txt
    const uuidString = uuid();
    const lastDot = image.name.lastIndexOf(".")
    const imageName = uuidString + image.name.substring(lastDot);            
    const fullPath = path.join(appConfig.productImagesPrefix, imageName);

    await image.mv(fullPath);

    const q = `INSERT INTO product_image (product_id, image_path)  VALUES (${productId}, '${imageName}')`;

    console.log(q);
    
    await runQuery(q);
    return fullPath;

}

