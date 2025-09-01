// db.ts
import fs from "fs";
import path from "path";
import Database, { Database as DB } from "better-sqlite3";

export function openDb(dbFile = "sqlite.db"): DB {
  const full = path.resolve(process.cwd(), dbFile);
  if (!fs.existsSync(full)) fs.writeFileSync(full, "");
  const db = new Database(full, {
    fileMustExist: false,
    verbose: undefined, // set to console.log to see queries
  });
  
  db.pragma("foreign_keys = ON");
  
  return db;
}

export function initShopSchema(db: DB): void {
  const ddl = `
    PRAGMA foreign_keys = ON;

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
      SKU          TEXT    NOT NULL UNIQUE,       -- stock keeping unit
      stock        INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
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
      status        TEXT    NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new','paid','shipped','cancelled','refunded')),
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
      discount      REAL    NOT NULL DEFAULT 0 CHECK (discount >= 0), -- absolute or % (interpret in app)
      FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES product(id)  ON DELETE RESTRICT
    );

    -- Helpful indexes
    CREATE INDEX IF NOT EXISTS idx_order_customer    ON orders(customer_id);
    CREATE INDEX IF NOT EXISTS idx_item_order        ON order_item(order_id);
    CREATE INDEX IF NOT EXISTS idx_item_product      ON order_item(product_id);
    CREATE INDEX IF NOT EXISTS idx_prod_sku_active   ON product(SKU, is_active);
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