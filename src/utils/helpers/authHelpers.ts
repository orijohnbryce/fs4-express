import jwt from "jsonwebtoken";
import UserModel from "../../models/UserModel";
import { tokenSecreteKey } from "../config";
import { UnauthorizedError } from "../../models/exeptions";

export function createToken(user: UserModel): string {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    console.log(userWithoutPassword);
    

    const container = { userWithoutPassword }; // token container
    // const option = { expiresIn: "3h" };
    const option = {};
    const token = jwt.sign(container,
        // appConfig.tokenSecreteKey, option
        tokenSecreteKey, option
    );
    return token;
}


export function verifyToken(token: string,
    adminRequired: boolean = false): UserModel {
    /% throw exception or return UserModel if ok  %/


    if (!token) throw new UnauthorizedError();

    try {
        // verify will throw error if not valid  
        const res = jwt.verify(token, tokenSecreteKey) as any; // { userWithoutPassword: UserModel };
        console.log(res);
        

        console.log(res.userWithoutPassword);
        
        if (adminRequired && !res.userWithoutPassword.isAdmin) {
            throw new UnauthorizedError("admin permissions require!");
        }
        return res.userWithoutPassword;
    } catch (error) {
        throw new UnauthorizedError()
    }
}
