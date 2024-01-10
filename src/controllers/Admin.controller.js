const Admin = require("../models/Admin.model");

const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Provide User Credentials",
      });
    }

    const user = await Admin.findOne({ email }).select("+password");

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

const adminRegister = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  // Validate fields
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const userExist = await Admin.findOne({ email });

    if (userExist) {
      return res.status(401).json({
        success: false,
        message: "Email Address already exists",
      });
    }

    const user = await Admin.create({
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

module.exports = { adminLogin, adminRegister };
