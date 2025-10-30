"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsPaged = getProductsPaged;
exports.getProductById = getProductById;
exports.getProducts = getProducts;
exports.deleteProduct = deleteProduct;
exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.saveProductImage = saveProductImage;
const dal_1 = require("../dal/dal");
const exceptions_1 = require("../models/exceptions");
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const categoryServices_1 = require("./categoryServices");
// import { productImagesPrefix } from "../utils/config";
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = require("../utils/config");
function getProductsPaged() {
    return __awaiter(this, arguments, void 0, function* (page = 1, limit = 5) {
        const q = `SELECT * FROM product LIMIT(${limit}) OFFSET(${(page - 1) * limit})`;
        const res = yield (0, dal_1.runQuery)(q);
        const products = [];
        res.map((row) => products.push(new ProductModel_1.default(row.id, row.sku, row.name, row.isActive, row.price, row.stock, row.description)));
        const countQ = "select count(id) as count from product";
        const countRes = yield (0, dal_1.runQuery)(countQ);
        console.log(countRes);
        const pagedRes = {
            total: countRes[0].count,
            page: page,
            limit: limit,
            results: products,
        };
        if (page * limit < (countRes[0].count)) {
            pagedRes.next = `http://localhost:3030/products-paged?page=${page + 1}`;
        }
        return pagedRes;
    });
}
function getProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `SELECT * FROM product WHERE id=?`;
        const res = yield (0, dal_1.runQuery)(q, [id]);
        const row = res[0];
        if (res.length == 0)
            // return null;
            // throw new Error("Product not found!");
            throw new exceptions_1.NotFoundError(`Product with id ${id} not found!`);
        const imagesQ = `SELECT image_path FROM product_image
                     WHERE product_id=?`;
        const imagesRows = yield (0, dal_1.runQuery)(imagesQ, [id]);
        const imagePaths = imagesRows.map((im) => `http://localhost:3030/product-image/${im.image_path}`);
        const p = new ProductModel_1.default(row.id, row.sku, row.name, row.isActive, row.price, row.stock, row.description, imagePaths);
        return p;
    });
}
function getProducts(name, minPrice, maxPrice, categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        let q = `SELECT p.* FROM product p`;
        if (categoryId != undefined) {
            const categoryIds = yield (0, categoryServices_1.getAllCategoriesById)(categoryId);
            q += ` JOIN product_category pc ON  pc.product_id = p.id WHERE pc.category_id IN (${categoryIds.join(",")}) AND p.is_active=1`;
        }
        else {
            q += ` WHERE p.is_active=1`;
        }
        const params = [];
        if (name) {
            q += ` AND p.name LIKE '%${name}%'`;
            params.push(name);
        }
        if (minPrice != undefined) {
            q += ` AND p.price >= ${minPrice}`;
            params.push(minPrice);
        }
        if (maxPrice != undefined) {
            q += ` AND p.price <= ${maxPrice}`;
            params.push(maxPrice);
        }
        const res = yield (0, dal_1.runQuery)(q, params);
        const products = [];
        res.map((row) => products.push(new ProductModel_1.default(row.id, row.sku, row.name, row.isActive, row.price, row.stock, row.description)));
        return products;
    });
}
function deleteProduct(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `DELETE FROM product WHERE ID = ?`;
        yield (0, dal_1.runQuery)(q, [productId]);
    });
}
// export async function addProduct(product: Omit<ProductModel, 'id'>) {
function addProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
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
    `;
        console.log(q);
        const res = yield (0, dal_1.runQuery)(q);
        return res.lastInsertRowid;
    });
}
function updateProduct(p) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `
    UPDATE product SET 
    sku = '${p.sku}',
    name = '${p.name}',
    is_active = ${p.isActive ? 1 : 0},
    price = ${p.price},
    stock = ${p.stock},
    description = '${p.description || "NULL"}'
    `;
        yield (0, dal_1.runQuery)(q);
    });
}
function saveProductImage(productId, image) {
    return __awaiter(this, void 0, void 0, function* () {
        // my_file.txt
        const uuidString = (0, uuid_1.v4)();
        const lastDot = image.name.lastIndexOf(".");
        const imageName = uuidString + image.name.substring(lastDot);
        const fullPath = path_1.default.join(config_1.appConfig.productImagesPrefix, imageName);
        yield image.mv(fullPath);
        const q = `INSERT INTO product_image (product_id, image_path)  VALUES (${productId}, '${imageName}')`;
        console.log(q);
        yield (0, dal_1.runQuery)(q);
        return fullPath;
    });
}
