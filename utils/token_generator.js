const jwt = require("jsonwebtoken");
exports.generateToken = (user) => {
    return jwt.sign({email_id: user.email_id, id: user._id}, process.env.JWT_KEYS);

};

exports.resetToken = (user) =>{
    return jwt.sign({id : user._id}, process.env.JWT_KEYS, {expiresIn: 600000});
};

