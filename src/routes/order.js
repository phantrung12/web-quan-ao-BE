const express = require("express");
const { userMiddleware, requireSignin } = require("../middlewares/middleware");
const { addOrder, getOrders, getOrder } = require("../controllers/orderCtrl");
const router = express.Router();

router.post("/addOrder", requireSignin, userMiddleware, addOrder);
router.get("/getOrders", requireSignin, userMiddleware, getOrders);
router.post("/getOrder", requireSignin, userMiddleware, getOrder);

module.exports = router;
