import Joi from "joi";
import { ValidationError } from "./exceptions";

class UserModel {
    id?: number;
    username: string;
    email: string;
    password?: string;
    token?: string;
    isAdmin: boolean;

    constructor(
        user: UserModel
    ) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.token = user.token;
        this.isAdmin = user.isAdmin;
    }

    private static validationSchema = Joi.object({
        id: Joi.number().optional().positive(),
        username: Joi.string().required().min(3).max(20),
        password: Joi.string().required().min(4).max(20), // todo: add regex for strong password requirements
        email: Joi.string().email(),
        isAdmin: Joi.boolean().optional(),
        token: Joi.string().max(300).optional()
    })

    validate(){
        const res = UserModel.validationSchema.validate(this);
        if (res.error)
            throw new ValidationError(res.error.details[0].message);
    }
}

export default UserModel