const redisClient = require("../helpers/redis.helper");
const uuid = require('uuid');

exports.createUser = async (username, password) => {
    const gen_user_id = uuid.v4();
    console.log(gen_user_id);
    
}