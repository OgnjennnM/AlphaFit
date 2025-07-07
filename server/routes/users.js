const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const UserWorkout = require('../models/UserWorkout');
const WorkoutPlan = require('../models/WorkoutPlan');


router.get('/me/workouts', verifyToken, async (req, res) => {
  try {
    const userWorkouts = await UserWorkout.findAll({
      where: { userId: req.user.id },
      include: [WorkoutPlan]
    });

    const workouts = userWorkouts.map(entry => entry.WorkoutPlan);
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvaćanju treninga', error: err.message });
  }
});

module.exports = router;
