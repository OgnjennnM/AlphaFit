const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Registracija
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email već postoji' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({ message: 'Korisnik registrovan', user });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri registraciji', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Specijalni admin login
    if (email === 'admin' && password === 'admin') {
      const token = jwt.sign({ id: 0, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });

      return res.json({
        token,
        user: {
          id: 0,
          name: 'Admin',
          email: 'admin',
          role: 'admin'
        }
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Neispravan email ili lozinka' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Neispravan email ili lozinka' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri loginu', error: err.message });
  }
});

// ➕ Dohvati informacije o profilu korisnika
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: 'Korisnik nije pronađen' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvaćanju profila', error: err.message });
  }
});

// ➕ Ažuriraj korisničke podatke
router.put('/update', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    await User.update({ name, email }, { where: { id: req.user.id } });

    res.json({ message: 'Profil ažuriran' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri ažuriranju profila', error: err.message });
  }
});

// ➕ Promjena lozinke
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Stara lozinka nije tačna' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: user.id } });

    res.json({ message: 'Lozinka uspješno promijenjena' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri promjeni lozinke', error: err.message });
  }
});

module.exports = router;
