const redisClient = require("../helpers/redis.helper");
const keyHelper = require("../helpers/key.helper");
const uuidHelper = require("../helpers/uuid.helper");

exports.createItem = async (itemData) => {
    const item_id = uuidHelper.generateUniqueUuidKey();
    const item_key = keyHelper.generateItemKey(item_id);

    // Store the item Data into a hash
    await Promise.all([
        redisClient.hSet(item_key,"name", itemData.name),
        redisClient.hSet(item_key,"desc", itemData.desc),
        redisClient.hSet(item_key,"price", itemData.price),
        redisClient.hSet(item_key,"valid_till", itemData.valid_till)
    ]);

    // Map the user to the item
    
}