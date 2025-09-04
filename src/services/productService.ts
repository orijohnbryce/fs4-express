import { openDb } from "../db/dal";
import { runQuery } from "../db/dal";
import ProductModel from "../models/ProductModel";

function getAllCategoryIds(db: any, parentCategoryId: number): number[] {
    const categoryIds = [parentCategoryId];
    
    // Get direct children
    const childrenSql = `SELECT id FROM category WHERE parent_id = ${parentCategoryId}`;
    const children = runQuery(db, childrenSql) as any[];
    
    // Recursively get all descendants
    for (const child of children) {
        categoryIds.push(...getAllCategoryIds(db, child.id));
    }
    
    return categoryIds;
}

type ProductFilters = {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
}

export async function getProducts(filters?: ProductFilters): Promise<ProductModel[]> {
    const db = openDb();
    try {
        let categoryIds: number[] = [];
        
        // Get all category IDs (parent + all descendants) if categoryId filter is provided
        if (filters?.categoryId) {
            categoryIds = getAllCategoryIds(db, filters.categoryId);
        }

        // Build the main product query
        let sql = `
            SELECT DISTINCT
                p.id,
                p.sku,
                p.name,
                p.description,
                p.price,
                p.is_active as isActive,
                p.stock
            FROM product p
        `;

        if (categoryIds.length > 0) {
            sql += `
            JOIN product_category pc ON p.id = pc.product_id
            WHERE p.is_active = 1 
            AND pc.category_id IN (${categoryIds.join(',')})
            `;
        } else {
            sql += ` WHERE p.is_active = 1`;
        }

        if (filters?.name) {
            sql += ` AND p.name LIKE '%${filters.name}%'`;
        }

        if (filters?.minPrice !== undefined) {
            sql += ` AND p.price >= ${filters.minPrice}`;
        }

        if (filters?.maxPrice !== undefined) {
            sql += ` AND p.price <= ${filters.maxPrice}`;
        }

        sql += ` ORDER BY p.name`;

        const results = runQuery(db, sql) as any[];

        return results.map(row => new ProductModel(
            row.id,
            row.sku,
            row.name,
            row.price,
            row.stock,
            row.description,
            row.isActive === 1
        ));
    } finally {
        db.close();
    }
}

export async function addProduct(product: Omit<ProductModel, 'id'>): Promise<number> {
    const db = openDb();
    try {
        const sql = `
            INSERT INTO product (sku, name, description, price, stock, is_active)
            VALUES ('${product.sku}', '${product.name}', '${product.description || ''}',
                     ${product.price}, ${product.stock}, ${product.isActive ? 1 : 0})
        `;

        const result = runQuery(db, sql) as any;
        return result.lastInsertRowid;
    } finally {
        db.close();
    }
}

export async function deleteProduct(id: number): Promise<void> {
    const db = openDb();
    try {
        const sql = `DELETE FROM product WHERE id = ${id}`;
        runQuery(db, sql);
    } finally {
        db.close();
    }
}

export async function getProductById(id: number): Promise<ProductModel | null> {
    const db = openDb();
    try {
        const sql = `
            SELECT *
            FROM product 
            WHERE id = ${id}
        `;
        const results = runQuery(db, sql) as any[];
        
        if (results.length === 0) {
            return null;
        }
        
        const row = results[0];
        return new ProductModel(
            row.id,
            row.sku,
            row.name,
            row.price,
            row.stock,
            row.description,
            row.isActive === 1
        );
    } finally {
        db.close();
    }
}

export async function updateProduct(id: number, product: Omit<ProductModel, 'id'>): Promise<void> {
    const db = openDb();
    try {
        const sql = `
            UPDATE product 
            SET sku = '${product.sku}',
                name = '${product.name}',
                description = '${product.description || ''}',
                price = ${product.price},
                stock = ${product.stock},
                is_active = ${product.isActive ? 1 : 0}
            WHERE id = ${id}
        `;
        runQuery(db, sql);
    } finally {
        db.close();
    }
}


