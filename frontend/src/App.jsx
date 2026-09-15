import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage.jsx';
import Login from './pages/loginPage.jsx';
import Register from './pages/RegisterPage.jsx';

function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  );
}
export default App;
