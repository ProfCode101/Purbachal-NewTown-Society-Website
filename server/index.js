const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/users');  
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/users')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


app.post('/register', (req, res) => {
  User.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.status(500).json(err));
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })   
    .then(user => {
      if (!user) {
        return res.json("No user found with this email");
      }

      if (user.password === password) {
        res.json("Success");
      } else {
        res.json("Incorrect password");
      }
    })
    .catch(err => res.status(500).json(err));
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

