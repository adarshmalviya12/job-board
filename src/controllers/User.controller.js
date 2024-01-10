const Job = require("../models/Jobs.model.js");
const User = require("../models/User.model.js");

const register = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  // Validate fields
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(401).json({
        success: false,
        message: "Email Address already exists",
      });
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    const token = await user.createJWT();

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Provide User Credentials",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.password = undefined;

    const token = user.createJWT();

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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

  return res.status(200).json({ success: true, userData });
};

const getJobs = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const jobs = await Job.find({ isPublished: true });

    for (const job of jobs) {
      job.hasApplied = job.application.includes(userId);
    }

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting job list",
      error: error.message,
    });
  }
};

const applyJob = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.id;

    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!user || user.role !== "User" || !job) {
      return res.status(404).json({
        success: false,
        message: "User or Job not found, or user is not a regular user",
      });
    }

    if (job.application.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User has already applied for this job",
      });
    }

    await Job.findByIdAndUpdate(
      jobId,
      { $push: { application: user._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, { $push: { appliedJobs: job._id } });

    return res.status(201).json({
      success: true,
      message: "Applied for the job successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { register, signIn, user, getJobs, applyJob };
