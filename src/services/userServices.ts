import { runQuery } from "../dal/dal";
import { UnauthorizedError } from "../models/exeptions";
import UserModel from "../models/UserModel";
import { createToken } from "../utils/helpers/authHelpers";

export async function createUser(user: Partial<UserModel>): Promise<string> {
    
    user.validate();

    let q = `INSERT INTO "user" (username, email, password_hash)
             VALUES ('${user.username}', '${user.email}', '${user.password}')
    `

    await runQuery(q);

    const token = createToken(user);
    
    // optional: update DB with the new created token

    return token;
}


export async function login(email: string, password: string):Promise<string> {
    /* If given credentials are ok, generate and return new token  */

    const q = `SELECT * FROM "user" 
                WHERE email='${email}' 
                AND password_hash='${password}'`

    const res = await runQuery(q) as any;

    if (res.length !== 1)
        throw new UnauthorizedError();
    
    const um = new UserModel(res[0])
    const token = createToken(um);

    // optional: update DB with the new created token

    return token;
    
}