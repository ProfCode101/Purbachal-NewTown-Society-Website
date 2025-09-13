const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
}, { timestamps: true });

const Notice = mongoose.model('notices', noticeSchema);

module.exports = Notice;
