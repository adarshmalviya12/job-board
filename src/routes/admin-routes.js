const express = require("express");
const {
  adminLogin,
  adminRegister,
  getAllUsers,
  updateUserStatus,
} = require("../controllers/Admin.controller");
const { authenticateJwt } = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/signin", adminLogin);
router.post("/register", adminRegister);
router.get("/get-users", authenticateJwt, getAllUsers);
router.put("/update-user", authenticateJwt, updateUserStatus);

module.exports = router;
