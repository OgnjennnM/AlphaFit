const express = require('express');
const router = express.Router();
const TrainerRating = require('../models/TrainerRating');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { trainer_id, rating, comment } = req.body;

    const newRating = await TrainerRating.create({
      trainer_id,
      rating,
      comment,
      user_id: req.user.id 
    });

    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri ocenjivanju', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const ratings = await TrainerRating.findAll();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvatanju', error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const rating = await TrainerRating.findByPk(req.params.id);
    if (!rating || rating.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Nemate pravo da menjate ovu ocenu' });
    }

    await rating.update(req.body);
    res.json({ message: 'Ocena ažurirana', rating });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri izmeni', error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const rating = await TrainerRating.findByPk(req.params.id);
    if (!rating || rating.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Nemate pravo da obrišete ovu ocenu' });
    }

    await rating.destroy();
    res.json({ message: 'Ocena obrisana' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri brisanju', error: err.message });
  }
});

module.exports = router;
