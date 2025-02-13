import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const API_BASE_URL = "https://localhost:7097";

function Register({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Auth/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        },
        { withCredentials: true } // ✅ Ensures cookies are sent
      );
  
      console.log("Registered:", response.data);
      setMessage("Registration successful! Redirecting...");
  
      // ✅ Persist authentication state
      setUser(true);
      localStorage.setItem("isAuthenticated", "true");
  
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Error:", err.response);
      setMessage(err.response?.data?.message || "Registration failed!");
    }
  };
  

  return (
    <div className="auth-container">
      <div className="weather-animation"></div>

      <div className="auth-box">
        <img src="src/assets/logo.png" alt="Logo" className="logo" />
        <h2>AI Disaster Management</h2>
        <p className="subtitle">Join us in making a difference.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="date" name="dateOfBirth" onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>

        {message && <p className="error">{message}</p>}
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default Register;
