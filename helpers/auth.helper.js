exports.isLoggedIn = (req, res, next) => {
  // console.log(req.url);
  console.log(req.session);

  const excluded_urls = ["/user/create", "/user/login"];

  if (!excluded_urls.includes(req.url) && req.session.isLoggedIn !== true) {
    throw new Error("Please login and the continue!");
  }
  next();
};
