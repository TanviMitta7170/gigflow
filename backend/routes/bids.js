const router = require('express').Router();
const { Bid, Gig } = require('../models/models');
const verifyToken = require('../middleware/authMiddleware');

[cite_start]// POST /api/bids (Submit Bid) [cite: 30]
router.post('/', verifyToken, async (req, res) => {
  try {
    const gig = await Gig.findById(req.body.gigId);
    if(gig.ownerId.toString() === req.user.id) return res.status(403).json("Cannot bid on your own gig");

    const newBid = new Bid({ ...req.body, freelancerId: req.user.id });
    const savedBid = await newBid.save();
    res.status(201).json(savedBid);
  } catch (err) { res.status(500).json(err); }
});

[cite_start]// GET /api/bids/:gigId (Smart Fetch) [cite: 30]
router.get('/:gigId', verifyToken, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json("Gig not found");

    let bids;
    // FIX: If Owner -> Send ALL bids. If Freelancer -> Send ONLY their own bid.
    if (gig.ownerId.toString() === req.user.id) {
       bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
    } else {
       bids = await Bid.find({ gigId: req.params.gigId, freelancerId: req.user.id }).populate('freelancerId', 'name email');
    }
    
    res.status(200).json(bids);
  } catch (err) { res.status(500).json(err); }
});

[cite_start]// PATCH /api/bids/:bidId/hire (The Hiring Logic) [cite: 30]
router.patch('/:bidId/hire', verifyToken, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId).populate('gigId');
    if (!bid) return res.status(404).json("Bid not found");
    
    if (bid.gigId.ownerId.toString() !== req.user.id) {
      return res.status(403).json("Unauthorized Action");
    }

    // Atomic updates: Update Gig, Hire Winner, Reject Losers
    await Promise.all([
      Gig.findByIdAndUpdate(bid.gigId._id, { status: 'Assigned' }), // Sets Gig to Assigned [cite: 25]
      Bid.findByIdAndUpdate(req.params.bidId, { status: 'hired' }),  // Sets Winner to Hired [cite: 27]
      Bid.updateMany(
        { gigId: bid.gigId._id, _id: { $ne: req.params.bidId } },
        { status: 'rejected' } // Rejects everyone else [cite: 28]
      )
    ]);
    
    res.status(200).json("Freelancer hired successfully");
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;