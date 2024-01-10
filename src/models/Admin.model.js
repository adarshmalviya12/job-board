const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First Name is Required!"],
  },
  lastname: {
    type: String,
    required: [true, "Last Name is Required!"],
  },
  email: {
    type: String,
    required: [true, "First Name is Required!"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  role: {
    type: String,
    default: "Admin",
  },
});

// middelwares
adminSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, saltRound);
    user.password = hashedPassword;
  } catch (error) {
    return next(error);
  }

  next();
});

//compare password
adminSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
adminSchema.methods.createJWT = function () {
  return JWT.sign(
    { userId: this._id, role: this.role, username: this.firstname },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
};

module.exports = mongoose.model("Admin", adminSchema);
