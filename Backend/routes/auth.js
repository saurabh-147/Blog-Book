const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const { signin, signup, signout } = require("../controllers/auth");

//signin route
router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 }),
  ],
  signin
);

router.post(
  "/signup",
  [
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 6 character").isLength({
      min: 6,
    }),
  ],
  signup
);

router.get("/signout", signout);

module.exports = router;
