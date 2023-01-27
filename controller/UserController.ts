import { client } from "../database";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { hashPassword, comparePassword } from "../utilities/auth";
import { validateError } from "../utilities/error";
import { IUser } from "../model";

class UserController {
  constructor() {}

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
      const user: IUser = req.body.user;
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

export default UserController;
