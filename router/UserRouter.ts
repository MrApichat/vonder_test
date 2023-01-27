import express from "express";
import { check } from "express-validator";
import { UserController } from "../controller";

const userRouter = express.Router();
const userController = new UserController();

userRouter.put(
  "/:id",
  check("phone").custom(async (value, { req }) => {
    return userController.findUserByValue(value).then((user) => {
      if (user && req.body.user.phone != value) {
        return Promise.reject("Phone is already used.");
      }
    });
  }),
  check("citizenId").custom(async (value, { req }) => {
    return userController.findUserByValue(value).then((user) => {
      if (user && req.body.user.citizenId != value) {
        return Promise.reject("Citizen Id is already used.");
      }
    });
  }),
  userController.updateUser
);

export default userRouter;