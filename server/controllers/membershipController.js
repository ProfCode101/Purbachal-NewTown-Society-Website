const User = require('../models/users');

const applyForMembership = async (req, res) => {
  try {
    const { phone, address, plotNumber } = req.body || {};
    if (!phone || !address || !plotNumber) {
      return res.status(400).json({ error: 'phone, address, and plotNumber are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.membershipStatus === 'pending' || user.membershipStatus === 'active') {
      return res.status(400).json({ error: 'Already applied or active' });
    }

    // Store application details and requested plot number
    user.membershipStatus = 'pending';
    user.phone = phone;
    user.address = address;
    user.requestedPlotNumber = String(plotNumber).trim();
    await user.save();
    res.json({ message: 'Application submitted', membershipStatus: user.membershipStatus });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

const approveMembership = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Ensure requested plot number exists
    const plotToAssign = user.requestedPlotNumber;
    if (!plotToAssign) return res.status(400).json({ error: 'User did not request a plot number' });

    // Enforce one member per plot number: ensure no other active member has this plot
    const existing = await User.findOne({ plotNumber: plotToAssign, membershipStatus: 'active' });
    if (existing) {
      return res.status(400).json({ error: 'Plot number already assigned to another member' });
    }

    user.membershipStatus = 'active';
    user.role = 'member';
    user.plotNumber = plotToAssign;
    await user.save();
    res.json({ message: 'Membership approved and plot assigned', plotNumber: user.plotNumber });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

const removeMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.membershipStatus = 'removed';
    user.role = 'visitor';
    user.plotNumber = undefined; // Clear plot number when removing
    await user.save();
    res.json({ message: 'Member removed' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

const declineMembership = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.membershipStatus !== 'pending') {
      return res.status(400).json({ error: 'User is not pending approval' });
    }
    user.membershipStatus = 'none';
    user.requestedPlotNumber = undefined; // Clear requested plot number when declining
    await user.save();
    res.json({ message: 'Membership application declined' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role membershipStatus requestedPlotNumber plotNumber phone address createdAt updatedAt');
    res.json({ users });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getMembers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role membershipStatus plotNumber createdAt');
    res.json({ users });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { 
  applyForMembership, 
  approveMembership, 
  removeMember, 
  declineMembership, 
  getUsers,
  getMembers
};
