const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const User = require('../models/User');
const UserMembership = require('../models/UserMembership');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const membership = await Membership.create(req.body);
    res.status(201).json(membership);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dodavanju', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const memberships = await Membership.findAll();
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvatanju', error: err.message });
  }
});

router.post('/subscribe', verifyToken, async (req, res) => {
  const { membershipId } = req.body;

  try {
    const membership = await Membership.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({ message: 'Članarina nije pronađena' });
    }

    const user = await User.findByPk(req.user.id);

    if (user.membership_status === 'active' && user.membership_id === membershipId) {
      return res.status(400).json({ message: 'Već ste pretplaćeni na ovu članarinu' });
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + membership.duration_days);

    user.membership_id = membershipId;
    user.membership_status = 'active';
    user.membership_valid_until = validUntil;
    await user.save();

    await UserMembership.create({
      userId: req.user.id,
      membershipId: membershipId,
      subscribedAt: new Date(),
      validUntil
    });

    res.json({ message: 'Uspješno pretplaćeni' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri pretplati', error: err.message });
  }
});

router.get('/my', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Membership,
        as: 'activeMembership'
      }
    });

    if (!user || !user.activeMembership) {
      return res.json({ active: null });
    }

    res.json({
      active: {
        name: user.activeMembership.name,
        description: user.activeMembership.description,
        validUntil: user.membership_valid_until,
        status: user.membership_status
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvatu članarine', error: err.message });
  }
});

router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await UserMembership.findAll({
      where: { userId: req.user.id },
      include: [Membership],
      order: [['subscribedAt', 'DESC']]
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvatu istorije', error: err.message });
  }
});

router.post('/cancel', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user.membership_status !== 'active') {
      return res.status(400).json({ message: 'Nemate aktivnu članarinu' });
    }

    user.membership_status = 'expired';
    user.membership_valid_until = null;
    user.membership_id = null;
    await user.save();

    res.json({ message: 'Članarina uspešno prekinuta' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri prekidu članarine', error: err.message });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Membership.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Izmenjeno', updated });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri izmeni', error: err.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Membership.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Obrisano' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri brisanju', error: err.message });
  }
});

module.exports = router;
