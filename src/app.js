const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRoute = require("./routes/user-routes.js");
const employerRoute = require("./routes/employer-routes.js");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", function (req, res) {
  res.json({
    message: "hii",
  });
});

app.use("/user", userRoute);
app.use("/employer", employerRoute);

module.exports = app;
