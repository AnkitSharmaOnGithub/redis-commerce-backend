const userService = require("../services/user.service");

// Add 3rd party packages
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res, next) => {
  try {
    // Get the username, password & confirm_password from the request body.
    let { email, password, confirmPassword } = req.body;

    // Trim the whitespaces
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    if (password.toLowerCase() !== confirmPassword.toLowerCase()) {
      throw new Error(
        `The password & the confirm password fields do not match`
      );
    }

    // Hash the password before storing it.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if the user already exist.
    const data = await userService.createUser(email, hashedPassword);
    if (data.status) {
      res.status(200).send(data);
    } else {
      res.status(403).send(data);
    }
    // Create the user in the redis.
  } catch (err) {
    console.error(`Error while getting users data :-`, err.message);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Trim the whitespaces
    email = email.trim();
    password = password.trim();

    let user_data = await userService.login(email, password);

    const password_matched = await bcrypt.compare(password, user_data.password);

    if (password_matched === true) {
      req.session.is_logged_in = true;
      res.status(200).send({ status: "Logged in successfully" });
    } else {
      throw new Error("Incorrect user credentials entered.");
    }

    // Check if the passwords match

    // Set the session
  } catch (error) {
    next(error);
  }
};

exports.test = async (req, res, next) => {
  try {
    console.log(req.session);
  } catch (error) {
    next(error);
  }
};