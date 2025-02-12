import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://localhost:7097"; // Make sure this matches your backend

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
        { withCredentials: true } // ✅ Allow cookies to be stored
      );

      console.log("Registered:", response.data);
      setMessage("Registration successful! Redirecting...");
      
      // ✅ Set auth state immediately after registration
      setUser(true);

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Error:", err.response);
      setMessage(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="date" name="dateOfBirth" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {message && <p className="error">{message}</p>}
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;
