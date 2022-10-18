// Add 3rd party packages
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');

exports.isLoggedIn = (req, res, next) => {
  try {
    const cookies_array = req.cookies;
    // console.log(cookies_array);

    // Check if the "redis-commerce-cookie" cookie is contained in the cookies
    let login_cookie_exists = false;
    for (const cookie in cookies_array) {
      console.log(cookie);
      const cookie_initial = cookie.split("#")[0];
      if (cookie_initial === "session") {
        // console.log("Cookie exists");
        login_cookie_exists = true;
      }
    }

    if (!login_cookie_exists) {
      throw new Error(`User not logged in`);
    }
  } catch (error) {
    next(error);
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
