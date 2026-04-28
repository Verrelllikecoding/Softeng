const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Setup multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// GET semua projects
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as client_name, u.avatar as client_avatar 
      FROM projects p
      LEFT JOIN users u ON p.client_id = u.id
      ORDER BY p.posted_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as client_name, u.avatar as client_avatar, u.rating as client_rating
      FROM projects p
      LEFT JOIN users u ON p.client_id = u.id
      WHERE p.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Project tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE project dengan image upload
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, category, sub_category, budget, deadline, description, skills } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  // Parse skills dari string ke array
  const skillsArray = skills
    ? skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  try {
    const result = await pool.query(`
      INSERT INTO projects (title, category, sub_category, budget, deadline, description, skills, image_url, client_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [title, category, sub_category, budget, deadline, description, skillsArray, image_url, req.user.id]);

    res.status(201).json({ message: 'Project berhasil dibuat', project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE project
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, category, sub_category, budget, deadline, description, status, skills } = req.body;

  try {
    const check = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Project tidak ditemukan' });
    if (check.rows[0].client_id !== req.user.id) return res.status(403).json({ message: 'Tidak punya akses' });

    const image_url = req.file ? `/uploads/${req.file.filename}` : check.rows[0].image_url;
    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : check.rows[0].skills;

    const result = await pool.query(`
      UPDATE projects 
      SET title=$1, category=$2, sub_category=$3, budget=$4, deadline=$5, description=$6, status=$7, skills=$8, image_url=$9
      WHERE id = $10 RETURNING *
    `, [title, category, sub_category, budget, deadline, description, status, skillsArray, image_url, req.params.id]);

    res.json({ message: 'Project berhasil diupdate', project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const check = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Project tidak ditemukan' });
    if (check.rows[0].client_id !== req.user.id) return res.status(403).json({ message: 'Tidak punya akses' });

    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Project berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;