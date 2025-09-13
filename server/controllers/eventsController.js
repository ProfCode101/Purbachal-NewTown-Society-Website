const Event = require('../models/events');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, attendees, type } = req.body;
    if (!title || !date || !time || !location || !description || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const event = await Event.create({
      title,
      date,
      time,
      location,
      description,
      attendees: parseInt(attendees) || 0,
      type,
      createdBy: req.user.id
    });
    
    res.json({ message: 'Event created', event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { title, date, time, location, description, attendees, type } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(date && { date }),
        ...(time && { time }),
        ...(location && { location }),
        ...(description && { description }),
        ...(attendees && { attendees: parseInt(attendees) }),
        ...(type && { type })
      },
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event updated', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
