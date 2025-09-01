import { Database as DB } from "better-sqlite3";
import { openDb, runQuery } from "./dal";


export function initShopSchema(db: DB): void {
  const ddl = `    
    -- ===== Core entities =====
    CREATE TABLE IF NOT EXISTS customer (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name   TEXT    NOT NULL,
      last_name    TEXT    NOT NULL,
      email        TEXT    UNIQUE,
      phone        TEXT,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS category (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_id    INTEGER,
      name         TEXT    NOT NULL UNIQUE,
      FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS product (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      sku          TEXT    NOT NULL UNIQUE,  -- MK"T
      stock        INTEGER NOT NULL CHECK (stock >= 0),
      name         TEXT    NOT NULL,
      description  TEXT,
      price        REAL    NOT NULL CHECK (price >= 0),
      is_active    INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1))
    );

    -- Many-to-many: product ↔ category
    CREATE TABLE IF NOT EXISTS product_category (
      product_id   INTEGER NOT NULL,
      category_id  INTEGER NOT NULL,
      PRIMARY KEY (product_id, category_id),
      FOREIGN KEY (product_id)  REFERENCES product(id)  ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
    );        

    -- ===== Orders =====
    CREATE TABLE IF NOT EXISTS orders (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id   INTEGER NOT NULL,
      status        TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new','paid','shipped','cancelled','refunded')),
      order_date    TEXT    NOT NULL DEFAULT (datetime('now')),
      note          TEXT,
      FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS order_item (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id      INTEGER NOT NULL,
      product_id    INTEGER NOT NULL,
      qty           INTEGER NOT NULL CHECK (qty > 0),
      unit_price    REAL    NOT NULL CHECK (unit_price >= 0),
      discount      REAL    NOT NULL DEFAULT 0 CHECK (discount >= 0), -- absolute or percentage
      FOREIGN KEY (order_id)   REFERENCES orders(id)  ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES product(id)  ON DELETE RESTRICT
    );

    -- Helpful indexes
    CREATE INDEX IF NOT EXISTS idx_order_customer    ON orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_item_order        ON order_item(order_id);
    CREATE INDEX IF NOT EXISTS idx_item_product      ON order_item(product_id);
    CREATE INDEX IF NOT EXISTS idx_prod_sku_active   ON product(sku, is_active);
    CREATE INDEX IF NOT EXISTS idx_prod_name         ON product(name);
  `;

  db.exec("BEGIN");
  try {
    db.exec(ddl);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}


export function init_db(records=false) {
  try {
    const db = openDb()
    initShopSchema(db);
    
    if (records) {
      // Insert sample customers
      runQuery(db, `
        INSERT OR IGNORE INTO customer (first_name, last_name, email, phone) VALUES
        ('John', 'Doe', 'john.doe@email.com', '555-0123'),
        ('Jane', 'Smith', 'jane.smith@email.com', '555-0124'),
        ('Mike', 'Johnson', 'mike.j@email.com', '555-0125'),
        ('Sarah', 'Wilson', 'sarah.w@email.com', '555-0126'),
        ('David', 'Brown', 'david.brown@email.com', '555-0127')
      `);

      // Insert sample categories
      runQuery(db, `
        INSERT OR IGNORE INTO category (name, parent_id) VALUES
        ('Electronics', NULL),
        ('Clothing', NULL),
        ('Home & Garden', NULL),
        ('Smartphones', 1),
        ('Laptops', 1),
        ('Men Clothing', 2),
        ('Women Clothing', 2),
        ('Kitchen', 3),
        ('Furniture', 3)
      `);

      // Insert sample products
      runQuery(db, `
        INSERT OR IGNORE INTO product (sku, name, description, price, stock, is_active) VALUES
        ('PHONE001', 'iPhone 15 Pro', 'Latest Apple smartphone with A17 Pro chip', 999.99, 25, 1),
        ('PHONE002', 'Samsung Galaxy S24', 'Flagship Android phone with AI features', 899.99, 30, 1),
        ('LAPTOP001', 'MacBook Air M3', '13-inch laptop with M3 chip, 8GB RAM, 256GB SSD', 1199.99, 15, 1),
        ('LAPTOP002', 'Dell XPS 13', 'Ultra-thin Windows laptop with Intel i7', 1099.99, 20, 1),
        ('SHIRT001', 'Cotton T-Shirt Blue', 'Premium cotton t-shirt in navy blue', 29.99, 100, 1),
        ('SHIRT002', 'Formal White Shirt', 'Classic white dress shirt for business', 79.99, 50, 1),
        ('DRESS001', 'Summer Floral Dress', 'Light cotton dress with floral pattern', 89.99, 35, 1),
        ('KITCHEN001', 'Stainless Steel Blender', 'High-power blender for smoothies and soups', 149.99, 40, 1),
        ('CHAIR001', 'Ergonomic Office Chair', 'Comfortable chair with lumbar support', 299.99, 12, 1),
        ('TABLE001', 'Wooden Dining Table', 'Oak dining table seats 6 people', 599.99, 8, 1)
      `);

      // Insert product-category relationships
      runQuery(db, `
        INSERT OR IGNORE INTO product_category (product_id, category_id) VALUES
        (1, 1), (1, 4),  -- iPhone: Electronics, Smartphones
        (2, 1), (2, 4),  -- Samsung: Electronics, Smartphones
        (3, 1), (3, 5),  -- MacBook: Electronics, Laptops
        (4, 1), (4, 5),  -- Dell: Electronics, Laptops
        (5, 2), (5, 6),  -- Blue T-shirt: Clothing, Men Clothing
        (6, 2), (6, 6),  -- White Shirt: Clothing, Men Clothing
        (7, 2), (7, 7),  -- Dress: Clothing, Women Clothing
        (8, 3), (8, 8),  -- Blender: Home & Garden, Kitchen
        (9, 3), (9, 9),  -- Chair: Home & Garden, Furniture
        (10, 3), (10, 9) -- Table: Home & Garden, Furniture
      `);

      // Insert sample orders
      runQuery(db, `
        INSERT OR IGNORE INTO orders (customer_id, status, note) VALUES
        (1, 'paid', 'Express delivery requested'),
        (2, 'shipped', 'Standard shipping'),
        (3, 'new', 'Customer called to confirm address'),
        (4, 'paid', NULL),
        (5, 'cancelled', 'Customer requested cancellation')
      `);

      // Insert order items
      runQuery(db, `
        INSERT OR IGNORE INTO order_item (order_id, product_id, qty, unit_price, discount) VALUES
        (1, 1, 1, 999.99, 0),     -- John bought iPhone
        (1, 8, 1, 149.99, 15.00), -- John also bought blender with discount
        (2, 3, 1, 1199.99, 0),    -- Jane bought MacBook
        (2, 5, 2, 29.99, 0),      -- Jane bought 2 t-shirts
        (3, 7, 1, 89.99, 0),      -- Mike bought dress
        (4, 2, 1, 899.99, 50.00), -- Sarah bought Samsung with discount
        (4, 9, 1, 299.99, 0)      -- Sarah bought office chair
      `);

      console.log('Sample data inserted successfully');
    }
  } catch (error) {
    console.log(`Error init-db. e: ${error}`);
    throw error
  }
}

init_db(true);