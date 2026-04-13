import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TLDashboard from './pages/TLDashboard';
import MemberDashboard from './pages/MemberDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'TL' ? '/tl-dashboard' : '/member-dashboard'} />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/tl-dashboard" 
            element={
              <ProtectedRoute allowedRole="TL">
                <TLDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/member-dashboard" 
            element={
              <ProtectedRoute allowedRole="Member">
                <MemberDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
