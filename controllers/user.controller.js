const userService = require("../services/user.service");
const authHelper = require("../helpers/auth.helper");

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
    const hashedPassword = await authHelper.hashPassword(password);

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

    if (user_data && (!user_data.email || !user_data.password)) {
      throw new Error(`No user exists with the entered credentials`);
    }

    // Check if the passwords match
    const password_matched = await authHelper.verifyPassword(
      password,
      user_data.password
    );

    if (password_matched === true) {
      req.session.isLoggedIn = true;
      req.session.email = email;

      // Set the session in redis
      await userService.setSession(user_data.id, req.session);
      res.cookie('redis-commerce-cookie',JSON.stringify({
        "id" : user_data.id
      }),{maxAge: 1000 * 10});
      res.status(200).send({ status: "Logged in successfully" });
    } else {
      throw new Error("Incorrect user credentials entered.");
    }

    // Set the session
  } catch (error) {
    error.statusCode = 403;
    next(error);
  }
};

exports.test = async (req, res, next) => {
  try {
    console.log(req.session);
    res.send(req.session);
  } catch (error) {
    next(error);
  }
};
