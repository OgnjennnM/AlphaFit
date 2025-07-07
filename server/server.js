const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const sequelize = require('./config/database');

const User = require('./models/User');
const Membership = require('./models/Membership');
const UserMembership = require('./models/UserMembership');
const Promotion = require('./models/Promotion');
const WorkoutPlan = require('./models/WorkoutPlan');
const TrainerRating = require('./models/TrainerRating');
const UserWorkout = require('./models/UserWorkout');

User.belongsTo(Membership, { foreignKey: 'membership_id', as: 'activeMembership' });

User.hasMany(UserMembership, { foreignKey: 'userId' });
UserMembership.belongsTo(User, { foreignKey: 'userId' });

Membership.hasMany(UserMembership, { foreignKey: 'membershipId' });
UserMembership.belongsTo(Membership, { foreignKey: 'membershipId' });

sequelize.authenticate()
  .then(() => {
    console.log('✅ Povezan sa bazom');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('📦 Tabele sinhronizovane sa bazom');
  })
  .catch((err) => {
    console.error('❌ Greska u konekciji sa bazom:', err);
  });

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/memberships', require('./routes/memberships'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/user-workouts', require('./routes/userWorkouts'));
app.use('/api/protected', require('./routes/protected'));

app.get('/', (req, res) => {
  res.send('GymHub backend je pokrenut!');
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
