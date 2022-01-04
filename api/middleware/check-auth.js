const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret"); //if verification fails,it will throw an error.
    // so use try catch
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      //401=> Unauthenticated
      message: "Auth Failed",
    });
  }
};
