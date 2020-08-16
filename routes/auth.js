const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  //TODO validation

  //check if already exists
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).send("Email already exists");
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(200).send(savedUser);
  } catch {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //check if already exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email not found!");
  }
  //compare user password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");
  
  //create jwt
  const token = jwt.sign({_id: user._id }, process.env.TOKEN_SECRET)
  res.header('auth-token', token).status(200).send('Logged in!');
  
});
module.exports = router;
