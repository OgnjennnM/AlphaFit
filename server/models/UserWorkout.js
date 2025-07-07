const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const WorkoutPlan = require('./WorkoutPlan'); 

const UserWorkout = sequelize.define('UserWorkout', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  workoutPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

UserWorkout.belongsTo(WorkoutPlan, {
  foreignKey: 'workoutPlanId',
  as: 'WorkoutPlan'
});

module.exports = UserWorkout;
