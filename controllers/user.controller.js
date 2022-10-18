const userService = require("../services/user.service");
const authHelper = require("../helpers/auth.helper");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");

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
        session_key,
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
    let cookie_data = Object.keys(req.cookies).length > 0 ? cookieParser.JSONCookies(req.cookies) : null;

    const session_key = Object.keys(cookie_data).filter(el => el.includes('session'));
    const session_value = cookie_data[session_key] ? JSON.parse(cookie_data[session_key]) : null;
    const user_id = session_value?.id;

    if(!user_id){
      throw new Error(`Unable to get the user_id. Try login again`);
    }

    const user_data = await userService.getUserById(user_id);
    res.status(200).send(user_data);
    
  } catch (error) {
    next(error);
  }
};
