import { ValidationError } from "./exeptions";
import Joi from "joi";

export default class ProductModel {
    id?: number;
    sku: string;
    name: string;
    isActive: boolean;
    price: number;
    stock: number;
    description?: string;
    

    constructor(
        id: number | undefined,
        sku: string,
        name: string,
        isActive: boolean,
        price: number,
        stock: number,
        description?: string
    ){
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.isActive = isActive;
        this.price = price;
        this.stock = stock;
        this.description = description

        //// for testing
        // throw new Error("This is Test Error");
        
    }

    private static validationSchema = Joi.object({
        name: Joi.string().required().min(3).max(20),
        price: Joi.number().required().positive().max(1000000),
        sku: Joi.string().required(),
        stock: Joi.number().required(),
        description: Joi.string().optional(),
        id: Joi.number().positive().optional(),
        isActive: Joi.boolean().optional()
    })

    public validate()  {
        const res = ProductModel.validationSchema.validate(this);
        if (res.error){                       
            throw new ValidationError(res.error.details[0].message + ` , but you sent \"${res.error.details[0].context.value}\"`)
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

// const p = new ProductModel(12, "sdfsdf", "banana", true, 300, 3, "this is descriptoin" )
