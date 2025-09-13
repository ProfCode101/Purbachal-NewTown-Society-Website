const Notice = require('../models/notices');

const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createNotice = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body required' });
    }

    const notice = await Notice.create({
      title,
      body,
      createdBy: req.user.id
    });

    res.json({ message: 'Notice created', notice });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getNotices, createNotice, deleteNotice };
