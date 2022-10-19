

exports.createItem = async (req, res, next) => {
  try {
    // console.log(req.session);

    const keys = ["name", "desc", "price", "valid_till"];
    
    // Trim the fields & do validations
    for (let key in req.body) {
      if (!req.body[key].trim()) {
        throw new Error(`${key} cannot be empty`);
      }

      req.body[key] = req.body[key].trim();
    }

    let { name, desc, price, valid_till } = req.body;

    let valid_till_timestamp = new Date(valid_till).getTime();

    console.log(name, desc, price, valid_till_timestamp);
    res.send({name, desc, price, valid_till});
  } catch (err) {
    console.error(`Error while creating item :-`, err.message);
    next(err);
  }
};
