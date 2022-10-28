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

  const item_add_status = await redisClient.sAdd(user_item_key, itemId);

  if(!item_add_status){
    throw new Error("Liking the item failed");
  }

  return { "status": true };
  } catch (error) {
    
  }

}
  
