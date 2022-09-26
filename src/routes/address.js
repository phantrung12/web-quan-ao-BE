const express = require("express");
const { userMiddleware, requireSignin } = require("../middlewares/middleware");
const { addAddress, getAddress } = require("../controllers/addressCtrl");
const router = express.Router();

router.post("/user/address/create", requireSignin, userMiddleware, addAddress);
router.post("/user/getaddress", requireSignin, userMiddleware, getAddress);

module.exports = router;
