import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Lozinke se ne poklapaju!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      alert('Registracija uspješna!');
      navigate('/login');
    } catch (err) {
      alert('Greška pri registraciji');
    }
  };

  return (
    <form className="register-form" onSubmit={handleRegister}>
      <h2>Registracija</h2>

      <input
        type="text"
        placeholder="Ime"
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="password-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Lozinka"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-password"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      <div className="password-input-wrapper">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Potvrdi lozinku"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="toggle-password"
        >
          {showConfirmPassword ? '🙈' : '👁️'}
        </button>
      </div>

      <button type="submit" className="register-btn">Registruj se</button>
    </form>
  );
}

export default Register;
