import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import SignUp from './sign_up'
import Login from './login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />   {/* default route */}
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
