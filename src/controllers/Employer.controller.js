const Employer = require("../models/Employer.model");

const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //validate fields
  if (!firstName) {
    next("First Name is required");
  }
  if (!email) {
    next("Email is required");
  }
  if (!lastName) {
    next("Last Name is required");
  }
  if (!password) {
    next("Password is required");
  }

  try {
    const accountExist = await Employer.findOne({ email });

    if (accountExist) {
      next("Email Already Registered. Please Login");
      return;
    }

    // create a new account
    const employer = await Employer.create({
      firstName,
      lastName,
      email,
      password,
    });

    // user token
    const token = employer.createJWT();

    res.status(201).json({
      success: true,
      message: "Employer Account Created Successfully",
      user: {
        _id: employer._id,
        name: employer.firstName,
        email: employer.email,
        role: employer.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
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
      next("Invalid email or passsword");
      return;
    }

    const isMatch = await employer.comparePassword(password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }
    employer.password = undefined;
    const token = employer.createJWT();

    res.status(200).json({
      success: true,
      message: "Login successfully",
      employer,
      token,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { register, signIn };
