const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

//desc Register a new user
//route POST /api/auth/signup
//access Public
const signUp = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error("this username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, password: hashedPassword });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  res.status(201).json({ token });
});

//desc Login a user
//route POST /api/auth/login
//access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.status(401);
    throw new Error("Invalid username");
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    res.status(200).json({ token });
  } else {
    res.status(401);
    throw new Error("password is incorrect");
  }
});

module.exports = { signUp, login };
