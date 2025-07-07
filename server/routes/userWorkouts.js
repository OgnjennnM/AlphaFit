const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const UserWorkout = require('../models/UserWorkout');
const WorkoutPlan = require('../models/WorkoutPlan');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { workoutPlanId } = req.body;
    const userId = req.user.id;

    const exists = await UserWorkout.findOne({ where: { userId, workoutPlanId } });
    if (exists) return res.status(400).json({ message: 'Plan je već dodat' });

    const entry = await UserWorkout.create({ userId, workoutPlanId });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dodavanju plana korisniku', error: err.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const plans = await UserWorkout.findAll({
      where: { userId },
      include: [{ model: WorkoutPlan, as: 'WorkoutPlan' }]
    });

    res.json(plans.map(entry => entry.WorkoutPlan)); 
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvatu planova', error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutPlanId = req.params.id;

    const deleted = await UserWorkout.destroy({
      where: { userId, workoutPlanId }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Plan nije pronađen za brisanje' });
    }

    res.json({ message: 'Plan uklonjen' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri uklanjanju plana', error: err.message });
  }
});


module.exports = router;
