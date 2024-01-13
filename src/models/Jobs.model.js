const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },
    jobTitle: { type: String, required: [true, "Job Title is required"] },
    jobType: { type: String }, //  required: [true, "Job Type is required"]
    location: { type: String }, //  required: [true, "Location is required"]
    // salary: { type: Number }, // required: [true, "Salary is required"]
    vacancies: { type: Number },
    // experience: { type: Number, default: 0 },
    desc: { type: String },
    isPublished: { type: Boolean, default: false },
    application: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
