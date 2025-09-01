import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Spaces from './components/Spaces';
import SpaceDetail from './components/SpaceDetail';
import Marketplace from './components/marketplace/MarketplaceList';
import MarketplaceDetail from './components/marketplace/MarketplaceDetail';
import CreateListing from './components/marketplace/CreateListing';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddSpace from './components/AddSpace';
import EditSpace from './components/EditSpace';
import AdminPanel from './components/AdminPanel';
import Checkout from './components/transactions/Checkout';
import GreenPartnerApplication from './components/certification/GreenPartnerApplication';
import IoTDashboard from './components/iot/IoTDashboard';
import Notifications from './components/notifications/NotificationBell';
import Profile from './components/Profile';
import Settings from './components/Settings';
import About from './components/About';
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
                <Route path="/about" element={<About />} />
                <Route path="/spaces" element={<Spaces />} />
                <Route path="/space/:id" element={
                  <ProtectedRoute>
                    <SpaceDetail />
                  </ProtectedRoute>
                } />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/:id" element={
                  <ProtectedRoute>
                    <MarketplaceDetail />
                  </ProtectedRoute>
                } />
                <Route path="/marketplace/sell" element={
                  <ProtectedRoute requiredRole="URBAN_FARMER">
                    <CreateListing />
                  </ProtectedRoute>
                } />
                <Route path="/checkout/:id" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
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
                <Route path="/edit-space/:id" element={
                  <ProtectedRoute>
                    <EditSpace />
                  </ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/green-partner" element={
                  <ProtectedRoute>
                    <GreenPartnerApplication />
                  </ProtectedRoute>
                } />
                <Route path="/iot-dashboard" element={
                  <ProtectedRoute>
                    <IoTDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
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