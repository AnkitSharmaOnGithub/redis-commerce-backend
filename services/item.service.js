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
      return true;
    }

    // Map the user to the item
  } catch (error) {
    return error;
  }
}

exports.getItem = async (itemId) => {
  try {
    const itemKey = keyHelper.generateItemKey(itemId);

    const item = await redisClient.hGetAll(itemKey);
    return item;
  } catch (error) {
    return error;
  }
};