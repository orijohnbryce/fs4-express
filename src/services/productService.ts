import { openDb } from "../db/dal";
import { runQuery } from "../db/dal";
import ProductModel from "../models/ProductModel";

export function getProducts(): ProductModel[] {
    const db = openDb();
    try {
        const sql = `
            SELECT 
                id,
                sku,
                name,
                description,
                price,
                is_active as isActive,
                stock
            FROM product 
            WHERE is_active = 1
            ORDER BY name
        `;
        
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