const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserMembership = sequelize.define('UserMembership', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  membershipId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subscribedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = UserMembership;
