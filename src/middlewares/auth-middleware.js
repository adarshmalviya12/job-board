const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET_KEY;

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: Invalid token" });
      }

      req.user = user;
      next();
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }
};

module.exports = {
  authenticateJwt,
  SECRET,
};
