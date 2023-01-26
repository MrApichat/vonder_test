import { client } from "../database";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  hashPassword,
  generateToken,
  comparePassword,
} from "../utilities/auth";
import { validateError } from "../utilities/error";
import { UserModel } from "../model";

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

  public async updateUser(req: Request, res: Response) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).send({
          success: false,
          message: validateError(error),
        });
      }
      if (!req.body.isLogin)
        return res.status(401).send({
          success: false,
          message: "Login required",
        });
      const user: UserModel = req.body.user;
      if (user._id != req.params.id)
        return res.status(400).send({
          success: false,
          message: "You can only edit yourself profile.",
        });

      //can edit name
      if (req.body.name) {
        user.name = req.body.name;
      }
      //can edit password must have confirm_password
      if (req.body.password && req.body.confirm_password != req.body.password) {
        return res.status(400).send({
          success: false,
          message: "Password is not matched.",
        });
      } else if (req.body.password) {
        const check = await comparePassword(req.body.password, user.password);

        if (!check) {
          const hpassword = await hashPassword(req.body.password);
          user.password = hpassword;
        }
      }
      //can edit phone but is not already in database
      if (req.body.phone) {
        user.phone = req.body.phone;
      }
      //can edit citizenId but is not already in database
      if (req.body.citizenId) {
        user.citizenId = req.body.citizenId;
      }

      await client.connect();
      await client
        .db("test")
        .collection("user")
        .updateOne(
          { _id: user._id },
          {
            $set: {
              ...user,
            },
          }
        );
      await client.close();

      const result = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        citizenId: user.citizenId,
      };
      res.status(200).send({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).send({ success: false, message: err.message });
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
      await client.close();
      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default AuthController;
