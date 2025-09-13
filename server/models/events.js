const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  attendees: { type: Number, default: 0 },
  type: { 
    type: String, 
    enum: ['meeting', 'festival', 'seminar', 'volunteer'],
    required: true 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });

const Event = mongoose.model('events', eventSchema);

module.exports = Event;
