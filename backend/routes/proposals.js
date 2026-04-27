const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET semua proposals milik freelancer yang login
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pr.*, p.title as project_title, p.budget, p.status as project_status
      FROM proposals pr
      LEFT JOIN projects p ON pr.project_id = p.id
      WHERE pr.freelancer_id = $1
      ORDER BY pr.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET semua proposals untuk 1 project (hanya client pemilik project)
router.get('/project/:project_id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pr.*, u.name as freelancer_name, u.avatar, u.rating
      FROM proposals pr
      LEFT JOIN users u ON pr.freelancer_id = u.id
      WHERE pr.project_id = $1
      ORDER BY pr.created_at DESC
    `, [req.params.project_id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE proposal (harus login sebagai freelancer)
router.post('/', authMiddleware, async (req, res) => {
  const { project_id, content } = req.body;

  try {
    // Cek sudah pernah submit proposal ke project ini belum
    const existing = await pool.query(
      'SELECT * FROM proposals WHERE project_id = $1 AND freelancer_id = $2',
      [project_id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Kamu sudah submit proposal untuk project ini' });
    }

    const result = await pool.query(`
      INSERT INTO proposals (project_id, freelancer_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [project_id, req.user.id, content]);

    // Update proposals_count di table projects
    await pool.query(
      'UPDATE projects SET proposals_count = proposals_count + 1 WHERE id = $1',
      [project_id]
    );

    res.status(201).json({ message: 'Proposal berhasil dikirim', proposal: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE status proposal (hanya client pemilik project)
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body; // 'Accepted' atau 'Rejected'

  try {
    const result = await pool.query(
      'UPDATE proposals SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proposal tidak ditemukan' });
    }

    res.json({ message: 'Status proposal diupdate', proposal: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE proposal (hanya freelancer pemilik proposal)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const check = await pool.query('SELECT * FROM proposals WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Proposal tidak ditemukan' });
    }
    if (check.rows[0].freelancer_id !== req.user.id) {
      return res.status(403).json({ message: 'Tidak punya akses' });
    }

    await pool.query('DELETE FROM proposals WHERE id = $1', [req.params.id]);

    // Kurangi proposals_count di table projects
    await pool.query(
      'UPDATE projects SET proposals_count = proposals_count - 1 WHERE id = $1',
      [check.rows[0].project_id]
    );

    res.json({ message: 'Proposal berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;