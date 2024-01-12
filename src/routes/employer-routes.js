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
  getAppliedJob,
  getJobsNotification,
} = require("../controllers/Employer.controller");
const { authenticateJwt } = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/register", register);
router.post("/signin", signIn);
router.get("/user", authenticateJwt, user);
router.post("/create-job", authenticateJwt, createJob);
router.post("/create-jobNotification", authenticateJwt, createJob);
router.get("/jobs", authenticateJwt, getJobs);
router.get("/jobs-notification", authenticateJwt, getJobsNotification);
router.get("/jobs/:jobId", authenticateJwt, getJobDetails);
router.put("/jobs/:jobId", authenticateJwt, editJob);
router.delete("/jobs/:jobId", authenticateJwt, softDeleteJob);
router.get("/jobs/:jobId/applied-candidates", authenticateJwt, getAppliedJob);

module.exports = router;
