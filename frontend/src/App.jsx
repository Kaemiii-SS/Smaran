import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage.jsx';
import Login from './pages/loginPage.jsx';
import Register from './pages/RegisterPage.jsx';
import FindItGame from './game_2/findit.jsx';
import ConstellationGame from './game_3/constellation.jsx';
import FollowTheRhythmGame from './game_4/follow_the_rhythm.jsx';
import Game5Entry from './game_5/game_5_entry.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game/find-it" element={<FindItGame />} />
        <Route path="/game/constellation" element={<ConstellationGame />} />
        <Route path="/game/follow-the-rhythm" element={<FollowTheRhythmGame />} />
        <Route path="/game/recall" element={<Game5Entry />} />
      </Routes>
    </div>
  );
}
export default App;
