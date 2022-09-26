const express = require("express");
const {
  createProduct,
  getProductsBySlug,
  getProductsById,
  getAllProduct,
  updateProduct,
  getProductFilter,
  deleteProductById,
  addReview,
  getAllReview,
  updateSale,
} = require("../controllers/productCtrl");
const {
  requireSignin,
  adminMiddleware,
  userMiddleware,
} = require("../middlewares/middleware");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(path.dirname(__dirname), "uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, shortid.generate() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
);

router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductsById);
router.post("/products/getAllProduct", getAllProduct);
router.get("/allproducts", getProductFilter);
router.put("/addreview", requireSignin, userMiddleware, addReview);
router.get("/allreview", getAllReview);
router.post(
  "/product/update",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  updateProduct
);

router.post(
  "/product/delete",
  requireSignin,
  adminMiddleware,
  deleteProductById
);

router.put(
  "/product/updatesale/:id",
  requireSignin,
  adminMiddleware,
  updateSale
);

// router.get("/product/getCate", getCategories);

module.exports = router;
