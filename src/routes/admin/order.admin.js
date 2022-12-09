const express = require("express");
const {
  updateOrder,
  getCustomerOrders,
  income,
  countOrder,
  countIncome,
  countPayment,
} = require("../../controllers/admin/orderCtrl.admin");
const {
  requireSignin,
  adminMiddleware,
} = require("../../middlewares/middleware");

const router = express.Router();

router.post(`/order/update`, requireSignin, adminMiddleware, updateOrder);
router.post(
  "/order/getCustomerOrders",
  requireSignin,
  adminMiddleware,
  getCustomerOrders
);
router.get("/order/income", requireSignin, adminMiddleware, income);
router.get("/order/countOrder", requireSignin, adminMiddleware, countOrder);
router.get("/order/countPayment", requireSignin, adminMiddleware, countPayment);
router.post("/order/countIncome", requireSignin, adminMiddleware, countIncome);

module.exports = router;
