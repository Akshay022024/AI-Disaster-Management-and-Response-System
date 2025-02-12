import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://localhost:7097";

function Home({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post(`${API_BASE_URL}/api/Auth/logout`, {}, { withCredentials: true });
    setUser(false);
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Welcome to Home Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
