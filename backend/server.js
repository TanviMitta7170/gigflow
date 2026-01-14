const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Gig, Bid } = require('./models/models');

dotenv.config();
const app = express();

// --- Middlewares ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL, // Must match frontend URL
  credentials: true               // Allow cookies
}));

// --- DB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// --- Auth Middleware ---
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalid" });
    req.user = user;
    next();
  });
};

// --- ROUTES: AUTH ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.status(201).json("User created");
  } catch (err) { res.status(500).json(err.message); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json("Wrong credentials");

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("accessToken", token, {
      httpOnly: true, // Security requirement
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }).status(200).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) { res.status(500).json(err.message); }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie("accessToken", { sameSite: "none", secure: true }).json("Logged out");
});

// --- ROUTES: GIGS ---
app.get('/api/gigs', async (req, res) => {
  const q = req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {};
  try {
    const gigs = await Gig.find({ ...q, status: 'Open' }).populate('ownerId', 'name');
    res.status(200).json(gigs);
  } catch (err) { res.status(500).json(err); }
});

app.get('/api/gigs/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
    res.status(200).json(gig);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/gigs', verifyToken, async (req, res) => {
  const newGig = new Gig({ ...req.body, ownerId: req.user.id });
  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) { res.status(500).json(err); }
});

// --- ROUTES: BIDS ---
app.post('/api/bids', verifyToken, async (req, res) => {
  try {
    const gig = await Gig.findById(req.body.gigId);
    if (gig.ownerId.toString() === req.user.id) return res.status(403).json("Cannot bid on own gig");
    
    const newBid = new Bid({ ...req.body, freelancerId: req.user.id });
    await newBid.save();
    res.status(201).json("Bid placed");
  } catch (err) { res.status(500).json(err); }
});

app.get('/api/bids/:gigId', verifyToken, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (gig.ownerId.toString() !== req.user.id) return res.status(403).json("Unauthorized");
    
    const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
    res.status(200).json(bids);
  } catch (err) { res.status(500).json(err); }
});

// --- CRITICAL HIRING LOGIC ---
app.patch('/api/bids/:bidId/hire', verifyToken, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId).populate('gigId');
    if (!bid) return res.status(404).json("Bid not found");

    if (bid.gigId.ownerId.toString() !== req.user.id) return res.status(403).json("Unauthorized");

    await Promise.all([
      Gig.findByIdAndUpdate(bid.gigId._id, { status: 'Assigned' }),
      Bid.findByIdAndUpdate(req.params.bidId, { status: 'hired' }),
      Bid.updateMany(
        { gigId: bid.gigId._id, _id: { $ne: req.params.bidId } },
        { status: 'rejected' }
      )
    ]);
    res.status(200).json("Hired successfully");
  } catch (err) { res.status(500).json(err); }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend running on 5000");
});