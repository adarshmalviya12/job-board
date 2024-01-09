const express = require("express");
const {
  register,
  signIn,
  user,
  getJobs,
  applyJob,
} = require("../controllers/User.controller");
const { authenticateJwt } = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/register", register);
router.post("/signin", signIn);
router.get("/user", authenticateJwt, user);
router.get("/find-jobs", authenticateJwt, getJobs);
router.post("/find-job/:id", authenticateJwt, applyJob);

module.exports = router;
