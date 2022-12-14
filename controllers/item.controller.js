const itemService = require("../services/item.service");

exports.createItem = async (req, res, next) => {
  try {
    // console.log(req.session);

    const keys = ["name", "desc", "price", "valid_till"];
    
    // Trim the fields & do validations
    for (let key of keys) {
      if (!req.body[key] || !req.body[key].trim()) {
        throw new Error(`${key} cannot be empty`);
      }

      req.body[key] = req.body[key].trim();
    }

    let { name, desc, price, valid_till } = req.body;

    let valid_till_timestamp = new Date(valid_till).getTime();

    // Store the data in redis via service
    const creation_status = await itemService.createItem({
      name,desc,price,"valid_till" : valid_till_timestamp
    })

    if(creation_status.status === true && creation_status.created_item_id){
      res.send({
        "message" : 'Item created successfully.',
        "item_id" : creation_status.created_item_id
      });
    }
  } catch (err) {
    console.error(`Error while creating item :-`, err.message);
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    let itemId = req.params.itemId;
    itemId = itemId.trim();
    
    if (!itemId) {
      throw new Error(`Item id is not specified`);
    }
    const item = await itemService.getItem(itemId);

    if (!item) {
      throw new Error(`No item find with id: ${itemId}`);
    }

    res.status(200).send(desearlizeItem(item, itemId));
  } catch (error) {
    next(error);
  }
};

exports.likeItem = async (req, res, next) => {
  try {
    const itemId = req.body.itemId;

    if (!itemId) {
      throw new Error(`Item id is not specified`);
    }

    const user_data = req.session;
    const user_id = user_data.user_id;

    const add_like_status = await itemService.likeItem(itemId, user_id);

    if (add_like_status && add_like_status.status === true) {
      res
        .status(200)
        .send(`Item with id ${itemId} has been liked successfully.`);
    } else {
      res.status(500).send({ "message": add_like_status.message });
    }
  } catch (error) {
    next(error);
  }
};

exports.unlikeItem = async (req, res, next) => {
  try {
    const itemId = req.body.itemId;

    if (!itemId) {
      throw new Error(`Item id is not specified.`);
    }

    const user_data = req.session;
    const user_id = user_data.user_id;

    const unlike_status = await itemService.unlikeItem(itemId, user_id);

    if (unlike_status && unlike_status.status === true) {
      res
        .status(200)
        .send(`Item with id ${itemId} has been unliked successfully.`);
    } else {
      res.status(500).send({ "message": add_like_status.message });
    }
  } catch (error) {
    next(error);
  }
}

// --------------- Utility functions ------------------------

function desearlizeItem(item, id){
  return {
    id,
    name: item.name,
    desc: item.desc,
    price: item.price,
    valid_till: item.valid_till,
    likes : item.likes
  };
}