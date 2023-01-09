const express = require("express");

const authController = require("../controllers/auth");
const User = require("../models/user");

const { body } = require("express-validator/check");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please Enter A Valid Email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Should Be At least 8 characters long."),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    body("name")
      .isLength({
        min: 3,
      })
      .withMessage("Name should be at least 3 characters long."),
    body("email").isEmail().withMessage("Please Enter A Valid Email"),
    body("password")
      .isLength({
        min: 8,
      })
      .withMessage("Password should be at least 8 characters long."),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password doesn't match Password");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get(
  "/reset",

  authController.getReset
);

router.post(
  "/reset",

  authController.postReset
);

router.get(
  "/reset-password/:id/:token",
  body("email").isEmail().withMessage("Please Enter A Valid Email"),

  authController.getResetPassword
);

router.post(
  "/reset-password/:id/:token",
  [
    body("email").isEmail().withMessage("Please Enter A Valid Email"),
    body("confirmNewPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Confirm Password doesn't match Password");
      }
      return true;
    }),
  ],

  authController.postResetPassword
);

router.post(
  "/reset",
  [
    body("email").isEmail().withMessage("Please Enter A Valid Email"),
    body("email").isEmail().withMessage("Please Enter A Valid Email"),
    body("newPassword")
      .isLength({
        min: 8,
      })
      .withMessage("Old Password should be at least 8 characters long."),
    body("oldPassword")
      .isLength({
        min: 8,
      })
      .withMessage("Old Password should be at least 8 characters long."),
    body("confirmNewPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Confirm Password doesn't match Password");
      }
      return true;
    }),
  ],
  authController.postReset
);

module.exports = router;
