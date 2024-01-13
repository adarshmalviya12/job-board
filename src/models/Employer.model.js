const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const employerSchema = new mongoose.Schema({
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
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least"],
    select: true,
  },
  role: { type: String, default: "Employer" },
  // contact: { type: String },
  // location: { type: String },
  // about: { type: String },
  // profileUrl: { type: String },
  jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  JobNotifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "JobNotification" },
  ],
});

// middelwares
employerSchema.pre("save", async function (next) {
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
employerSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
employerSchema.methods.createJWT = function () {
  return JWT.sign(
    { userId: this._id, role: this.role, username: this.firstname },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
};

const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer;
