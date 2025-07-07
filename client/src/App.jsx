import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workouts from './pages/Workouts';
import Memberships from './pages/Memberships';
import Promotions from './pages/Promotions';
import Ratings from './pages/Ratings';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import WorkoutDetails from './pages/WorkoutDetails';
import MyWorkouts from './pages/MyWorkouts';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workouts/:id" element={<WorkoutDetails />} />
        <Route path="/my-workouts" element={<MyWorkouts />} />
      </Routes>
    </>
  );
}

export default App;
