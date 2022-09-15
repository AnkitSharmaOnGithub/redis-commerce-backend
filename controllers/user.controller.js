const userService = require('')

exports.createUser = async (req, res, next) => {
  try {
    // Check if the user already exist.
    // Create the user in the redis.
  } catch (error) {
    console.error(`Error while getting users data`, err.message);
    next(err);
  }
};
