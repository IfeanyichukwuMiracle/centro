class AppError extends Error {
  constructor(message, code, type) {
    super(message);
    this.code = code || 500;
    this.type = type;
  }
}

module.exports = AppError;
