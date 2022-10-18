const redisClient = require("../helpers/redis.helper");
const { v4: uuidv4 } = require("uuid");
const keyHelper = require("../helpers/key.helper");

exports.createUser = async (email, hashedPassword) => {
  try {
    const user_id = uuidv4();
    const redis_user_key = keyHelper.generateUserKey(user_id);

    // This can be imporved in future, via the response from redis.
    const user_already_exists = await redisClient.hGet("user_mapping", email);

    if (!user_already_exists) {
      // If the user does not already exists, then save the user.
      const result = await Promise.all([
        redisClient.hSet(redis_user_key, "id", user_id),
        redisClient.hSet(redis_user_key, "email", email),
        redisClient.hSet(redis_user_key, "password", hashedPassword),
      ]);

      if (result[0] == 1 && result[1] == 1 && result[2] == 1) {
        // Also maintain a seperate redis SET to map the "user" to the "email"
        const mapping_status = await redisClient.hSet(
          "user_mapping",
          email,
          redis_user_key
        );

        if (mapping_status) {
          return { status: "User created successfully!" };
        } else {
          return { error: "Issue in storing mapping to Redis" };
        }
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
    // Get the user data from the redis
    const user_id = await redisClient.hGet("user_mapping", email);

    // Check if the data exists in redis or not
    if (!user_id) {
      throw new Error("User does not exits.");
    }
    const user_data = await redisClient.hGetAll(user_id);

    return user_data;
  } catch (error) {
    return error;
  }
};

exports.generateSessionRedisKey = async (session_id) => keyHelper.generateSessionKey(session_id);

exports.set_session_in_redis = async (session_key, session_data) => {
  try {
    // Store the session data in redis
    const result = await Promise.all([
      await redisClient.hSet(session_key,'email', session_data.email),
      await redisClient.hSet(session_key,'id', session_data.id),
    ]);

    if (result[0] == 1 && result[1] == 1) {
      return true;
    }
  } catch (error) {
    return error;
  }
};

exports.getUserById = async (user_id) => {
  try {
    const redis_user_key = keyHelper.generateUserKey(user_id);
    const user_data = await redisClient.hGetAll(redis_user_key);

    if(!user_data){
      throw new Error(`No user found with the data. Login & try again`);
    }
    
    return user_data;
  } catch (error) {
    return error;
  }
};

const getUserByEmail = (email) => {};
