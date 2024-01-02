const Employer = require("../models/Employer.model");
const Job = require("../models/Jobs.model");

const register = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  //validate fields
  if (!firstname) {
    next("First Name is required");
  }
  if (!email) {
    next("Email is required");
  }
  if (!lastname) {
    next("Last Name is required");
  }
  if (!password) {
    next("Password is required");
  }

  try {
    const accountExist = await Employer.findOne({ email });

    if (accountExist) {
      return res
        .status(401)
        .json({ success: false, message: "Email Already Exists" });
    }

    const employer = await Employer.create({
      firstname,
      lastname,
      email,
      password,
      isPublished: true,
    });

    const token = employer.createJWT();

    res.status(201).json({
      success: true,
      message: "Employer Account Created Successfully",
      user: {
        _id: employer._id,
        name: employer.firstname,
        email: employer.email,
        role: employer.role,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      next("please Provide a User Credentials");
      return;
    }

    const employer = await Employer.findOne({ email }).select("+password");

    if (!employer) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await employer.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    employer.password = undefined;
    const token = employer.createJWT();

    res.status(200).json({
      success: true,
      message: "Login successfully",
      employer: {
        _id: employer._id,
        name: employer.firstname,
        email: employer.email,
        role: employer.role,
      },
      token,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const { jobTitle, location, vacancies, desc } = req.body;

    const employerId = req.user.userId;

    const isEmployer = await Employer.findById(employerId);

    if (isEmployer) {
      const job = await Job.create({
        employer: employerId,
        jobTitle,
        location,
        vacancies,
        desc,
        isPublished: true,
      });

      return res.status(201).json({ success: true, job });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating job post",
      error: error.message,
    });
  }
};

const user = async (req, res) => {
  const userData = {
    userId: req.user.userId,
    username: req.user.username,
    role: req.user.role,
  };

  res.status(200).json({ success: true, userData });
};

const getJobs = async (req, res) => {
  try {
    const employerId = req.user.userId;

    const jobs = await Job.find({ employer: employerId, isPublished: true });

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting job list",
      error: error.message,
    });
  }
};

const getJobDetails = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job || !job.isPublished) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting job details",
      error: error.message,
    });
  }
};

const editJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { jobTitle, location, vacancies, desc } = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        jobTitle,
        location,
        vacancies,
        desc,
        isPublished: true,
      },
      { new: true }
    );

    if (!job || !job.isPublished) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error editing job",
      error: error.message,
    });
  }
};

const softDeleteJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findByIdAndUpdate(
      jobId,
      { isPublished: false },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job soft-deleted successfully",
      job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error soft-deleting job",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  signIn,
  createJob,
  getJobs,
  user,
  getJobDetails,
  editJob,
  softDeleteJob,
};
