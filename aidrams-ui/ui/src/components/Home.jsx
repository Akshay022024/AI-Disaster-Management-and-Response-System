import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTachometerAlt, FaBell, FaFileAlt, FaEnvelope, FaUser, FaSearch, FaFire, FaHashtag, FaMoon, FaSun, FaCog, FaHeart } from "react-icons/fa";

const API_BASE_URL = "https://localhost:7097";

function Home({ setUser }) {
  const navigate = useNavigate();
  const [view, setView] = useState("posts");
  const [user, setUserData] = useState({ username: "", profilePicture: "" });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply stylesheet when component mounts
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);

    // Clean up function to remove the style when component unmounts
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Auth/check-auth`, {
          withCredentials: true,
        });
        setUserData({
          username: response.data.user.username,
          profilePicture: response.data.user.profilePicture || "src/assets/logo.png",
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
    <div className={`home-container ${darkMode ? "dark" : "light"}`}>
      {/* Left Sidebar */}
      <aside className="left-sidebar">
        <div className="logo">🌍 <span className="logo-text">AIDRAMS</span></div>
        <nav>
          <ul className="nav-menu">
            <li className="nav-item"><FaTachometerAlt /> Dashboard</li>
            <li className="nav-item"><FaFire /> Trending</li>
            <li className="nav-item"><FaHashtag /> Explore</li>
            <li className="nav-item"><FaBell /> Alerts</li>
            <li className="nav-item"><FaFileAlt /> Reports</li>
            <li className="nav-item"><FaEnvelope /> Messages</li>
            <li className="nav-item"><FaUser /> Profile</li>
            <li className="nav-item"><FaHeart /> Favorites</li>
            <li className="nav-item"><FaCog /> Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-header">
          <div className="centered-search-wrapper">
            <FaSearch className="main-search-icon" />
            <input type="text" placeholder="Search reports, weather data, alerts..." className="main-search-bar" />
          </div>
        </div>

        <section className="stories-section">
          <div className="stories-container">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="story">
                <div className="story-indicator"></div>
              </div>
            ))}
          </div>
        </section>

        <div className="toggle-view-container">
          <button className="toggle-view" onClick={() => setView(view === "posts" ? "weather" : "posts")}>
            {view === "posts" ? "View Weather" : "View Posts"}
          </button>
        </div>

        <section className="content-section">
          <h2 className="content-title">{view === "posts" ? "Disaster Reports" : "Weather Analytics"}</h2>
          {view === "posts" ? (
            <div className="posts">
              <div className="post-placeholder">
                <div className="post-header"></div>
                <div className="post-content"></div>
              </div>
              <div className="post-placeholder">
                <div className="post-header"></div>
                <div className="post-content"></div>
              </div>
            </div>
          ) : (
            <div className="weather">
              <div className="weather-cards">
                <div className="weather-card"></div>
                <div className="weather-card"></div>
                <div className="weather-card"></div>
              </div>
              <div className="weather-map"></div>
            </div>
          )}
        </section>
      </main>

      {/* Right Sidebar */}
      <aside className="right-sidebar">
        <div className="profile-container">
          <div className="profile-pic-wrapper-natural">
            <img src={user.profilePicture} alt="Profile" className="profile-pic" />
          </div>
          <div className="user-info">
            <span className="username">@{user.username}</span>
            <span className="user-role">Disaster Reporter</span>
          </div>
        </div>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <div className="sidebar-divider"></div>
        <div className="notification-summary">
          <div className="notification-item">
            <span className="notification-count">3</span>
            <span className="notification-label">New Alerts</span>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </aside>
    </div>
  );
}

// CSS Styles for the component
const styles = `
/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Hide scrollbars but keep functionality */
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
  background: transparent;
}

* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.home-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Theme styles */
.light {
  background-color: #f8f9fa;
  color: #333;
}

.dark {
  background-color: #121212;
  color: #e0e0e0;
}

