exports.generateUserKey = (id) => `users#${id}`;

exports.generateSessionKey = (id) => `session#${id}`;

exports.generateItemKey = (id) => `item#${id}`;

exports.generateUniqueUserKey = () => `usernames`;

exports.generateItemLikeKey = (userId) => `items#like-${userId}`;