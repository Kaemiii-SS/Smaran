import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import LandingPage from './pages/landingPage.jsx';
import Login from './pages/loginPage.jsx';
import Register from './pages/RegisterPage.jsx';
import RoleBasedDashboard from './pages/RoleBasedDashboard.jsx';
import DashboardOverview from './components/DashboardOverview.jsx';
import GamesCatalog from './pages/GamesCatalog.jsx';
import ChatHistory from './pages/ChatHistory.jsx';
import FindItGame from './game_2/findit.jsx';
import ConstellationGame from './game_3/constellation.jsx';
import FollowTheRhythmGame from './game_4/follow_the_rhythm.jsx';
import Game5Entry from './game_5/game_5_entry.jsx';
import PatientSchedule from './pages/PatientSchedule.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthRoute from './components/AuthRoute.jsx';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes - Prevent logged-in users from accessing login/register */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Protected Routes - Require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<RoleBasedDashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="games" element={<GamesCatalog />} />
            <Route path="chat" element={<ChatHistory />} />
            <Route path="schedule" element={<PatientSchedule />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Standalone Games */}
          <Route path="/game/find-it" element={<FindItGame />} />
          <Route path="/game/constellation" element={<ConstellationGame />} />
          <Route path="/game/follow-the-rhythm" element={<FollowTheRhythmGame />} />
          <Route path="/game/recall" element={<Game5Entry />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;