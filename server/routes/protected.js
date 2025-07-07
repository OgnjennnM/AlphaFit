const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/user-area', verifyToken, (req, res) => {
  res.json({ message: `Zdravo, ${req.user.role} korisniče!` });
});

router.get('/admin-area', verifyToken, isAdmin, (req, res) => {
  res.json({ message: 'Dobrodošli u admin panel' });
});

router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvatanju korisnika', error: err.message });
  }
});

router.post('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = require('bcryptjs').hashSync(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dodavanju korisnika', error: err.message });
  }
});


router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Korisnik obrisan' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri brisanju korisnika', error: err.message });
  }
});

module.exports = router;
