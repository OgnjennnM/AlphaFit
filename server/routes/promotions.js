const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Promotion = require('../models/Promotion');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

router.post('/', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!text || !image) {
      return res.status(400).json({ message: 'Nedostaje tekst ili slika' });
    }

    const promotion = await Promotion.create({
      text,
      image
    });

    res.status(201).json(promotion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri dodavanju promocije', error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: 'Greška pri dohvatanju', error: err.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await Promotion.destroy({ where: { id } });
    res.json({ message: 'Promocija obrisana' });
  } catch (err) {
    res.status(500).json({ message: 'Greška pri brisanju', error: err.message });
  }
});

module.exports = router;
