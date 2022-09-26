exports.createItem = async (req, res, next) => {
  try {
    let keys = ["name", "desc", "price", "valid_till"];

    const { name, desc, price, valid_till } = req.body;
    
    // Trim the fields & do validations
    for(const key of keys){
        if(!key){
            throw new Error(`${key} cannot be empty`);
        }
        key = key.trim();
    }

    //
  } catch (err) {
    console.error(`Error while creating item :-`, err.message);
    next(err);
  }
};
