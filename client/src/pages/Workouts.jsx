import './Workouts.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const navigate = useNavigate();

  const fetchWorkouts = async () => {
    try {
      const params = {};
      if (title) params.title = title;
      if (level) params.level = level;
      if (duration) params.duration = duration;

      const res = await axios.get('http://localhost:5000/api/workouts', { params });
      setWorkouts(res.data);
    } catch (err) {
      console.error('Greška pri dohvaćanju treninga:', err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkouts();
  };

  return (
    <div className="workout-page">
      <h2>Treninzi</h2>

      <form className="filter-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Naziv"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Svi nivoi</option>
          <option value="beginner">Početni</option>
          <option value="intermediate">Srednji</option>
          <option value="advanced">Napredni</option>
        </select>
        <input
          type="number"
          placeholder="Max trajanje (npr. 6)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button type="submit">Pretraži</button>
      </form>

      <div className="workout-list">
        {workouts.map((w) => (
          <div
            key={w.id}
            className="workout-card"
            onClick={() => navigate(`/workouts/${w.id}`)}
          >
            <h3>{w.title}</h3>
            <p>Težina: {w.level}</p>
            <p>Trajanje: {w.duration_weeks} nedelja</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts;
