const express = require("express");
const { signup, signin, signout } = require("../../controllers/admin/authCtrl");
const { requireSignin } = require("../../middlewares/middleware");
const {
  validateSignupRequest,
  isValidateRequest,
  validateSigninRequest,
} = require("../../validators/validator");
const router = express.Router();

router.post("/admin/signin", validateSigninRequest, isValidateRequest, signin);

router.post("/admin/signup", validateSignupRequest, isValidateRequest, signup);

router.post("/admin/signout", signout);

module.exports = router;
