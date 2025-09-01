// Update App.js with protected routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Spaces from './components/Spaces';
import Marketplace from './components/Marketplace';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddSpace from './components/AddSpace';
import AdminPanel from './components/dashboards/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.userType !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container mt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/spaces" element={<Spaces />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/add-space" element={
                  <ProtectedRoute requiredRole="LANDOWNER">
                    <AddSpace />
                  </ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminPanel />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;