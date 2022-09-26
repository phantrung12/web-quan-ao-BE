const express = require("express");
const { initialData } = require("../../controllers/admin/initialDataCtrl");
const {
  requireSignin,
  adminMiddleware,
} = require("../../middlewares/middleware");
const router = express.Router();

router.post("/initialdata", requireSignin, adminMiddleware, initialData);

module.exports = router;
