import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });

    const { token, user } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
    localStorage.setItem('name', user.name);

    navigate('/');
    window.location.reload();
  } catch (err) {
    const msg = err.response?.data?.message || 'Greška pri prijavi';
    alert(msg);
  }
};


return (
  <form onSubmit={handleLogin} className="login-container">
    <h2>Prijava</h2>

    <input
      type="text"
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
      required
    />

<div className="password-wrapper">
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


    <button type="submit" className="login-btn">
      Prijavi se
    </button>
  </form>
);

}

export default Login;
