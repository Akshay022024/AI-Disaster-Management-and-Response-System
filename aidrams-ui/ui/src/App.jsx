import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import "./App.css";

const API_BASE_URL = "https://localhost:7097";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Auth/check-auth`, {
          withCredentials: true, // ✅ Ensures cookies are sent
        });
        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home setUser={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
        <Route path="/register" element={<Register setUser={setIsAuthenticated} />} />
        <Route path="/login" element={<Login setUser={setIsAuthenticated} />} />
      </Routes>
    </Router>
  );
}

export default App;
