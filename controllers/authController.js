const User = require("../models/User");
const jwt = require("jsonwebtoken");

// handle errors
const handleError = (err) => {
    console.log(err.message, err.code);
}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "nam doyun secret", {
    expiresIn: maxAge
  });
}

module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const { fullname, email, password, age, gender, mobile } = req.body;

  try {
    const user = await User.create({ fullname, email, password, age, gender, mobile });
    const token = createToken(user._id);
    res.cookie("jwt", token, {httpOnly: true, maxAge:  maxAge * 1000})
    res.status(201).json({ user : user._id });
  } 
  catch (err) {
    handleError(err);
    res.status(400).send("error, user not created")
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {httpOnly: true, maxAge:  maxAge * 1000})
    res.status(200).json({ user: user._id })
  } catch (err) {
    res.status(400).json({});
  }
};
