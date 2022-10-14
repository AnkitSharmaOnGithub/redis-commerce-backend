const redisClient = require("../helpers/redis.helper");
const { v4: uuidv4 } = require('uuid');
const keyHelper = require("../helpers/key.helper");

exports.createUser = async (email, hashedPassword) => {
  try {
    const user_id = uuidv4();
    const redis_user_key = keyHelper.generateUserKey(user_id);

    // This can be imporved in future, via the response from redis.
    const user_already_exists = await redisClient.hGet(redis_user_key, id);

    if (!user_already_exists) {
      // If the user does not already exists, then save the user.
      const result = await Promise.all([
        redisClient.hSet(redis_user_key,"id",user_id),
        redisClient.hSet(redis_user_key, "email", email),
        redisClient.hSet(redis_user_key, "password", hashedPassword),
      ]);

        if (result[0] == 1 && result[1] == 1) {
          return { status: "User created successfully!" };
        }
    } else {
        return { error: "User already exists" };
    }
  } catch (error) {
    return error;
  }
};

exports.login = async (email, password) => {
  try {
    // const redis_user_key = keyHelper.generateUserKey(email);

    // Get the user data from the redis
    const user_data = await redisClient.hGet(redis_user_key);
    return user_data;

  } catch (error) {
    return error;
  }
}

const getUserById = async (user_id) => {
  try {
    const redis_user_key = keyHelper.generateUserKey(user_id);
    const user_data = await redisClient.hGetAll(redis_user_key);

    return user_data;
  } catch (error) {
    return error;
  }
};

const getUserByEmail = (email) => {

}