import { NextFunction, Request, Response, Router } from "express";
import UserModel from "../models/UserModel";
import { createUser, deleteUser, getAllUsers, login } from "../services/userServices";
import { StatusCode } from "../models/statusCode";
import { ValidationError } from "../models/exceptions";
import { verifyTokenAdminMW } from "../middlewares/verifyTokenAdminMW";


export const authRouter = Router();

authRouter.post("/user/register", async (req: Request, res: Response, next: NextFunction) => {
    try {

        const um = new UserModel(req.body);
        const token = await createUser(um);

        res.status(StatusCode.Created).json(token);
    } catch (error: any) {
        if (error?.message?.includes("UNIQUE constraint")) {
            next(new ValidationError(error.message))
        }
        next(error);
    }
})

authRouter.post("/user/login", async (req: Request, res: Response, next: NextFunction) => {
    const token = await login(req.body.email, req.body.password);
    res.status(StatusCode.Ok).json(token);
})

authRouter.get("/users", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
    const users = await getAllUsers();
    res.status(StatusCode.Ok).json(users);
})

authRouter.delete("/users/:id", verifyTokenAdminMW, async (req: Request, res: Response, next: NextFunction) => {
    
    // we have access to "user" since it was added by the MW:
    console.log(res.locals.user);    

    const id = Number(req.params.id)
    await deleteUser(id);
    res.status(StatusCode.Ok).send("successfully deleted");
})