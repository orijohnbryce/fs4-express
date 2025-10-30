"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("./exceptions");
const joi_1 = __importDefault(require("joi"));
class ProductModel {
    constructor(id, sku, name, isActive, price, stock, description, images) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.isActive = isActive;
        this.price = price;
        this.stock = stock;
        this.description = description;
        this.images = images;
        //// for testing
        // throw new Error("This is Test Error");
    }
    validate() {
        const res = ProductModel.validationSchema.validate(this);
        if (res.error) {
            throw new exceptions_1.ValidationError(res.error.details[0].message + ` , but you sent \"${res.error.details[0].context.value}\"`);
        }
        // if (!this.sku) throw new ValidationError("sku is required");
        // if (!this.name) throw new ValidationError("name is required");
        // if (this.name.length < 2) throw new ValidationError("name must be at list 2 characters");
        // if (this.name.length > 100) throw new ValidationError("name too long");
        // if (!this.price) throw new ValidationError("price is required");
        // if (this.price > 10000) throw new ValidationError("price too high");
        // if (this.price < 0) throw new ValidationError("price must be positive number");
    }
}
ProductModel.validationSchema = joi_1.default.object({
    name: joi_1.default.string().required().min(3).max(20),
    price: joi_1.default.number().required().positive().max(1000000),
    sku: joi_1.default.string().required(),
    stock: joi_1.default.number().required(),
    description: joi_1.default.string().optional(),
    id: joi_1.default.number().positive().optional(),
    isActive: joi_1.default.boolean().optional()
});
exports.default = ProductModel;
// const p = new ProductModel(12, "sdfsdf", "banana", true, 300, 3, "this is descriptoin" )
