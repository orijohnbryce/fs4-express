import { NextFunction, Request, Response, Router } from "express";
import UserModel from "../models/UserModel";
import { createUser, login } from "../services/userServices";
import { StatusCode } from "../models/statusCode";
import { ValidationError } from "../models/exeptions";

export const authRouter = Router();


// add new user (register)
authRouter.post(
  "/user/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const um = new UserModel(req.body);

      const token = await createUser(um);  // service
      res.status(StatusCode.Created).json(token);
    } catch (error: any) {
      if (error?.message?.includes(
 		"UNIQUE constraint failed: user.email")) 
 	{
        next(new ValidationError("Email already taken."));
      } else next(error);
    }
  }
);


// login - create token
authRouter.post(
    "/user/login",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = await login(req.body.email, req.body.password);
        res.status(StatusCode.Ok).json(token);
      } catch (error) {
        next(error);  // redundent
      }
    }
  );
  