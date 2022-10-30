const redisClient = require("../helpers/redis.helper");
const keyHelper = require("../helpers/key.helper");
const uuidHelper = require("../helpers/uuid.helper");

exports.checkUserExists = async (email) => {
  // See if the username already exists in the set of usernames
  const user_exists = await redisClient.sIsMember('usernames',email);
  // If so, throw an error
  if(user_exists){
    throw new Error('Username is already taken.');
  }
  // Else, continue
  return user_exists;
}

exports.createUser = async (email, hashedPassword) => {
  try {
    const user_id = uuidHelper.generateUniqueUuidKey();
    const redis_user_key = keyHelper.generateUserKey(user_id);

    // This can be imporved in future, via the response from redis.
    const user_already_exists = await redisClient.hGet("user_mapping", email);

    if (!user_already_exists) {
      // If the user does not already exists, then save the user.
      const result = await Promise.all([
        redisClient.hSet(redis_user_key, "user_id", user_id),
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
          // Add the user to the usernames set
          await redisClient.sAdd(keyHelper.generateUniqueUserKey(),email);

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

exports.getUserLikedItems = async (currentUserId, toViewUserId) => {
  try {
    const userLikeItemKey = keyHelper.generateUserLikeKey(toViewUserId);
    let response = {
      'items_liked_by_you' : [],
      'items_you_both_like' : []
    };
    

    // Get the items liked by the viewed user
    const viewedUserLikedItems = await redisClient.sMembers(userLikeItemKey);
    if (!viewedUserLikedItems || !viewedUserLikedItems.length) {
      response["message"] = "The user has no liked items.";
      return response;
    }
    if (viewedUserLikedItems.length) {
      await Promise.all(
        viewedUserLikedItems.map(async item_id => {
          const item_data = await redisClient.hGetAll(
            keyHelper.generateItemKey(item_id)
          );
          response['items_liked_by_you'].push({"id" : item_id, ...item_data});
        })
      );
    }

    // Get the items liked by the both current (logged in) user & the other user
    const loggedInUserLikeItemKey = keyHelper.generateUserLikeKey(currentUserId);
    const commonLikedItems = await redisClient.sInter([userLikeItemKey,loggedInUserLikeItemKey]);

    if (commonLikedItems.length) {
      await Promise.all(
        commonLikedItems.map(async item_id => {
          const item_data = await redisClient.hGetAll(
            keyHelper.generateItemKey(item_id)
          );
          response['items_you_both_like'].push({"id" : item_id, ...item_data});
        })
      );
    }

    console.log(response);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUserById = async (user_id) => {
  try {
    const redis_user_key = keyHelper.generateUserKey(user_id);
    const user_data = await Promise.all([
      await redisClient.hGet(redis_user_key,'email'),
      await redisClient.hGet(redis_user_key,'user_id'),
    ])

    return user_data;
  } catch (error) {
    return error;
  }
};

exports.getUserByEmail = (email) => {};

// ------------------------ Utility functions ------------------------

const deSerializeUser = async (user, userId) => {
  return {
    userId,
    ...user
  };
}

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