/* Left Sidebar */
.left-sidebar {
  width: 240px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
  z-index: 10;
}

.light .left-sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
}

.dark .left-sidebar {
  background-color: #1a1a1a;
  border-right: 1px solid #333;
}

.logo {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
}

.logo-text {
  font-family: 'Satisfy', cursive;
  background: linear-gradient(135deg, #0066cc, #4d8bf5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-menu {
  list-style-type: none;
  margin-top: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px;
  margin-bottom: 5px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.light .nav-item {
  color: #555;
}

.dark .nav-item {
  color: #b0b0b0;
}

.light .nav-item:hover {
  background-color: #f0f2f5;
  color: #0066cc;
}

.dark .nav-item:hover {
  background-color: #2d2d2d;
  color: #4d8bf5;
}

.nav-item svg {
  font-size: 18px;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  transition: background-color 0.3s ease;
}

.light .main-content {
  background-color: #f8f9fa;
}

.dark .main-content {
  background-color: #121212;
}

/* Main Header with Search */
.main-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
}

.centered-search-wrapper {
  position: relative;
  width: 60%;
}

.main-search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
}

.main-search-bar {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.light .main-search-bar {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  color: #333;
}

.dark .main-search-bar {
  background-color: #2d2d2d;
  border: 1px solid #444;
  color: #e0e0e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.main-search-bar:focus {
  outline: none;
}

.light .main-search-bar:focus {
  border-color: #0066cc;
  box-shadow: 0 2px 15px rgba(0, 102, 204, 0.1);
}

.dark .main-search-bar:focus {
  border-color: #4d8bf5;
  box-shadow: 0 2px 15px rgba(77, 139, 245, 0.1);
}

.section-title {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
}

.light .section-title {
  color: #333;
}

.dark .section-title {
  color: #e0e0e0;
}

/* Stories Section */
.stories-section {
  margin-bottom: 20px;
}

.stories-container {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  overflow-x: auto;
}

.story {
  min-width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.light .story {
  background: linear-gradient(45deg, #f3f3f3, #e6e6e6);
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .story {
  background: linear-gradient(45deg, #2a2a2a, #222);
  border: 3px solid #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.story:hover {
  transform: scale(1.05);
}

.story-indicator {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #0066cc;
  border-radius: 50%;
  bottom: 0;
  right: 0;
  border: 2px solid;
}

.light .story-indicator {
  border-color: #fff;
}

.dark .story-indicator {
  border-color: #333;
}

/* Toggle View Button Container */
.toggle-view-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-view {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.light .toggle-view {
  background-color: #0066cc;
  color: white;
}

.dark .toggle-view {
  background-color: #4d8bf5;
  color: #fff;
}

.light .toggle-view:hover {
  background-color: #0055aa;
}

.dark .toggle-view:hover {
  background-color: #3a78e0;
}

/* Content Section */
.content-section {
  border-radius: 12px;
  padding: 20px;
  min-height: 500px;
  transition: all 0.3s ease;
}

.light .content-section {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.dark .content-section {
  background-color: #1d1d1d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.content-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.light .content-title {
  color: #333;
}

.dark .content-title {
  color: #e0e0e0;
}

.posts, .weather {
  min-height: 400px;
}

/* Post placeholders */
.post-placeholder {
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.2s ease;
}

.light .post-placeholder {
  background-color: #f8f9fa;
  border: 1px solid #eaeaea;
}

.dark .post-placeholder {
  background-color: #252525;
  border: 1px solid #333;
}

.post-header {
  height: 40px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.light .post-header {
  background-color: #eaeaea;
}

.dark .post-header {
  background-color: #333;
}

.post-content {
  height: 120px;
  border-radius: 6px;
}

.light .post-content {
  background-color: #eaeaea;
}

.dark .post-content {
  background-color: #333;
}

/* Weather section */
.weather-cards {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.weather-card {
  flex: 1;
  height: 120px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.light .weather-card {
  background-color: #f0f7ff;
  border: 1px solid #d0e2ff;
}

.dark .weather-card {
  background-color: #1a2a3a;
  border: 1px solid #2a3a4a;
}

.weather-map {
  height: 250px;
  border-radius: 8px;
}

.light .weather-map {
  background-color: #e9ecef;
  border: 1px solid #dee2e6;
}

.dark .weather-map {
  background-color: #2d2d2d;
  border: 1px solid #3d3d3d;
}

/* Right Sidebar */
.right-sidebar {
  width: 280px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s ease;
  z-index: 10;
}

.light .right-sidebar {
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
}

.dark .right-sidebar {
  background-color: #1a1a1a;
  border-left: 1px solid #333;
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 20px 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.light .profile-container {
  background-color: #f0f2f5;
}

.dark .profile-container {
  background-color: #252525;
}

/* Natural profile pic wrapper without blue gradient */
.profile-pic-wrapper-natural {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.username {
  font-weight: 600;
  font-size: 16px;
}

.light .username {
  color: #333;
}

.dark .username {
  color: #e0e0e0;
}

.user-role {
  font-size: 14px;
  margin-top: 2px;
}

.light .user-role {
  color: #666;
}

.dark .user-role {
  color: #aaa;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  margin: 20px 0;
  transition: all 0.3s ease;
  border: none;
}

.light .theme-toggle {
  background-color: #f0f2f5;
  color: #333;
}

.dark .theme-toggle {
  background-color: #252525;
  color: #e0e0e0;
}

.light .theme-toggle:hover {
  background-color: #e0e0e0;
}

.dark .theme-toggle:hover {
  background-color: #333;
}

.sidebar-divider {
  width: 100%;
  height: 1px;
  margin: 10px 0;
}

.light .sidebar-divider {
  background-color: #e0e0e0;
}

.dark .sidebar-divider {
  background-color: #333;
}

.notification-summary {
  width: 100%;
  margin-bottom: 20px;
}

.notification-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.light .notification-item {
  background-color: #f0f2f5;
}

.dark .notification-item {
  background-color: #252525;
}

.notification-count {
  font-size: 24px;
  font-weight: 700;
}

.light .notification-count {
  color: #0066cc;
}

.dark .notification-count {
  color: #4d8bf5;
}

.notification-label {
  font-size: 14px;
  margin-top: 5px;
}

.light .notification-label {
  color: #666;
}

.dark .notification-label {
  color: #aaa;
}

.logout-button {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.light .logout-button {
  background-color: #f44336;
  color: white;
}

.dark .logout-button {
  background-color: #d32f2f;
  color: white;
}

.light .logout-button:hover {
  background-color: #e53935;
}

.dark .logout-button:hover {
  background-color: #c62828;
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .left-sidebar {
    width: 200px;
  }
  
  .right-sidebar {
    width: 240px;
  }
  
  .centered-search-wrapper {
    width: 70%;
  }
}

@media (max-width: 992px) {
  .home-container {
    flex-direction: column;
  }
  
  .left-sidebar, .right-sidebar {
    width: 100%;
    max-height: 80px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
  }
  
  .nav-menu, .logo-text {
    display: none;
  }
  
  .logo {
    margin-bottom: 0;
  }
  
  .main-header {
    margin-top: 10px;
  }
  
  .centered-search-wrapper {
    width: 70%;
  }
  
  .profile-container {
    flex-direction: row;
    margin-bottom: 0;
    background-color: transparent;
    padding: 0;
  }
  
  .profile-pic-wrapper-natural {
    width: 44px;
    height: 44px;
  }
  
  .user-info {
    align-items: flex-start;
  }
  
  .theme-toggle {
    margin: 0 15px;
  }
  
  .sidebar-divider,
  .notification-summary {
    display: none;
  }
  
  .logout-button {
    margin-top: 0;
    width: auto;
    padding: 8px 15px;
  }
  
  .main-content {
    flex: 1;
    overflow-y: auto;
  }
}
`;

export default Home;