const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

module.exports.isLoggedIn = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "You need to login first.");
    return res.redirect("/");
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEYS);
    
    // Check if the decoded token has the email_id
    if (!decoded.email_id) {
      req.flash("error", "Invalid token.");
      return res.redirect("/");
    }

    let user = await userModel.findOne({ email_id: decoded.email_id }).select("-password");

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in isLoggedIn middleware:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/");
  }
};
