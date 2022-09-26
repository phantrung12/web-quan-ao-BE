const express = require("express");
const { signup, signin } = require("../controllers/authCtrl");
const {
  validateSignupRequest,
  isValidateRequest,
  validateSigninRequest,
} = require("../validators/validator");
const router = express.Router();

router.post("/signin", validateSigninRequest, signin);

router.post("/signup", validateSignupRequest, isValidateRequest, signup);

module.exports = router;
