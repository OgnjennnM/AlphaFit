import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role');
    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setName(null);
    setRole(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate('/')}>
        <h1>AlphaFit</h1>
      </div>

      <ul className="navbar-center">
        <li onClick={() => navigate('/')}>Početna</li>
        <li onClick={() => navigate('/workouts')}>Treninzi</li>
        <li onClick={() => navigate('/memberships')}>Članarine</li>
        <li onClick={() => navigate('/promotions')}>Promocije</li>
        {role === 'admin' && <li onClick={() => navigate('/admin')}>Admin Panel</li>}
        {role !== 'admin' && name && <li onClick={() => navigate('/my-workouts')}>Moji treninzi</li>}
      </ul>

      <div className="navbar-right" ref={dropdownRef}>
        {name ? (
          <div className={`dropdown-wrapper ${menuOpen ? 'open' : ''}`}>
            <span className="navbar-user" onClick={() => setMenuOpen(!menuOpen)}>
              👋 {name} ⌄
            </span>
            <div className="dropdown-menu">
              <p onClick={() => { setMenuOpen(false); navigate('/profile'); }}>Profil</p>
              <p onClick={handleLogout}>Odjava</p>
            </div>
          </div>
        ) : (
          <>
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="register-btn" onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
