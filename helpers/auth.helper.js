// Add 3rd party packages
const bcrypt = require("bcryptjs");

exports.isLoggedIn = (req, res, next) => {
  try {
    const cookies_array = req.headers.cookie.split(",");
    console.log(cookies_array);

    // Check if the "redis-commerce-cookie" cookie is contained in the cookies
    let login_cookie_exists = false;
    for (const cookie of cookies_array) {
      const cookie_data = cookie.split("=");
      if (cookie_data[0] === "redis-commerce-cookie") {
        console.log("Cookie exists");
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
