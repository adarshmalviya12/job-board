const Job = require("../models/Jobs.model.js");
const User = require("../models/User.model.js");

const register = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  //validate fileds

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
    const userExist = await User.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    // user token
    const token = await user.createJWT();

    res.status(201).send({
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
    res.status(404).json({ message: error.message });
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide a User Credentials");
      return;
    }

    // find user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      next("Invalid email or password");
      return;
    }

    // compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = user.createJWT();

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
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

const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ isPublished: true });
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

    if (user && user.role === "User" && job) {
      await Job.findByIdAndUpdate(
        jobId,
        { $push: { application: user._id } },
        { new: true }
      );

      await User.findByIdAndUpdate(userId, { $push: { appliedJobs: job._id } });
    }

    return res
      .status(201)
      .json({ success: true, message: "applied jobs successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error getting job list",
      error: error.message,
    });
  }
};

module.exports = { register, signIn, user, getJobs, applyJob };
