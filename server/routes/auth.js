const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

const validatePasswordChange = [
  check("email").notEmpty().withMessage("Email required").isEmail(),
  check("oldPassword").notEmpty().withMessage("Old password is required"),
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Confirm password does not match new password");
    }
    return true;
  }),
];

router.post(
  "/register",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  authController.register
);
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);


router.post(
  "/change-password",
  validatePasswordChange,
  authController.changePassword
);

module.exports = router;
