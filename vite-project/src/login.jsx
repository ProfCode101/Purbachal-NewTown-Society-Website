import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; 
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3001/login", formData)
      .then(result => {
        if (result.data.token) {
          localStorage.setItem("token", result.data.token);
          navigate("/home");
        } else {
          alert("Login failed");
        }
      })
      .catch(err => {
        alert(err.response?.data?.error || "Invalid email or password!");
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          <p>
            Don’t have an account? <a href="/register">Signup</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
