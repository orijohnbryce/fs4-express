import { runQuery } from "../dal/dal";
import { AppException, UnauthorizedError, UnknownError } from "../models/exceptions";
import UserModel from "../models/UserModel";
import { createToken } from "../utils/helpers/authHelpers";
import bcrypt from "bcrypt"

export async function createUser(user: Partial<UserModel>): Promise<string> {

    user.validate();
    
    // TODO: better to use UUID as id for user, instead of auto-increment.

    const passwordHash = await bcrypt.hash(user.password + process.env.HASH_PEPPER, 12)

    let q = `INSERT INTO "user" (username, email, password_hash)
             VALUES (?, ?, ?)
    `

    console.log("dbg", q);
    
    await runQuery(q, [user.username, user.email, String(passwordHash)]);

    const token = createToken(user);

    // optional: update DB with the new created token

    return token;
}


export async function login(email: string, password: string): Promise<string> {
    /* If given credentials are ok, generate and return new token  */

    // sql-injection risk
    // const q = `SELECT * FROM "user" WHERE email='${email}' AND password_hash='${password}'`
    // "email": "admin@email.com' -- "  // sql injection risk

    // sql-injection protected:

    // const q = `SELECT * FROM "user" WHERE email=? AND password_hash=?`        
    // const res = await runQuery(q, [email, password]) as any;

    const q = `SELECT * FROM "user" WHERE email=?`    
    const res = await runQuery(q, [email]) as any;

    const user = res[0];
    const pepper = process.env.HASH_PEPPER;
    
    const match = await bcrypt.compare(password + pepper, user.password_hash)

    if (!match){
        throw new UnauthorizedError();
    }

    if (res.length !== 1)
        throw new UnauthorizedError();

    const um = new UserModel(user)
    const token = createToken(um);

    // optional: update DB with the new created token

    return token;

}


export async function getAllUsers() {
    const q = `SELECT * FROM 'user'`;
    const rawUsers = await runQuery(q) as any;

    const users = rawUsers.map((u: any) => {
        return new UserModel(u)
    })
    return users;
}

export async function deleteUser(id: number) {
    // 1. need to delete all orders that belong to customer that linked to user
    // 2. need to delete the customer that linked to the user
    // 3. delete the user
    throw new UnknownError("Not Implemented Yet");
}