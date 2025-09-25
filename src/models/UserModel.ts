import Joi from "joi";
import { ValidationError } from "./exeptions";

class UserModel {
    id?: number;
    username: string;
    password?: string;
    email: string;
    token?: string;
    isAdmin: boolean;
   
    private static validateSchema = Joi.object({
        id: Joi.number().optional().positive(),
        username: Joi.string().required().min(2).max(20),
        password: Joi.string().required().min(4).max(20),
        email: Joi.string().email(),
        isAdmin: Joi.boolean().optional(),
        token: Joi.string().max(200).optional()
    })


    constructor(user: UserModel) {
        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.token = user.token;
        this.isAdmin = user.isAdmin || false;

        console.log("from ctor", user.isAdmin, this.isAdmin);
        
    }


    validate() {
        const res = UserModel.validateSchema.validate(this);                       
        if (res.error)
            throw new ValidationError(res.error.details[0].message);
    }
}


export default UserModel;