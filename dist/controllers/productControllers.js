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
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const productServices_1 = require("../services/productServices");
const statusCode_1 = require("../models/statusCode");
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const verifyTokenAdminMW_1 = require("../middlewares/verifyTokenAdminMW");
const exceptions_1 = require("../models/exceptions");
// import { productImagesPrefix } from "../utils/config";
const path_1 = __importDefault(require("path"));
const config_1 = require("../utils/config");
exports.productRoutes = express_1.default.Router();
exports.productRoutes.get("/products-paged", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const products = yield (0, productServices_1.getProductsPaged)(page || 1, limit || 5);
    res.status(statusCode_1.StatusCode.Ok).json(products);
}));
exports.productRoutes.get("/products/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pid = Number(req.params.id);
        if (isNaN(pid)) {
            res.status(statusCode_1.StatusCode.BadRequest).send("id must be positive number");
            return;
        }
        const product = yield (0, productServices_1.getProductById)(pid);
        res.status(statusCode_1.StatusCode.Ok).json(product);
    }
    catch (error) {
        next(error); // since Express 5.X this is redundant
    }
}));
exports.productRoutes.get("/products", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const name = req.query.name ? String(req.query.name) : undefined;
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    // (name?: string, minPrice?: number, maxPrice?: number, categoryId?: number)
    const products = yield (0, productServices_1.getProducts)(name, minPrice, maxPrice, categoryId);
    res.status(200).json(products);
}));
exports.productRoutes.post("/products", verifyTokenAdminMW_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = new ProductModel_1.default(undefined, req.body.sku, req.body.name, req.body.isActive ? req.body.isActive : 1, req.body.price, req.body.stock, req.body.description);
    const newId = yield (0, productServices_1.addProduct)(newProduct);
    res.status(statusCode_1.StatusCode.Ok).send(newId);
}));
exports.productRoutes.post("/product-image/:productId", verifyTokenAdminMW_1.verifyTokenAdminMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = Number(req.params.productId);
    const files = req.files;
    const image = files === null || files === void 0 ? void 0 : files["image"];
    if (!image)
        throw new exceptions_1.ValidationError("'image' is require");
    const imagePath = yield (0, productServices_1.saveProductImage)(productId, image);
    res.status(statusCode_1.StatusCode.Created).json({
        message: "image added",
        imagePath
    });
}));
exports.productRoutes.get("/product-image/:imagePath", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const imageFullPath = path_1.default.resolve(config_1.appConfig.productImagesPrefix, req.params.imagePath);
    res.sendFile(imageFullPath);
}));
