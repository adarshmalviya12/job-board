const express = require("express");
const {
  adminLogin,
  adminRegister,
} = require("../controllers/Admin.controller");

const router = express.Router();

router.post("/signin", adminLogin);
router.post("/register", adminRegister);

module.exports = router;
