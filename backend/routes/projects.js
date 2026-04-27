const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

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

// GET single project by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name as client_name, u.avatar as client_avatar 
      FROM projects p
      LEFT JOIN users u ON p.client_id = u.id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE project (harus login)
router.post('/', authMiddleware, async (req, res) => {
  const { title, category, sub_category, budget, deadline, description } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO projects (title, category, sub_category, budget, deadline, description, client_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, category, sub_category, budget, deadline, description, req.user.id]);

    res.status(201).json({ message: 'Project berhasil dibuat', project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE project (harus login & harus punya project)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, category, sub_category, budget, deadline, description, status } = req.body;

  try {
    const check = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Project tidak ditemukan' });
    }
    if (check.rows[0].client_id !== req.user.id) {
      return res.status(403).json({ message: 'Tidak punya akses' });
    }

    const result = await pool.query(`
      UPDATE projects 
      SET title=$1, category=$2, sub_category=$3, budget=$4, deadline=$5, description=$6, status=$7
      WHERE id = $8
      RETURNING *
    `, [title, category, sub_category, budget, deadline, description, status, req.params.id]);

    res.json({ message: 'Project berhasil diupdate', project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE project (harus login & harus punya project)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const check = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Project tidak ditemukan' });
    }
    if (check.rows[0].client_id !== req.user.id) {
      return res.status(403).json({ message: 'Tidak punya akses' });
    }

    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Project berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;