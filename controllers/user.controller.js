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
      // Set the session
      req.session.is_logged_in = true;
      req.session.email = user_data.email;
      req.session.user_id = user_data.user_id;

      res.status(200).send({ status: "Logged in successfully" });
    }
  } catch (error) {
    error.statusCode = 403;
    next(error);
  }
};

exports.test = async (req, res, next) => {
  try {
    let session_data = req.session;
    const user_id = session_data.user_id;

    if(!user_id){
      throw new Error(`Unable to get the user_id. Try login again`);
    }

    const user_data = await userService.getUserById(user_id);
    res.status(200).send(user_data);
    
  } catch (error) {
    next(error);
  }
};
