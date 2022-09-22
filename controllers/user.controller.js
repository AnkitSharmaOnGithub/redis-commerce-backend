const userService = require("../services/user.service");

exports.createUser = async (req, res, next) => {
  try {
    // Get the username, password & confirm_password from the request body.
    const { email, password, confirmPassword } = req.body;

    // Trim the whitespaces
    email = email.trim();
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    // console.log(email, password, confirmPassword);

    if (password.toLowerCase() !== confirmPassword.toLowerCase()) {
      throw new Error(
        `The password & the confirm password fields do not match`
      );
    }

    // Check if the user already exist.
    const data = await userService.createUser(email, password);
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

    let user_data = await userService.login(email,password);
    
    // Check if the passwords match

    // Set the session
  } catch (error) {
    next(error);
  }

};
