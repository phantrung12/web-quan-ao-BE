const express = require("express");
const {
  createImExport,
  getImExport,
} = require("../../controllers/admin/imexportCtrl");
const {
  requireSignin,
  adminMiddleware,
} = require("../../middlewares/middleware");
const router = express.Router();

router.post("/imexport/create", requireSignin, adminMiddleware, createImExport);
router.get("/imexport/getAll", requireSignin, adminMiddleware, getImExport);

module.exports = router;
