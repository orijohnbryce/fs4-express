import UserModel from "../../models/UserModel";
import jwt from "jsonwebtoken";
import { tokenSecretKey } from "../config";
import { UnauthorizedError } from "../../models/exeptions";

export function createToken(user: Partial<UserModel>): string {
    const userWithoutPassword = {...user}
    delete userWithoutPassword.password;

    const container = { userWithoutPassword };
    
    const token = jwt.sign(container, tokenSecretKey)

    return token;
}


export function verifyToken(token:string, adminRequired: boolean=false) {
    try {        
        const res = jwt.verify(token, tokenSecretKey) as {userWithoutPassword: UserModel};

        if (adminRequired && !res.userWithoutPassword.isAdmin)
            throw "sdf"

    } catch (error) {
        throw new UnauthorizedError();
    }
}



// createToken({id: 123, username: "david", password: "123", email: "david@email.com", isAdmin: true})
// verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2l0aG91dFBhc3N3b3JkIjp7ImlkIjoxMjMsInVzZXJuYW1lIjoiZGF2aWQiLCJlbWFpbCI6ImRhdmlkQGVtYWlsLmNvbSIsImlzQWRtaW4iOnRydWV9LCJpYXQiOjE3NTg4MTg5Mjl9.EwFrwLJ2ET-9rFr8t7OM2Pe1JFoVUjwQYzC3mv8UK7o")