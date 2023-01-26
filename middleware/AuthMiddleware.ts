import express from "express";
import { AuthController } from "../controller";

const authController = new AuthController();

async function Auth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const header = req.headers.authorization?.split(" ")[1];
  if (header) {
    const user = await authController.findUserByValue(header);
    req.body.user = user;
    req.body.isLogin = true;
  }
  next();
}

export { Auth };
