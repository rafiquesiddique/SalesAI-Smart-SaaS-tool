// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import Layout from "@/components/Layout"; // Your Layout component
import Dashboard from "@/pages/Dashboard";
import Leads from "@/pages/Leads";
import Activities from "@/pages/Activities";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm"; // Import the new RegisterForm
import { AuthAPI } from "@/entities/all"; // For authentication

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());
  const [user, setUser] = useState(AuthAPI.getCurrentUser()); // Load user from local storage

  const handleLogin = async (email, password) => {
    // This is passed to LoginForm
    const result = await AuthAPI.login(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      setUser(AuthAPI.getCurrentUser());
      return true;
    } else {
      console.error("Login failed:", result.message);
      return false;
    }
  };

  const handleLogout = () => {
    AuthAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Effect to update user state if authentication status changes (e.g., from an API call elsewhere)
  useEffect(() => {
    setIsAuthenticated(AuthAPI.isAuthenticated());
    setUser(AuthAPI.getCurrentUser());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        
        {/* New public route for registration */}
        <Route path="/register" element={<RegisterForm />} /> 

        {/* Protected routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout user={user} onLogout={handleLogout} />
            ) : (
              // Redirect to login if not authenticated for any protected route
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Nested routes will render within the <Outlet /> in Layout */}
          <Route index element={<Navigate to="/dashboard" replace />} /> {/* Redirect root to dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="activities" element={<Activities />} />
          {/* Add more protected routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}