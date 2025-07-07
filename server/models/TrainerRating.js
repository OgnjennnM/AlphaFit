const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const TrainerRating = sequelize.define('TrainerRating', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: DataTypes.TEXT
});

TrainerRating.belongsTo(User, { as: 'User', foreignKey: 'user_id' });
TrainerRating.belongsTo(User, { as: 'Trainer', foreignKey: 'trainer_id' });

module.exports = TrainerRating;
