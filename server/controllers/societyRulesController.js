const SocietyRule = require('../models/societyRules');

const getSocietyRules = async (req, res) => {
  try {
    const rules = await SocietyRule.find()
      .sort({ updatedAt: -1 });
    res.json({ rules });
  } catch (e) {
    console.error('Society rules fetch error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

const createSocietyRule = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const rule = new SocietyRule({
      title,
      description,
      category: category || 'general',
      createdBy: req.user.id
    });

    const savedRule = await rule.save();
    
    res.json({ success: true, rule: savedRule });
  } catch (e) {
    console.error('Society rules create error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateSocietyRule = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    const rule = await SocietyRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    rule.title = title || rule.title;
    rule.description = description || rule.description;
    rule.category = category || rule.category;

    const updatedRule = await rule.save();

    res.json({ success: true, rule: updatedRule });
  } catch (e) {
    console.error('Society rules update error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteSocietyRule = async (req, res) => {
  try {
    const rule = await SocietyRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    await SocietyRule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Rule deleted successfully' });
  } catch (e) {
    console.error('Society rules delete error:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getSocietyRules,
  createSocietyRule,
  updateSocietyRule,
  deleteSocietyRule
};
