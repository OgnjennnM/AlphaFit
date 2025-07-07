import { useEffect, useState } from 'react';
import axios from 'axios';
import './MyWorkouts.css';

function MyWorkouts() {
  const [plans, setPlans] = useState([]);
  const token = localStorage.getItem('token');

  // Dohvati sve treninge korisnika
  const fetchPlans = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user-workouts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans(res.data);
    } catch (err) {
      console.error('Greška pri dohvatanju planova:', err);
    }
  };

  // Ukloni plan
  const removePlan = async (planId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user-workouts/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlans(plans.filter((p) => p.id !== planId));
    } catch (err) {
      alert('Greška pri uklanjanju plana');
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="myworkouts-container">
      <h2 className="myworkouts-title">Moji treninzi</h2>

      {plans.length === 0 ? (
        <p className="no-plans">Nemate nijedan započet plan.</p>
      ) : (
        plans.map((plan) => (
          <div key={plan.id} className="workout-card">
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <p>Nivo: {plan.level}</p>
            <p>Trajanje: {plan.duration_weeks} nedelja</p>
            <button className="remove-btn" onClick={() => removePlan(plan.id)}>
              🗑️ Ukloni plan
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyWorkouts;
