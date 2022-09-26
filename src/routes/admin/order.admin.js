const express = require("express");
const {
  updateOrder,
  getCustomerOrders,
  income,
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

module.exports = router;
