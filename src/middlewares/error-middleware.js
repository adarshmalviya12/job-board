const errorMiddleware = (err, req, res, next) => {
  const success = false;
  const status = err.status || 500;
  const message = err.message || "Backend Error";

  return res.status(status).json({ success, message });
};

module.exports = errorMiddleware;
