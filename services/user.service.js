const redisClient = require("../helpers/redis.helper");
// const { v4: uuidv4 } = require('uuid');
const keyHelper = require("../helpers/key.helper");

exports.createUser = async (email, password) => {
  try {
    const redis_user_key = keyHelper.generateUserKey(email);

    // This can be imporved in future, via the response from redis.
    const user_already_exists = await redisClient.hGet(redis_user_key, "email");

    if (!user_already_exists) {
      // If the user does not already exists, then save the user.
      const result = await Promise.all([
        redisClient.hSet(redis_user_key, "email", email),
        redisClient.hSet(redis_user_key, "password", password),
      ]);

      setTimeout(() => {
        if (result[0] == 1 && result[1] == 1) {
          return { status: "User created successfully!" };
        }
      }, 50000);
    } else {
      setTimeout(() => {
        return { error: "User already exists" };
      }, 5000000);
    }
  } catch (error) {
    return error;
  }
};
