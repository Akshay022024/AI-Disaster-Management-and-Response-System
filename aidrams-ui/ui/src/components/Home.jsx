import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://localhost:7097";

function Home({ setUser }) {
  const navigate = useNavigate();
  const [view, setView] = useState("posts");
  const [user, setUserData] = useState({ username: "", profilePicture: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Auth/check-auth`, {
          withCredentials: true,
        });
        setUserData({
          username: response.data.user.username,
          profilePicture: response.data.user.profilePicture || "src/assets/logo.png", // Fallback image
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(false);
        localStorage.removeItem("isAuthenticated");
        navigate("/login");                                                                                                     
      }
    };

    fetchUser();
  }, [setUser, navigate]);

  const handleLogout = async () => {
    await axios.post(`${API_BASE_URL}/api/Auth/logout`, {}, { withCredentials: true });
    setUser(false);
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };
  
  return (
    <div style={styles.homeContainer}>
      {/* Left Sidebar */}
      <aside style={styles.leftSidebar}>
        <div style={styles.logo}>🌍 AIDRAMS</div>
        <nav>
          <ul style={styles.navMenu}>
            <li style={styles.navItem}>Dashboard</li>
            <li style={styles.navItem}>Alerts</li>
            <li style={styles.navItem}>Reports</li>
            <li style={styles.navItem}>Messages</li>
            <li style={styles.navItem}>Profile</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <section style={styles.storiesSection}>
          <div style={styles.storiesContainer}>
            {[...Array(4)].map((_, index) => (
              <div key={index} style={styles.story}></div>
            ))}
          </div>
          <button style={styles.toggleView} onClick={() => setView(view === "posts" ? "weather" : "posts")}>
            {view === "posts" ? "View Weather" : "View Posts"}
          </button>
        </section>

        <section style={styles.contentSection}>
          {view === "posts" ? (
            <div style={styles.posts}>Disaster Reports & Updates...</div>
          ) : (
            <div style={styles.weather}>Real-time Weather Analytics...</div>
          )}
        </section>
      </main>

      {/* Right Sidebar */}
      <aside style={styles.rightSidebar}>
        <div style={styles.accountInfo}>
          <img 
            src={user.profilePicture} 
            alt="Profile" 
            style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }} 
          />
          @{user.username}
        </div>
        <div style={styles.extraContent}>Emergency Contacts & Resources</div>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </aside>
    </div>
  );
}


// Modern, unique styles
const styles = {
  homeContainer: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    background: "#121212",
    color: "#eee",
  },
  leftSidebar: {
    width: "20%",
    background: "#1c1c1c",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    borderRight: "2px solid #2a2a2a",
  },
  logo: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#4CAF50",
  },
  navMenu: {
    listStyle: "none",
    padding: 0,
    width: "100%",
    textAlign: "center",
  },
  navItem: {
    padding: "12px 0",
    fontSize: "18px",
    cursor: "pointer",
    transition: "0.3s",
    color: "#bbb",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  storiesSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  storiesContainer: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    padding: "10px",
    width: "100%",
  },
  story: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "linear-gradient(45deg, #ff8a00, #e52e71)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleView: {
    marginTop: "12px",
    padding: "10px 18px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "0.3s",
  },
  contentSection: {
    marginTop: "20px",
    width: "100%",
  },
  posts: {
    width: "100%",
    background: "#222",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.2)",
  },
  weather: {
    width: "100%",
    background: "#333",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0px 0px 10px rgba(0, 191, 255, 0.2)",
  },
  rightSidebar: {
    width: "20%",
    background: "#1c1c1c",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    borderLeft: "2px solid #2a2a2a",
  },
  accountInfo: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  extraContent: {
    marginTop: "20px",
    color: "#888",
    fontSize: "14px",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: "20px",
    padding: "10px 18px",
    border: "none",
    background: "#f44336",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "0.3s",
  },
};

export default Home;
