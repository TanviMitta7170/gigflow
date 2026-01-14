const router = require('express').Router();
const { Gig } = require('../models/models');
const verifyToken = require('../middleware/authMiddleware');

[cite_start]// GET /api/gigs (Fetch ALL gigs, including Assigned ones) [cite: 18]
router.get('/', async (req, res) => {
  const query = req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {};
  try {
    // FIX: Removed "status: 'Open'" so Assigned gigs are visible
    const gigs = await Gig.find({ ...query }).populate('ownerId', 'name').sort({ createdAt: -1 });
    res.status(200).json(gigs);
  } catch (err) { res.status(500).json(err); }
});

[cite_start]// POST /api/gigs (Create Gig) [cite: 20]
router.post('/', verifyToken, async (req, res) => {
  const newGig = new Gig({ ...req.body, ownerId: req.user.id });
  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) { res.status(500).json(err); }
});

// GET Single Gig (Helper for details page)
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
    res.status(200).json(gig);
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;