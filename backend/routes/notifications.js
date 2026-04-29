const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET semua notifikasi user yang login
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 30
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET unread count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE',
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// MARK semua sebagai read
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// MARK satu notifikasi sebagai read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
