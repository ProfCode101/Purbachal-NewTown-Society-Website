const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import controllers
const authController = require('./controllers/authController');
const membershipController = require('./controllers/membershipController');
const noticesController = require('./controllers/noticesController');
const eventsController = require('./controllers/eventsController');
const societyRulesController = require('./controllers/societyRulesController');

// Import middleware
const { requireAuth, requireRole } = require('./middleware/auth');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

mongoose.connect('mongodb://localhost:27017/users')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Auth routes
app.post('/register', authLimiter, authController.register);
app.post('/login', authLimiter, authController.login);
app.get('/verify', authController.verify);

// Membership routes
app.post('/membership/apply', requireAuth, membershipController.applyForMembership);
app.post('/admin/members/:userId/approve', requireAuth, requireRole(['admin', 'developer']), membershipController.approveMembership);
app.post('/admin/members/:userId/remove', requireAuth, requireRole(['admin', 'developer']), membershipController.removeMember);
app.post('/admin/members/:userId/decline', requireAuth, requireRole(['admin', 'developer']), membershipController.declineMembership);
app.get('/admin/users', requireAuth, requireRole(['admin', 'developer']), membershipController.getUsers);
app.get('/members', requireAuth, membershipController.getMembers);

// Notices routes
app.get('/notices', noticesController.getNotices);
app.post('/admin/notices', requireAuth, requireRole(['admin', 'developer']), noticesController.createNotice);
app.delete('/admin/notices/:id', requireAuth, requireRole(['admin', 'developer']), noticesController.deleteNotice);

// Events routes
app.get('/events', requireAuth, eventsController.getEvents);
app.post('/admin/events', requireAuth, requireRole(['admin', 'developer']), eventsController.createEvent);
app.put('/admin/events/:id', requireAuth, requireRole(['admin', 'developer']), eventsController.updateEvent);
app.delete('/admin/events/:id', requireAuth, requireRole(['admin', 'developer']), eventsController.deleteEvent);

// Society Rules routes
app.get('/society-rules', societyRulesController.getSocietyRules);
app.post('/society-rules', requireAuth, requireRole(['admin', 'developer']), societyRulesController.createSocietyRule);
app.put('/society-rules/:id', requireAuth, requireRole(['admin', 'developer']), societyRulesController.updateSocietyRule);
app.delete('/society-rules/:id', requireAuth, requireRole(['admin', 'developer']), societyRulesController.deleteSocietyRule);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});