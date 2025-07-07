const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // 

const WorkoutPlan = sequelize.define('WorkoutPlan', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  duration_weeks: DataTypes.INTEGER
});

WorkoutPlan.belongsTo(User, { foreignKey: 'created_by' });

module.exports = WorkoutPlan;
