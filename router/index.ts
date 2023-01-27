import express from "express";
import {
  AuthController,
  RoomController,
  BookingController,
  UserController,
} from "../controller";
import { check } from "express-validator";
import userRouter from "./UserRouter";

const router = express.Router();
const authController = new AuthController();
const roomController = new RoomController();
const bookingController = new BookingController();
const userController = new UserController();

router.post(
  "/register",
  check("name").notEmpty().withMessage("Name is required."),
  check("email").notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please insert E-mail correctly.")
    .custom(async (value) => {
      return userController.findUserByValue(value).then((user) => {
        if (user) return Promise.reject("E-mail already in use");
      });
    }),
  check("password").notEmpty().withMessage("Password is required."),
  check("confirm_password").notEmpty().withMessage("Confirm Password is required."),
  check("phone").notEmpty().withMessage("Phone is required.")
    .isMobilePhone("th-TH").withMessage("Please insert Phone correctly.")
    .custom(async (value) => {
      return userController.findUserByValue(value).then((user) => {
        if (user) return Promise.reject("Phone already in use");
      });
    }),
  check("citizenId").notEmpty().withMessage("Citizen Id is required.")
    .isNumeric().withMessage("Please insert Citizen Id correctly.")
    .isLength({ min: 13, max: 13 }).withMessage("Please insert Citizen Id correctly.")
    .custom(async (value) => {
      return userController.findUserByValue(value).then((user) => {
        if (user) return Promise.reject("Citizen Id already in use");
      });
    }),
  authController.register
);

router.post(
  "/login",
  check("email").notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please insert E-mail correctly.")
    .custom(async (value, { req }) => {
      return userController.findUserByValue(value).then((user) => {
        if (user) {
          req.body.user = user;
        } else {
          return Promise.reject("E-mail is not registered yet.");
        }
      });
    }),
  check("password").notEmpty().withMessage("Password is required."),
  authController.login
);
router.use("/user", userRouter);
router.get("/rooms", roomController.getRoom);

router.post(
  "/booking/:id",
  check("amount").notEmpty().withMessage("Please insert amount that you want to booking"),
  bookingController.bookingRoom
);

export default router;
