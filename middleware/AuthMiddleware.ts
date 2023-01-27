import express from "express";
import { UserController } from "../controller";

const userController = new UserController();

async function Auth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const header = req.headers.authorization?.split(" ")[1];
  if (header) {
    const user = await userController.findUserByValue(header);
    if (user) {
      req.body.user = user;
      req.body.isLogin = true;
    }
  }
  next();
}

export { Auth };
