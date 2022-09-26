const express = require("express");
const { createPage, getPage } = require("../../controllers/admin/pageCtr");
const {
  requireSignin,
  adminMiddleware,
  upload,
} = require("../../middlewares/middleware");
const router = express.Router();

router.post(
  "/page/create",
  requireSignin,
  adminMiddleware,
  upload.fields([{ name: "banners" }, { name: "products" }]),
  createPage
);

router.get(`/page/:category/:type`, getPage);

module.exports = router;
