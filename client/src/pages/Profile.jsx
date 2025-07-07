import { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setEditData({ name: res.data.name, email: res.data.email });
    } catch {
      alert('Greška pri učitavanju profila');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:5000/api/auth/update', editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Podaci ažurirani!');
      fetchProfile();
    } catch {
      alert('Greška pri ažuriranju podataka');
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put('http://localhost:5000/api/auth/change-password', passwords, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Lozinka promijenjena!');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch {
      alert('Greška pri promjeni lozinke');
    }
  };

  if (!user) return <p>Učitavanje...</p>;

  return (
    <div className="profile-container">
      <h2>Moj profil</h2>

      <div className="profile-section">
        <label>Ime:</label>
        <input
          value={editData.name}
          onChange={e => setEditData({ ...editData, name: e.target.value })}
        />
        <label>Email:</label>
        <input
          value={editData.email}
          onChange={e => setEditData({ ...editData, email: e.target.value })}
        />
        <button onClick={handleUpdate} className="blue-button">Ažuriraj</button>
      </div>

      <div className="profile-section">
        <label>Stara lozinka:</label>
        <div className="password-input-wrapper">
          <input
            type={showOldPassword ? 'text' : 'password'}
            value={passwords.oldPassword}
            onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
            placeholder="Stara lozinka"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <label>Nova lozinka:</label>
        <div className="password-input-wrapper">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={passwords.newPassword}
            onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
            placeholder="Nova lozinka"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button onClick={handleChangePassword} className="blue-button">Promijeni lozinku</button>
      </div>

      <div className="profile-info">
        <p><strong>Uloga:</strong> {user.role}</p>
        <p><strong>Status članarine:</strong> {user.membership_status}</p>
        <p><strong>Važi do:</strong> {user.membership_valid_until ? new Date(user.membership_valid_until).toLocaleDateString() : 'N/A'}</p>
      </div>
    </div>
  );
}

export default Profile;
