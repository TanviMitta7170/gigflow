const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

// POST /api/auth/register 
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (err) { res.status(500).json(err); }
});

// POST /api/auth/login 
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(400).json("Wrong credentials");

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set HttpOnly Cookie [cite: 12]
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    }).status(200).json(user);
  } catch (err) { res.status(500).json(err); }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie("accessToken", {
    sameSite: "none",
    secure: true
  }).status(200).json("User has been logged out.");
});

module.exports = router;