const express = require("express");
const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryCtrl");
const { requireSignin, adminMiddleware } = require("../middlewares/middleware");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const router = express.Router();

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
  "/category/create",
  requireSignin,
  adminMiddleware,
  upload.single("categoryImage"),
  addCategory
);
router.get("/category/getCate", getCategories);
router.post("/category/update", upload.array("categoryImage"), updateCategory);
router.post("/category/delete", deleteCategory);

module.exports = router;
