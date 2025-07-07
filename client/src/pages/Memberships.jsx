import { useEffect, useState } from 'react';
import axios from 'axios';
import './Memberships.css';

function Memberships() {
  const [memberships, setMemberships] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [userMemberships, setUserMemberships] = useState([]); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMemberships();
    fetchUserStatus();
    fetchUserHistory();
  }, []);

  const fetchMemberships = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/memberships');
      setMemberships(res.data);
    } catch (err) {
      console.error('Greška pri dohvatanju članarina:', err);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/memberships/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserStatus(res.data.active);
    } catch (err) {
      console.error('Greška pri dohvatu statusa članarine:', err);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/memberships/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserMemberships(res.data); 
    } catch (err) {
      console.error('Greška pri dohvatu istorije članarina:', err);
    }
  };

  const subscribe = async (membershipId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/memberships/subscribe',
        { membershipId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Uspešno ste se pretplatili!');
      fetchUserStatus();
      fetchUserHistory();
    } catch (err) {
      alert(err.response?.data?.message || 'Greška pri pretplati.');
    }
  };

  const cancelMembership = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/memberships/cancel',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Članarina prekinuta.');
      fetchUserStatus();
      fetchUserHistory();
    } catch (err) {
      alert(err.response?.data?.message || 'Greška pri prekidu.');
    }
  };

  return (
    <div className="memberships-container">
      <h2>Članarine</h2>

      <div className="plans-grid">
        {memberships.map((m) => (
          <div key={m.id} className="membership-card">
            <h3>{m.name}</h3>
            <p>{m.description}</p>
            <strong>{m.price}€ / mjesečno</strong>
            {userStatus?.name === m.name && userStatus.status === 'active' ? (
              <p className="active-label">Aktivna</p>
            ) : (
              <button onClick={() => subscribe(m.id)}>Pretplati se</button>
            )}
          </div>
        ))}
      </div>

      {userStatus && (
        <div className="active-membership">
          <h3>Vaša aktivna članarina:</h3>
          <p><strong>{userStatus.name}</strong> - {userStatus.description}</p>
          <p>Važi do: {new Date(userStatus.validUntil).toLocaleDateString()}</p>
          <button className="cancel-btn" onClick={cancelMembership}>Otkaži članarinu</button>
        </div>
      )}

      <div className="history-section">
        <h3>Istorija članarina</h3>
        {userMemberships.length === 0 ? (
          <p>Nemate prethodnih članarina.</p>
        ) : (
          <ul>
            {userMemberships.map((entry, idx) => (
              <li key={idx}>
                {entry.Membership?.name} - {new Date(entry.subscribedAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Memberships;
