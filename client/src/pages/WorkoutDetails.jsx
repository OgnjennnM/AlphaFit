import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function WorkoutDetails() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/workouts/${id}`);
        setWorkout(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Greška pri dohvatanju treninga:', err);
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleStartPlan = async () => {
    try {
      if (!token) {
        alert('Morate biti prijavljeni!');
        return;
      }

      await axios.post(
        'http://localhost:5000/api/user-workouts',
        { workoutPlanId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Plan dodat u tvoje treninge!');
    } catch (err) {
      console.error('Greška pri započinjanju plana:', err);
      alert('Greška pri započinjanju plana.');
    }
  };

  if (loading) return <p>Učitavanje...</p>;
  if (!workout) return <p>Trening nije pronađen.</p>;

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '1rem',
      boxShadow: '0 0 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#2563eb' }}>{workout.title}</h2>
      <p><strong>Opis:</strong> {workout.description}</p>
      <p><strong>Težina:</strong> {workout.level}</p>
      <p><strong>Trajanje:</strong> {workout.duration_weeks} nedelja</p>

      <button
        onClick={handleStartPlan}
        style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '0.5rem 1.5rem',
          border: 'none',
          borderRadius: '0.5rem',
          marginTop: '1rem',
          cursor: 'pointer'
        }}
      >
        Započni plan
      </button>
    </div>
  );
}

export default WorkoutDetails;
