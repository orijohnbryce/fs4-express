import { runQuery } from "../dal/dal";
import { UnauthorizedError } from "../models/exeptions";
import UserModel from "../models/UserModel";
import { createToken } from "../utils/helpers/authHelpers";

export async function createUser(user: UserModel) {
    user.validate();
  
    // Todo: password should not be saved as is in DB. Need to use an encrypted password instead.
   
    // create user (new id will generated)
    let q = `insert into "user" (username, email, password_hash) 
        values ('${user.username}', '${user.email}', '${user.password}')`;

    console.log(q);
    
    const res = await runQuery(q) as any;
    const id = res.lastInsertRowid;
          
    // create new token and save it to db
    user.token = createToken(user);
    q = `update "user" set token='${user.token}' where email='${user.email}'`;
    await runQuery(q);  
  
    return user.token;
  }
  

  export async function login(email: string, password: string) {
    /* if credentials are OK, will return new token (and save it to db) 
       
    Up to you (the developer) to return old token or create new.
   */
  
  
    let q = `select * from "user" WHERE email='${email}' AND password_hash='${password}';`;    
    const res = await runQuery(q) as any;
    if (res.length !== 1) {
      throw new UnauthorizedError("email or password incorrect!");
    }
    
    console.log(res[0]);
    res[0].isAdmin = res[0].is_admin;
    const um = new UserModel(res[0]);

    console.log(um);
    
    // create token:
    const token = createToken(um);
    q = `update "user" set token='${token}' WHERE email='${email}'`;    
    await runQuery(q);
    return token;
  }
  