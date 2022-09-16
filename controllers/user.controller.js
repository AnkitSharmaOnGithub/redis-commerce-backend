const userService = require('../services/user.service');

exports.createUser = async (req, res, next) => {
  try {
    // Get the username, password & confirm_password from the request body.
    const {email, password, confirmPassword} = req.body;
    // console.log(email, password, confirmPassword);

    if(password.toLowerCase() !== confirmPassword.toLowerCase()){
      throw new Error(`The password & the confirm password fields do not match`);
    }

    // Check if the user already exist.
    const data = await userService.createUser(email, password);
    res.send({
      'generatedKey' : data
    });
    // Create the user in the redis.
  } catch (err) {
    console.error(`Error while getting users data :-`, err.message);
    next(err);
  }
};
