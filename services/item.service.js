const redisClient = require("../helpers/redis.helper");
const keyHelper = require("../helpers/key.helper");
const uuidHelper = require("../helpers/uuid.helper");

exports.createItem = async (itemData) => {
  try {
    const item_id = uuidHelper.generateUniqueUuidKey();
    const item_key = keyHelper.generateItemKey(item_id);

    // Store the item Data into a hash
    const creation_status = await Promise.all([
      redisClient.hSet(item_key, "name", itemData.name),
      redisClient.hSet(item_key, "desc", itemData.desc),
      redisClient.hSet(item_key, "price", itemData.price),
      redisClient.hSet(item_key, "valid_till", itemData.valid_till),
      redisClient.hSet(item_key, "likes", 0)
    ]);

    if (creation_status.every((el) => el === 1)) {
      return { "status": true, "created_item_id": item_id };
    }

    // Map the user to the item
  } catch (error) {
    return error;
  }
};

exports.getItem = async (itemId) => {
  try {
    const itemKey = keyHelper.generateItemKey(itemId);

    const item = await redisClient.hGetAll(itemKey);
    return item;
  } catch (error) {
    return error;
  }
};

exports.likeItem = async (itemId, user_id) => {
  try {
    const user_item_key = keyHelper.generateUserLikeKey(user_id);
    const item_key = keyHelper.generateItemKey(itemId);
    // Check if item to be liked already exists or not
    const item_present = await redisClient.hExists(item_key, "name");
    
    if (item_present) {
      // Try to like the item to the set.
      const item_add_status = await redisClient.sAdd(user_item_key, itemId);

      // If the liking the item failed
      if (!item_add_status) {
        // Then, check if the item is already liked before
        const item_already_liked = await redisClient.sIsMember(
          user_item_key,
          itemId
        );
        // If the item is already liked, then throw the error
        if (item_already_liked) {
          throw new Error(
            `Item with id ${itemId} has been already liked before.`
          );
        }
        throw new Error("Liking the item failed.");
      }
      else{
        // Increment the like counter in the "item" hash
        const likeIncrStatus = await redisClient.hIncrBy(item_key,'likes',1);
        console.log(likeIncrStatus);
      }

      return { status: true };
    }
    else{
      throw new Error(`The item with id ${itemId} does not exist.`);
    }

  } catch (error) {
     return error;
  }
};

exports.unlikeItem = async (itemId, user_id) => {
  try {
    const user_item_key = keyHelper.generateUserLikeKey(user_id);
    const item_key = keyHelper.generateItemKey(itemId);
    // Check if item to be unliked already exists or not
    const item_present = await redisClient.hExists(item_key, "name");
    
    if (item_present) {
      // Check if item is already liked or not.
      const item_already_liked = await redisClient.sIsMember(
        user_item_key,
        itemId
      );

      if (item_already_liked) {
        // Try to unlike the item to the set.
        const item_unlike_status = await redisClient.SREM(
          user_item_key,
          itemId
        );

        // If the unliking the item failed
        if (item_unlike_status) {
          // Decrement the like counter in the "item" hash
          const unlikeIncrStatus = await redisClient.hIncrBy(
            item_key,
            "likes",
            -1
          );
          console.log(unlikeIncrStatus);
        } else {
          throw new Error(
            "Some error occured in liking the item. Please try again."
          );
        }
      }
      else{
        throw new Error(
          "Item is not liked by the user. So, it cannot be unliked."
        );
      }

      return { status: true };
    } else {
      throw new Error(`The item with id ${itemId} does not exist.`);
    }

  } catch (error) {
     return error;
  }
}

exports
  
