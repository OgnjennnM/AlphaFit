const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// Dodavanje novog treninga (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, level, duration_weeks } = req.body;

    console.log('📥 PRIMLJENI PODACI ZA TRENING:', req.body);

    const allowedLevels = ['beginner', 'intermediate', 'advanced'];
    if (!allowedLevels.includes(level)) {
      return res.status(400).json({ message: 'Level mora biti: beginner, intermediate ili advanced' });
    }

    const workout = await WorkoutPlan.create({
      title,
      description,
      level,
      duration_weeks,
      created_by: req.user?.id || null
    });

    res.status(201).json(workout);
  } catch (err) {
    console.error('❌ Greška pri dodavanju treninga:', err);
    res.status(500).json({ message: 'Greška pri kreiranju plana', error: err.message });
  }
});


// Dohvatanje svih treninga (sa opcionalnim filtrima)
router.get('/', async (req, res) => {
  try {
    const { level, duration, title } = req.query;

    const whereClause = {};

    if (level) whereClause.level = level;

    if (duration) {
      const durationInt = parseInt(duration);
      if (!isNaN(durationInt)) {
        whereClause.duration_weeks = { [Op.lte]: durationInt };
      }
    }

    if (title) {
      whereClause.title = { [Op.like]: `%${title}%` };
    }

    const workouts = await WorkoutPlan.findAll({ where: whereClause });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri filtriranju', error: err.message });
  }
});

// Dohvatanje pojedinačnog trening plana
router.get('/:id', async (req, res) => {
  try {
    const workout = await WorkoutPlan.findByPk(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Plan nije pronađen' });
    }

    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvaćanju plana', error: err.message });
  }
});

// Izmena treninga (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await WorkoutPlan.update(req.body, {
      where: { id: req.params.id }
    });

    res.json({ message: 'Plan izmenjen', updated });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri izmeni', error: err.message });
  }
});

// Brisanje treninga (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await WorkoutPlan.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Trening nije pronađen' });
    }

    res.json({ message: 'Plan uspešno obrisan' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri brisanju', error: err.message });
  }
});

module.exports = router;
