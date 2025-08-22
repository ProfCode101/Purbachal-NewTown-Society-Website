import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './sign_up';
import Login from './login';
import Home from './home';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3001/verify", {
        headers: { Authorization: token }
      }).then(res => {
        setLoggedIn(res.data.loggedIn);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={loggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={loggedIn ? "/home" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
