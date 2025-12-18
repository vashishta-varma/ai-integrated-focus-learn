import { useState, useEffect } from "react";
import { NavLink, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./Pages/Home";
import Explore from "./Pages/Explore";
import JourneyPage from "./Pages/JourneyPage";
import ProfileDashboard from "./Pages/ProfileDashboard";
import VideoPlayerPage from "./Pages/VideoPlayerPage";
import Cookies from "js-cookie";
import Auth from "./Pages/Auth";
import Notes from "./Pages/Notes";
import Chatbot from "./Components/Chatbot";
import logger from "./utils/logger";

function getPayload(jwt) {
  return JSON.parse(atob(jwt.split(".")[1]));
}


function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track route changes
  useEffect(() => {
    logger.navigation(`User navigated to: ${location.pathname}`);
  }, [location.pathname]);

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      try {
        const payload = getPayload(token);
        const expiration = new Date(payload.exp * 1000); 
        const now = new Date();

        if (expiration < now) {
          logger.auth('Token expired, redirecting to login page');
          Cookies.remove("authToken"); 
          setIsAuthenticated(false);
          navigate("/auth");
        } else {
          logger.auth(`Welcome back ${payload.username || payload.email}!`);
          setIsAuthenticated(true);
          setUser(payload);
        }
      } catch (error) {
        logger.error(`❌ Token parsing failed: ${error.message}`);
        Cookies.remove("authToken");
        setIsAuthenticated(false);
        navigate("/auth");
      }
    } else {
      logger.auth('No token found, showing login page');
      setIsAuthenticated(false);
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/journey/:jId" element={<JourneyPage />} />
        <Route path="/notes/:journeyId" element={<Notes />} />
        <Route path="/player/:chapterId" element={<VideoPlayerPage />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer />
      {isAuthenticated && <Chatbot />}
    </ThemeProvider>
  );
}

export default App;
