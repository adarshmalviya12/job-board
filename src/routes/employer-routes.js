const express = require("express");
const { register, signIn } = require("../controllers/Employer.controller");

const router = express.Router();

router.post("/register", register);
router.post("/signin", signIn);

module.exports = router;
