import { Database as DB } from "better-sqlite3";
import { openDb, runQuery } from "./dal";


function initDbSchema(db: DB): void {

    const ddl = `

    CREATE TABLE IF NOT EXISTS "user" (
    id INTEGER  PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    isAdmin INTEGER NOT NULL DEFAULT 0 CHECK (isAdmin IN (0,1)),
    token TEXT
    );


    CREATE TABLE IF NOT EXISTS customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
    price REAL NOT NULL CHECK(price > 0),
    stock INTEGER NOT NULL CHECK(stock >= 0),
    description TEXT    
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    address TEXT,
    order_date TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','canceled','shipped')),
    note TEXT,

    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE RESTRICT
);


CREATE TABLE IF NOT EXISTS orders_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- could be combination of p-id and o-id
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    qty INTEGER NOT NULL CHECK(qty >0),
    price REAL NOT NULL CHECK(price >0),
    discount REAL NOT NULL DEFAULT 0 CHECK(discount >= 0),

    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    parent_id INTEGER,

    FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS product_category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,

    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE RESTRICT
);


CREATE INDEX IF NOT EXISTS idx_product_category ON product_category(category_id);
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

function generateSampleData() {

    // --- Categories ---
    runQuery("INSERT INTO category (name) VALUES ('Electronics');");
    runQuery("INSERT INTO category (name) VALUES ('Clothing');");
    runQuery("INSERT INTO category (name) VALUES ('Books');");

    runQuery("INSERT INTO category (name, parent_id) VALUES ('Laptops', 1);");
    runQuery("INSERT INTO category (name, parent_id) VALUES ('Smartphones', 1);");

    // --- Products ---
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1001','Laptop Pro 15','1200.00',10,'High performance laptop')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1002','Laptop Air 13','900.00',15,'Lightweight laptop')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1003','Smartphone X','800.00',20,'Flagship smartphone')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1004','Smartphone Y','600.00',25,'Affordable smartphone')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1005','Wireless Mouse','25.00',100,'Ergonomic wireless mouse')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1006','Mechanical Keyboard','75.00',50,'RGB mechanical keyboard')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1007','Headphones','60.00',40,'Noise cancelling headphones')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1008','Smartwatch','200.00',30,'Fitness smartwatch')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1009','T-Shirt','15.00',80,'Cotton T-shirt')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1010','Jeans','40.00',60,'Denim jeans')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1011','Jacket','70.00',25,'Winter jacket')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1012','Novel A','12.00',100,'Bestselling novel')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1013','Novel B','14.00',90,'Popular novel')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1014','Cookbook','20.00',50,'Healthy recipes cookbook')");
    runQuery("INSERT INTO product (sku, name, price, stock, description) VALUES ('SKU1015','Children Book','10.00',70,'Kids storybook')");

    // --- Product-Category mapping ---
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (1,4)"); //--Laptop Pro -> Laptops
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (2,4)"); //--Laptop Air -> Laptops
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (3,5)"); //--Smartphone X -> Smartphones
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (4,5)"); //--Smartphone Y -> Smartphones
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (5,1)"); //--Mouse -> Electronics
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (6,1)"); //--Keyboard -> Electronics
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (7,1)"); //--Headphones -> Electronics
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (8,1)"); //--Smartwatch -> Electronics
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (9,2)"); //--T - shirt -> Clothing
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (10,2)"); //--Jeans -> Clothing
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (11,2)"); //--Jacket -> Clothing
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (12,3)"); //--Novel A -> Books
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (13,3)"); //--Novel B -> Books
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (14,3)"); //--Cookbook -> Books
    runQuery("INSERT INTO product_category (product_id, category_id) VALUES (15,3)"); //--Children Book -> Books

    // --- users  ---
    runQuery(`INSERT INTO "user" (email, username, password_hash, isAdmin) VALUES ('admin@email.com', 'admin', 'admin', 1)`);
    runQuery(`INSERT INTO "user" (email, username, password_hash, isAdmin) VALUES ('u1@email.com', 'u1', '1234', 0)`);
    runQuery(`INSERT INTO "user" (email, username, password_hash, isAdmin) VALUES ('u2@email.com', 'u2', '1234', 0)`);
    runQuery(`INSERT INTO "user" (email, username, password_hash, isAdmin) VALUES ('u3@email.com', 'u3', '1234', 0)`);
    runQuery(`INSERT INTO "user" (email, username, password_hash, isAdmin) VALUES ('u4@email.com', 'u4', '1234', 0)`);

    // --- Customers ---
    runQuery("INSERT INTO customer (first_name, last_name, email, phone, user_id) VALUES ('Alice','Smith','alice@example.com','111-222-3333', 2)");
    runQuery("INSERT INTO customer (first_name, last_name, email, phone, user_id) VALUES ('Bob','Johnson','bob@example.com','222-333-4444', 3)");
    runQuery("INSERT INTO customer (first_name, last_name, email, phone, user_id) VALUES ('Carol','Williams','carol@example.com','333-444-5555', 4)");
    runQuery("INSERT INTO customer (first_name, last_name, email, phone, user_id) VALUES ('David','Brown','david@example.com','444-555-6666', 5)");

    // --- Orders ---
    runQuery("INSERT INTO orders (customer_id, address, status, note) VALUES (1,'123 Main St','new','First order by Alice')");
    runQuery("INSERT INTO orders (customer_id, address, status, note) VALUES (2,'456 Park Ave','shipped','Bob order shipped')");
    runQuery("INSERT INTO orders (customer_id, address, status, note) VALUES (3,'789 Oak Rd','new','Carol new order')");
    runQuery("INSERT INTO orders (customer_id, address, status, note) VALUES (4,'321 Pine Ln','canceled','David canceled order')");
    runQuery("INSERT INTO orders (customer_id, address, status, note) VALUES (1,'123 Main St','shipped','Alice second order')");
    runQuery("INSERT INTO orders (customer_id, address, status, note) VALUES (2,'456 Park Ave','new','Bob second order')");

    // --- Orders_Product ---
    runQuery("INSERT INTO orders_product (order_id, product_id, qty, price) VALUES (1,1,1,1200)"); //Alice bought Laptop Pro
    runQuery("INSERT INTO orders_product (order_id, product_id, qty, price) VALUES (1,5,2,25)"); //Alice added 2 mice
    runQuery("INSERT INTO orders_product (order_id, product_id, qty, price) VALUES (2,3,1,800)"); //Bob bought Smartphone X
    runQuery("INSERT INTO orders_product (order_id, product_id, qty, price) VALUES (2,7,1,60)"); //Bob added headphones
    runQuery("INSERT INTO orders_product (order_id, product_id, qty, price) VALUES (3,9,3,15)"); //Carol bought T - shirts
    runQuery("INSERT INTO orders_product (order_id, product_id, qty, price) VALUES (4,10,1,40)"); //David ordered jeans(later canceled)
    runQuery("INSERT INTO orders_product (order_id, product_id, qty, price) VALUES (5,2,1,900)"); //Alice bought Laptop Air
    runQuery("INSERT INTO orders_product (order_id, product_id, qty, price) VALUES (6,12,2,12)"); //Bob bought 2 novels

    
}

console.log("Starting init DB");

// openDb().then((db)=>{
//     initDbSchema(db);
//     console.log("Done init DB");
// })
// generateSampleData();

