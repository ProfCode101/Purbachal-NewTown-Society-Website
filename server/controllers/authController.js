const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey_dev_only";

// Input validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Input validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password: hashedPassword, 
      role: 'visitor', 
      membershipStatus: 'none' 
    });

    res.status(201).json({ 
      message: "User registered successfully", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.json({ 
      message: "Login successful", 
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, membershipStatus: user.membershipStatus }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verify = async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.json({ loggedIn: false });

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ loggedIn: false });
    
    try {
      const user = await User.findById(decoded.id, 'name email role membershipStatus');
      if (!user) return res.json({ loggedIn: false });
      
      res.json({ 
        loggedIn: true, 
        userId: decoded.id, 
        role: decoded.role,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          membershipStatus: user.membershipStatus
        }
      });
    } catch (e) {
      res.json({ loggedIn: false });
    }
  });
};

module.exports = { register, login, verify };
