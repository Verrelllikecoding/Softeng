const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const notify = require('../utils/notify');

// GET rating untuk proposal tertentu
router.get('/proposal/:proposal_id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ratings WHERE proposal_id = $1',
      [req.params.proposal_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SUBMIT rating
router.post('/', authMiddleware, async (req, res) => {
  const { proposal_id, rated_id, role, score, review } = req.body;
  try {
    // Cek sudah pernah rating belum
    const existing = await pool.query(
      'SELECT * FROM ratings WHERE proposal_id = $1 AND rater_id = $2',
      [proposal_id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Kamu sudah memberikan rating untuk project ini' });
    }

    const result = await pool.query(`
      INSERT INTO ratings (proposal_id, rater_id, rated_id, role, score, review)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [proposal_id, req.user.id, rated_id, role, score, review]);

    // Update average rating di tabel users
    await pool.query(`
      UPDATE users SET rating = (
        SELECT ROUND(AVG(score)::numeric, 1)
        FROM ratings WHERE rated_id = $1
      ) WHERE id = $1
    `, [rated_id]);

    // Notifikasi ke user yang di-rate
    const raterRes = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    const raterName = raterRes.rows[0]?.name || 'Someone';
    await notify(
      rated_id,
      'new_rating',
      `New Rating Received ⭐`,
      `${raterName} gave you a ${score}-star rating!`,
      `/dashboard`
    );

    res.status(201).json({ message: 'Rating berhasil dikirim', rating: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;