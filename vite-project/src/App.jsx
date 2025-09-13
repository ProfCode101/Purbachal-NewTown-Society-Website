import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignUp from './sign_up';
import Login from './login';
import Home from './home';
import ApplyMembership from './apply_membership';
import AdminDashboard from './admin';
import About from './about';
import Members from './members';
import Events from './events';
import Contact from './contact';
import SocietyRules from './society_rules';

function AppRoutes() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#2d5a87'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/about" element={<About />} />
      <Route path="/members" element={user && user.role !== 'visitor' ? <Members /> : <Navigate to="/home" />} />
      <Route path="/events" element={user ? <Events /> : <Navigate to="/login" />} />
      <Route path="/society-rules" element={user ? <SocietyRules /> : <Navigate to="/login" />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/apply-membership" element={user ? <ApplyMembership /> : <Navigate to="/login" />} />
      <Route path="/admin" element={user && isAdmin ? <AdminDashboard /> : <Navigate to="/home" />} />
      <Route path="/" element={<Navigate to={user ? "/home" : "/about"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;



