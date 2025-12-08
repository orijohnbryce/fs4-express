import { GoogleGenAI } from "@google/genai";
import { runQuery } from "../dal/dal";

const GOOGLE_KEY = ""


function get_system_msg(){
    return `
You are a SQL query generator, you should generate an SQL query for retriving data that use asks.

Your response must look like this:

{
"action": "response" / "query",
"string": <response string> / <sql query string>
}

If you can answer immdeditely, use action=response, else, use "query".

The DB schema is:

CREATE TABLE IF NOT EXISTS "user" (
    id INTEGER  PRIMARY KEY AUTOINCREMENT 
    email TEXT NOT NULL UNIQUE 
    username TEXT NOT NULL 
    password_hash TEXT NOT NULL 
    isAdmin INTEGER NOT NULL DEFAULT 0 CHECK (isAdmin IN (0 1)) 
    token TEXT
    );
CREATE TABLE sqlite_sequence(name seq);
CREATE TABLE customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT 
    user_id INTEGER UNIQUE 
    first_name TEXT NOT NULL 
    last_name TEXT NOT NULL 
    email TEXT NOT NULL UNIQUE 
    phone TEXT 
    created_at TEXT NOT NULL DEFAULT (datetime('now')) 

    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE RESTRICT
);
CREATE TABLE product (
    id INTEGER PRIMARY KEY AUTOINCREMENT 
    sku TEXT NOT NULL UNIQUE 
    name TEXT NOT NULL 
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0  1)) 
    price REAL NOT NULL CHECK(price > 0) 
    stock INTEGER NOT NULL CHECK(stock >= 0) 
    description TEXT    
);
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT 
    customer_id INTEGER NOT NULL 
    address TEXT 
    order_date TEXT NOT NULL DEFAULT (datetime('now')) 
    status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new' 'canceled' 'shipped')) 
    note TEXT 

    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE RESTRICT
);
CREATE TABLE orders_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT   -- could be combination of p-id and o-id
    order_id INTEGER NOT NULL 
    product_id INTEGER NOT NULL 
    qty INTEGER NOT NULL CHECK(qty >0) 
    price REAL NOT NULL CHECK(price >0) 
    discount REAL NOT NULL DEFAULT 0 CHECK(discount >= 0) 

    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE RESTRICT
);
CREATE TABLE category (
    id INTEGER PRIMARY KEY AUTOINCREMENT 
    name TEXT NOT NULL UNIQUE 
    parent_id INTEGER 

    FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE RESTRICT
);
CREATE TABLE product_category (
    id INTEGER PRIMARY KEY AUTOINCREMENT 
    category_id INTEGER NOT NULL 
    product_id INTEGER NOT NULL 

    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT 
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE RESTRICT
);
CREATE INDEX idx_product_category ON product_category(category_id);
CREATE TABLE product_image (
    id INTEGER PRIMARY KEY AUTOINCREMENT 
    product_id INTEGER NOT NULL 
    image_path TEXT NOT NULL 

    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);



IMPORTANT: your response should be pure string that ready to be load into json, w/o any decorations as \`\`\`  or \`\`\`/json or so.
`
}


export async function queryGemini(
    prompt: string
): Promise<string> {

    const apiKey = GOOGLE_KEY // TODO: load from env.

    // Initialize the GoogleGenAI client with the provided API key
    const GenAiClient = new GoogleGenAI({ apiKey: apiKey });

    const sm = get_system_msg().replace("{{date}}", String(new Date()))

    // Call the generateContent method on a model
    const response = await GenAiClient.models.generateContent({
        model: "gemini-2.5-flash", // A fast, cost-effective model
        contents: [
            // { role: "system", parts: [{ text: get_system_msg() }] },
            { role: "user", parts: [{ text: prompt }] }
        ],
        config: {
            systemInstruction: sm,
        }
    });

    // Return the text from the response
    const aiResponse =  response.text;
    const resJ = JSON.parse(aiResponse)
    const action = resJ.action;
    const string = resJ.string;

    if (action === "query"){
        console.log(string);
        
        const resDB = await runQuery(string)
        return JSON.stringify(resDB)
        // console.log(resDB);
        // return "Response from DB printed to console"        
    } else{
        return string;
    }
}
