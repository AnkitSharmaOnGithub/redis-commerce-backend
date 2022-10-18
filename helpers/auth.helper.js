// Add 3rd party packages
const bcrypt = require("bcryptjs");

exports.isLoggedIn = (req, res, next) => {

  const excluded_urls = ["/user/create", "/user/login"];

  if (!excluded_urls.includes(req.url) && req.session.is_logged_in !== true) {
    throw new Error("Please login and the continue!");
  }
  next();
};

exports.hashPassword = (password) => {
  // Hash the password before storing it.
  const hashedPassword = bcrypt.hash(password, 12);
  return hashedPassword;
};

exports.verifyPassword = (user_entered_password, password) => {
  // Check if the passwords match
  const password_matched = bcrypt.compare(user_entered_password, password);
  return password_matched;
};
