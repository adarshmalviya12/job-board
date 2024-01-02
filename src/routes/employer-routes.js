const express = require("express");
const {
  register,
  signIn,
  createJob,
  getJobs,
  user,
  getJobDetails,
  editJob,
  softDeleteJob,
} = require("../controllers/Employer.controller");
const { authenticateJwt } = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/register", register);
router.post("/signin", signIn);
router.get("/user", authenticateJwt, user);
router.post("/create-job", authenticateJwt, createJob);
router.get("/jobs", authenticateJwt, getJobs);
router.get("/jobs/:jobId", authenticateJwt, getJobDetails);
router.put("/jobs/:jobId", authenticateJwt, editJob);
router.delete("/jobs/:jobId", authenticateJwt, softDeleteJob);

module.exports = router;
