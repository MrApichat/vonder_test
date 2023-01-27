import { client } from "../database";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  hashPassword,
  generateToken,
  comparePassword,
} from "../utilities/auth";
import { validateError } from "../utilities/error";
import { IUser } from "../model";

class AuthController {
  constructor() {}

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
      return res.status(500).send({ success: false, message: err.message });
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

      await client.connect();
      const result = await client
        .db("test")
        .collection("user")
        .updateOne(
          { _id: req.body.user._id },
          {
            $set: {
              token: token,
            },
          }
        );
      await client.close();

      return res.status(200).send({
        success: true,
        data: {
          _id: req.body.user._id,
          name: req.body.user.name,
          email: req.body.user.email,
          phone: req.body.user.phone,
          citizenId: req.body.user.citizenId,
          token: token,
        },
      });
    } catch (err: any) {
      return res.status(500).send({ success: false, message: err.message });
    }
  }
}

export default AuthController;
