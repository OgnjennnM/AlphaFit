import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import heroImg from '../assets/hero.jpg';
import gym1 from '../assets/gym1.jpg';
import gym2 from '../assets/gym2.jpg';
import gym3 from '../assets/gym3.jpg';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [membershipPlans, setMembershipPlans] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    setIsLoggedIn(!!token);

    axios.get('http://localhost:5000/api/memberships')
      .then(res => setMembershipPlans(res.data))
      .catch(err => console.error('Greška pri dohvaćanju članarina:', err));
  }, [token]);

  const handlePlanClick = (plan) => {
    if (!isLoggedIn) {
      alert('Please log in or register to select a plan.');
      navigate('/login');
      return;
    }

    setSelectedPlan(plan);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      await axios.post(
        'http://localhost:5000/api/memberships/subscribe',
        { membershipId: selectedPlan.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Uspješno ste se pretplatili na ${selectedPlan.name} članarinu!`);
      setSelectedPlan(null); 
    } catch (err) {
      console.error(err);
      alert('Greška pri pretplati.');
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>Shape Your Ideal Body</h1>
          <p>We help you build the best version of yourself through personalized workout plans.</p>
          <button className="hero-btn" onClick={() => navigate('/register')}>Join Now</button>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="Fitness Hero" />
        </div>
      </section>

      <section className="section ratings">
        <h2>What our members say</h2>
        <div className="card-grid">
          <div className="card">⭐⭐⭐⭐⭐<p>"Best trainers and programs!"</p></div>
          <div className="card">⭐⭐⭐⭐<p>"I lost 8kg in 6 weeks!"</p></div>
          <div className="card">⭐⭐⭐⭐⭐<p>"Amazing gym atmosphere."</p></div>
        </div>
      </section>

      <section className="gym">
        <h2>Our Gym</h2>
        <div className="gym-gallery">
          <img src={gym1} alt="Gym 1" />
          <img src={gym2} alt="Gym 2" />
          <img src={gym3} alt="Gym 3" />
        </div>
      </section>

      <section className="section plans">
        <h2>Choose Your Plan</h2>

        <div className="card-grid">
          {membershipPlans.map((plan) => (
            <div
              key={plan.id}
              className={`card plan ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
              onClick={() => handlePlanClick(plan)}
            >
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <strong>€{plan.price}/mjesečno</strong>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ fontWeight: 'bold' }}>
              Selected plan: <span style={{ color: '#2563eb' }}>{selectedPlan.name}</span>
            </p>
            <button
              onClick={handleSubscribe}
              style={{
                marginTop: '0.5rem',
                padding: '0.6rem 1.2rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Pretplati se
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
