const express = require("express");
const {
  addItemToCart,
  getCartItems,
  removeCartItems,
} = require("../controllers/cartCtrl");
const { requireSignin, userMiddleware } = require("../middlewares/middleware");

const router = express.Router();

router.post(
  "/user/cart/addtocart",
  requireSignin,
  userMiddleware,
  addItemToCart
);
// router.get("/cart/getCart", getCart);
router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);
//new update
router.post(
  "/user/cart/removeItem",
  requireSignin,
  userMiddleware,
  removeCartItems
);

module.exports = router;
