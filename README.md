# Purbachal NewTown Society Website

A full-stack web application for user registration and login for Purbachal NewTown Society. Built with **React**, **Node.js**, **Express**, **MongoDB**, and **Bootstrap**.

---

## Features

- User Registration
- User Login
- Password confirmation validation
- Connects to MongoDB for storing user data
- REST API backend with Express
- Responsive UI with Bootstrap

---

## Project Structure

server/
├─ models/
│ └─ User.js
├─ index.js
client/
├─ src/
│ ├─ App.jsx
│ ├─ sign_up.jsx
│ ├─ login.jsx
│ └─ index.js



---

## Prerequisites

- Node.js v22+
- npm or yarn
- MongoDB installed and running on localhost

---

## Backend Setup

1. Navigate to the `server` folder:

```bash
cd server
Install dependencies:

bash

npm install express mongoose cors
Start MongoDB:

bash

mongod
Run the backend server:

bash

node index.js
# or use nodemon
npx nodemon index.js
The backend server runs on http://localhost:3001.

Frontend Setup
Navigate to the client folder:

bash

cd client
Install dependencies:

bash

npm install react react-dom react-router-dom axios bootstrap
Start the React app:

bash

npm start
The frontend runs on http://localhost:3000.

API Endpoints
POST /register: Register a new user

Request Body:

json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response: Newly created user or error (500)

POST /login: (To be implemented) Login endpoint for users

Notes
Ensure that the backend User.js file is located in server/models/User.js.



