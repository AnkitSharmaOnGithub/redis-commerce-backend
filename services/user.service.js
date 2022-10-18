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

// exports.setSession = async (user_id, session_data) => {
//   try {
//     const redis_user_key = keyHelper.generateSessionKey(user_id);
//     const result = await Promise.all([
//       redisClient.hSet(redis_user_key, "isLoggedIn", session_data.isLoggedIn),
//       redisClient.hSet(redis_user_key, "email", session_data.email),
//     ]);

//     if (result[0] == 1 && result[1] == 1) {
//       return true;
//     }
//   } catch (error) {
//     return error;
//   }
// };

const getUserById = async (user_id) => {
  try {
    const redis_user_key = keyHelper.generateUserKey(user_id);
    const user_data = await redisClient.hGetAll(redis_user_key);

    return user_data;
  } catch (error) {
    return error;
  }
};

const getUserByEmail = (email) => {};
