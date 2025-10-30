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
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const orderServices_1 = require("../services/orderServices");
const statusCode_1 = require("../models/statusCode");
const exceptions_1 = require("../models/exceptions");
const verifyTokenMW_1 = require("../middlewares/verifyTokenMW");
exports.orderRoutes = express_1.default.Router();
exports.orderRoutes.post("/order", verifyTokenMW_1.verifyTokenMW, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        customerId: req.body.customerId,
        address: req.body.address,
        status: req.body.status,
        notes: req.body.notes,
        products: req.body.products,
    };
    if (typeof (data.customerId) !== "number" ||
        typeof (data.customerId) === undefined ||
        data.customerId <= 0 ||
        data.products.length < 1) {
        throw new exceptions_1.ValidationError("wrong args data");
    }
    const newOrderId = yield (0, orderServices_1.createOrder)(data);
    res.status(statusCode_1.StatusCode.Ok).send(`Order created. id: ${newOrderId}`);
}));
exports.orderRoutes.get("/customer-orders/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = Number(req.params.id);
    const returnData = {};
    const orders = yield (0, orderServices_1.getOrderByCustomerId)(customerId);
    for (const o of orders) {
        const orderProducts = yield (0, orderServices_1.getOrderProducts)(o.id);
        returnData[o.id] = {
            orderDate: o.orderDate,
            status: o.status,
            note: o.note,
            products: orderProducts
        };
    }
    res.status(statusCode_1.StatusCode.Ok).json(returnData);
}));
