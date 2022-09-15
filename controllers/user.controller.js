const userService = require('../services/user.service');

exports.createUser = async (req, res, next) => {
  try {
    // Get the username, password & confirm_password from the request body.
    const {username, password, confirm_password} = req.body;

    if(password.toLowerCase() !== confirm_password.toLowerCase()){
      throw new Error(`The password & the confirm password fields do not match`);
    }

    // Check if the user already exist.
    userService.createUser()
    // Create the user in the redis.
  } catch (error) {
    console.error(`Error while getting users data`, err.message);
    next(err);
  }
};
