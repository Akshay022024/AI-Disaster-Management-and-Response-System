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

      setUser(true); // ✅ Update auth state
      navigate("/");
    } catch (err) {
      console.error("Error:", err.response);
      setMessage("Invalid credentials, try again.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      {message && <p className="error">{message}</p>}
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}

export default Login;
