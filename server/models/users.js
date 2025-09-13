const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['developer', 'admin', 'member', 'visitor'],
    default: 'visitor',
    required: true
  },
  membershipStatus: {
    type: String,
    enum: ['none', 'pending', 'active', 'removed'],
    default: 'none',
    required: true
  },
  // Contact details for membership application/profile
  phone: { type: String },
  address: { type: String },
  // Requested plot number during application
  requestedPlotNumber: { type: String },
  // Assigned plot number for approved members (must be unique across members)
  plotNumber: { type: String, unique: true, sparse: true }
}, { timestamps: true })

const User = mongoose.model('users', userSchema)

module.exports = User   
