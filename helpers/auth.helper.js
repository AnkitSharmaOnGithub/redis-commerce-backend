exports.isLoggedIn = (req, res, next) => {
  // console.log(req.url);
  console.log(req.session);

  const excluded_urls = ["/user/create", "/user/login"];

  // console.log(!excluded_urls.includes(req.url));
  // console.log(!req.session.isLoggedIn);

  if (!excluded_urls.includes(req.url) && req.session.isLoggedIn !== true) {
    throw new Error("Please login and the continue!");
  }
  next();
};
