import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const API_BASE_URL = "https://localhost:7097";

function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    try {
      await axios.post(`${API_BASE_URL}/api/Auth/login`, formData, {
        withCredentials: true, // ✅ Ensures cookies are sent
      });
  
      // ✅ Persist authentication state
      setUser(true);
      localStorage.setItem("isAuthenticated", "true");
  
      navigate("/");
    } catch (err) {
      console.error("Error:", err.response);
      setMessage("Invalid credentials, try again.");
    }
  };
  
  

  return (
    <div className="auth-container">
      <div className="weather-animation"></div> {/* Animated background */}
      
      <div className="auth-box">
        <img src="src/assets/logo.png" alt="Logo" className="logo" />
        <h2>AI Disaster Management</h2>
        <p className="subtitle">Stay prepared, stay safe.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>

        {message && <p className="error">{message}</p>}
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}

export default Login;
