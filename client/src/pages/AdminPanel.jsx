import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

function AdminPanel() {
  const token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [tab, setTab] = useState('users');

  // Polja za dodavanje
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    level: '',
    description: '',
    duration_weeks: ''
  });
  const [newMembership, setNewMembership] = useState({ name: '', description: '', price: '', duration_days: '' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const usersRes = await axios.get('http://localhost:5000/api/protected/users', { headers });
      const workoutsRes = await axios.get('http://localhost:5000/api/workouts');
      const membershipsRes = await axios.get('http://localhost:5000/api/memberships');
      const promotionsRes = await axios.get('http://localhost:5000/api/promotions');

      setUsers(usersRes.data);
      setWorkouts(workoutsRes.data);
      setMemberships(membershipsRes.data);
      setPromotions(promotionsRes.data);
    } catch (err) {
      alert('Greška pri učitavanju podataka');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/api/${type}/${id}`, { headers });
      alert('Uspešno obrisano!');
      fetchAll();
    } catch (err) {
      alert('Greška pri brisanju');
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', newUser);
      alert('Korisnik dodat!');
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      fetchAll();
    } catch (err) {
      alert('Greška pri dodavanju korisnika');
    }
  };

const handleAddWorkout = async () => {
  try {
    const headers = { Authorization: `Bearer ${token}` };

    const workoutData = {
      ...newWorkout,
      duration_weeks: parseInt(newWorkout.duration_weeks), 
    };

    if (!workoutData.title || !workoutData.level || !workoutData.description || !workoutData.duration_weeks) {
      alert('Popunite sva polja za trening.');
      return;
    }

    await axios.post('http://localhost:5000/api/workouts', workoutData, { headers });
    alert('Trening dodat!');
    setNewWorkout({ title: '', level: '', description: '', duration_weeks: '' });
    fetchAll();
  } catch (err) {
    console.error(err.response?.data || err);
    alert('Greška pri dodavanju treninga');
  }
};

  const handleAddMembership = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post('http://localhost:5000/api/memberships', newMembership, { headers });
      alert('Članarina dodata!');
      setNewMembership({ name: '', description: '', price: '', duration_days: '' });
      fetchAll();
    } catch (err) {
      alert('Greška pri dodavanju članarine');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      <div className="admin-tabs">
        <button onClick={() => setTab('users')}>Korisnici</button>
        <button onClick={() => setTab('workouts')}>Treninzi</button>
        <button onClick={() => setTab('memberships')}>Članarine</button>
        <button onClick={() => setTab('promotions')}>Promocije</button>
      </div>

      {tab === 'users' && (
        <div>
          <h3>Korisnici</h3>
          {users.map((u) => (
            <div key={u.id} className="admin-item">
              <p>{u.name} – {u.email} – {u.role}</p>
              <button onClick={() => handleDelete('protected/users', u.id)}>Obriši</button>
            </div>
          ))}

          <h4>Dodaj korisnika</h4>
          <input type="text" placeholder="Ime" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
          <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
          <input type="password" placeholder="Lozinka" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
          <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleAddUser}>Dodaj</button>
        </div>
      )}

      {tab === 'workouts' && (
        <div>
          <h3>Treninzi</h3>
          {workouts.map((w) => (
            <div key={w.id} className="admin-item">
              <p>{w.title} – {w.level}</p>
              <button onClick={() => handleDelete('workouts', w.id)}>Obriši</button>
            </div>
          ))}

          <h4>Dodaj trening</h4>
          <input type="text" placeholder="Naslov" value={newWorkout.title} onChange={e => setNewWorkout({ ...newWorkout, title: e.target.value })} />
          <input type="text" placeholder="Nivo" value={newWorkout.level} onChange={e => setNewWorkout({ ...newWorkout, level: e.target.value })} />
          <textarea placeholder="Opis" value={newWorkout.description} onChange={e => setNewWorkout({ ...newWorkout, description: e.target.value })} />
          <input type="number" placeholder="Trajanje (nedelje)" value={newWorkout.duration_weeks} onChange={e => setNewWorkout({ ...newWorkout, duration_weeks: e.target.value })} />
          <button onClick={handleAddWorkout}>Dodaj trening</button>
        </div>
      )}

      {tab === 'memberships' && (
        <div>
          <h3>Članarine</h3>
          {memberships.map((m) => (
            <div key={m.id} className="admin-item">
              <p>{m.name} – {m.price}€ – {m.duration_days} dana</p>
              <button onClick={() => handleDelete('memberships', m.id)}>Obriši</button>
            </div>
          ))}

          <h4>Dodaj članarinu</h4>
          <input type="text" placeholder="Naziv" value={newMembership.name} onChange={e => setNewMembership({ ...newMembership, name: e.target.value })} />
          <textarea placeholder="Opis" value={newMembership.description} onChange={e => setNewMembership({ ...newMembership, description: e.target.value })} />
          <input type="number" placeholder="Cijena (€)" value={newMembership.price} onChange={e => setNewMembership({ ...newMembership, price: e.target.value })} />
          <input type="number" placeholder="Trajanje (dana)" value={newMembership.duration_days} onChange={e => setNewMembership({ ...newMembership, duration_days: e.target.value })} />
          <button onClick={handleAddMembership}>Dodaj članarinu</button>
        </div>
      )}

      {tab === 'promotions' && (
        <div>
          <h3>Promocije</h3>
          {promotions.map((p) => (
            <div key={p.id} className="admin-item">
              <p>{p.text}</p>
              <img src={`http://localhost:5000/uploads/${p.image}`} width="150" alt="promo" />
              <br />
              <button onClick={() => handleDelete('promotions', p.id)}>Obriši</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
