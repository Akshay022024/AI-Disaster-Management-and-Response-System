import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import NotFound from "./components/NotFound"; // 404 Page Component
import "./App.css";

const API_BASE_URL = "https://localhost:7097";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/Auth/check-auth`, {
            withCredentials: true,
          });
          if (res.status === 200) {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
          }
        } catch (err) {
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Home setUser={setIsAuthenticated} /> : <Navigate to="/login" />}
        />

        {/* Public Routes */}
        <Route
          path="/register"
          element={!isAuthenticated ? <Register setUser={setIsAuthenticated} /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login setUser={setIsAuthenticated} /> : <Navigate to="/" />}
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
