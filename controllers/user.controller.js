const userService = require("../services/user.service");
const authHelper = require("../helpers/auth.helper");
const { v4: uuidv4 } = require("uuid");

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
      // Generate session uuid
      const session_id = uuidv4();
      const session_key = await userService.generateSessionRedisKey(session_id);
      res.cookie(
        session_key,
        JSON.stringify({
          id: user_data.id,
        }),
        { expires: new Date(Date.now() + 90000000) }
      );

      // Store the session data in redis
      const session_redis_status = await userService.set_session_in_redis(
        session_id,
        user_data
      );

      res.status(200).send({ status: "Logged in successfully" });
    }

    // Set the session
  } catch (error) {
    error.statusCode = 403;
    next(error);
  }
};

exports.test = async (req, res, next) => {
  try {
    let cookie_data = req.headers.cookie;
    console.log(cookie_data);

    let cookie_value = cookie_data.split("=")[1];
    console.log(cookie_value);
    // console.log(JSON.parse(cookie_value));

    res.send(cookie_data);
  } catch (error) {
    next(error);
  }
};
