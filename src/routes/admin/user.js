const express = require("express");
const {
  getAllUser,
  getUserById,
  updateUserRole,
  deleteUser,
  updateUser,
  statUser,
} = require("../../controllers/admin/userCtrl");
const {
  adminMiddleware,
  requireSignin,
  userMiddleware,
} = require("../../middlewares/middleware");

const router = express.Router();

router.get("/admin/getAllUser", requireSignin, adminMiddleware, getAllUser);
router.get("/getUser/:id", getUserById);
router.put(
  "/admin/updateRoleUser/:id",
  requireSignin,
  adminMiddleware,
  updateUserRole
);
router.put("/user/updateUser/:id", requireSignin, userMiddleware, updateUser);
router.delete(
  "/admin/deleteUser/:id",
  requireSignin,
  adminMiddleware,
  deleteUser
);
router.get("/user/stats", requireSignin, adminMiddleware, statUser);

module.exports = router;
