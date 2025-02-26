const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Fallback for unexpected errors
  res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
