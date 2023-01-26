import { client } from "../database";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  hashPassword,
  generateToken,
  comparePassword,
} from "../utilities/auth";
import { validateError } from "../utilities/error";

class AuthController {
  constructor() {}

  public async handshake(req: Request, res: Response) {
    try {
      await client.connect();
      await client.close();
      res.status(200).send({});
    } catch (e) {
      console.log(e);
      res.status(400).send({});
    }
  }

  public async register(req: Request, res: Response) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).send({
          success: false,
          message: validateError(error),
        });
      }

      const { name, email, password, confirm_password, phone, citizenId } =
        req.body;
      if (password != confirm_password) {
        return res.status(400).send({
          success: false,
          message: "Password is not matched.",
        });
      }
      const hpassword = await hashPassword(password);
      const token = generateToken();
      await client.connect();
      const result = await client.db("test").collection("user").insertOne({
        name,
        email,
        password: hpassword,
        phone,
        citizenId,
        token,
      });
      await client.close();
      return res.status(200).send({
        success: true,
        data: {
          _id: result.insertedId,
          name,
          email,
          phone,
          citizenId,
          token,
        },
      });
    } catch (err: any) {
      return res.status(500).send({ message: err.message });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).send({
          success: false,
          message: validateError(error),
        });
      }

      const check = await comparePassword(
        req.body.password,
        req.body.user.password
      );
      if (!check) {
        return res.status(400).send({
          success: false,
          message: "Password is not correct.",
        });
      }
      const token = generateToken();
    } catch (err: any) {
      return res.status(500).send({ message: err.message });
    }
  }

  public async findUserByValue(value: string) {
    try {
      await client.connect();
      const result = await client
        .db("test")
        .collection("user")
        .findOne({
          $or: [
            { email: value },
            { phone: value },
            { citizenId: value },
            { token: value },
          ],
        });
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default AuthController;
