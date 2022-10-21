const itemService = require("../services/item.service");

exports.createItem = async (req, res, next) => {
  try {
    // console.log(req.session);

    // const keys = ["name", "desc", "price", "valid_till"];
    
    // Trim the fields & do validations
    for (let key in req.body) {
      if (!req.body[key].trim()) {
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

    if(creation_status === true){
      res.send({
        "message" : 'Item created successfully.'
      });
    }
  } catch (err) {
    console.error(`Error while creating item :-`, err.message);
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    console.log(itemId);
    if (!itemId) {
      throw new Error(`Item id is not specified`);
    }
    const item = await itemService.getItem(itemId);

    if (!item) {
      throw new Error();
    }
  } catch (error) {
    next(error);
  }
};