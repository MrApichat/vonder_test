import express from "express";
import { AuthController } from "../controller";
import { body, check } from "express-validator";
import { Auth } from "../middleware";

const router = express.Router();
const authController = new AuthController();

router.use(Auth);
router.get("/handshake", authController.handshake);
router.post(
  "/register",
  check("name").notEmpty().withMessage("Name is required."),
  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please insert E-mail correctly.")
    .custom(async (value) => {
      return authController.findUserByValue(value).then((user) => {
        if (user) {
          console.log(user);
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  check("password").notEmpty().withMessage("Password is required."),
  check("confirm_password")
    .notEmpty()
    .withMessage("Confirm Password is required."),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required.")
    .custom(async (value) => {
      return authController.findUserByValue(value).then((user) => {
        if (user) {
          console.log(user);
          return Promise.reject("Phone number already in use");
        }
      });
    }),
  check("citizenId")
    .notEmpty()
    .withMessage("Phone is required.")
    .custom(async (value) => {
      return authController.findUserByValue(value).then((user) => {
        if (user) {
          console.log(user);
          return Promise.reject("Citizen Id already in use");
        }
      });
    }),
  authController.register
);

router.post(
  "/login",
  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please insert E-mail correctly.")
    .custom(async (value, { req }) => {
      return authController.findUserByValue(value).then((user) => {
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

router.put(
  "/user/:id",
  check("phone").custom(async (value, { req }) => {
    return authController.findUserByValue(value).then((user) => {
      if (user && req.body.user.phone != value) {
        return Promise.reject("Phone is already used.");
      }
    });
  }),
  check("citizenId").custom(async (value, { req }) => {
    return authController.findUserByValue(value).then((user) => {
      if (user && req.body.user.citizenId != value) {
        return Promise.reject("Citizen Id is already used.");
      }
    });
  }),
  authController.updateUser
);

export default router;
