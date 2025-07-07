const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  membership_status: {
    type: DataTypes.ENUM('active', 'expired'),
    defaultValue: 'expired',
  },
  membership_valid_until: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  membership_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Memberships',
      key: 'id',
    },
  }
});

module.exports = User;
