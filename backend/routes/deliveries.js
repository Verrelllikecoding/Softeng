const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

// GET delivery by proposal_id
router.get('/proposal/:proposal_id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM deliveries WHERE proposal_id = $1 ORDER BY created_at DESC',
      [req.params.proposal_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SUBMIT delivery (freelancer upload hasil kerja)
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  const { proposal_id, project_id, message } = req.body; // hapus client_id dari sini
  const file_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Ambil client_id dari project langsung di backend
    const projectResult = await pool.query('SELECT client_id FROM projects WHERE id = $1', [project_id]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Project tidak ditemukan' });
    }
    const client_id = projectResult.rows[0].client_id;

    const result = await pool.query(`
      INSERT INTO deliveries (proposal_id, project_id, freelancer_id, client_id, file_url, message)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [proposal_id, project_id, req.user.id, client_id, file_url, message]);

    await pool.query(
      "UPDATE proposals SET status = 'Delivered' WHERE id = $1",
      [proposal_id]
    );

    res.status(201).json({ message: 'Delivery berhasil disubmit', delivery: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// CLIENT confirm payment
router.put('/:id/confirm-payment', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE deliveries SET payment_status = 'paid', status = 'completed'
      WHERE id = $1 RETURNING *
    `, [req.params.id]);

    // Update status proposal jadi 'Completed'
    if (result.rows.length > 0) {
      await pool.query(
        "UPDATE proposals SET status = 'Completed' WHERE id = $1",
        [result.rows[0].proposal_id]
      );
    }

    res.json({ message: 'Payment confirmed!', delivery: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CLIENT reject delivery (request revision)
router.put('/:id/reject', authMiddleware, async (req, res) => {
  const { reason } = req.body;
  try {
    const result = await pool.query(`
      UPDATE deliveries 
      SET status = 'rejected', payment_status = 'pending'
      WHERE id = $1 RETURNING *
    `, [req.params.id]);

    // Tambah kolom reject_reason kalau belum ada
    await pool.query(`
      UPDATE deliveries SET status = 'rejected' WHERE id = $1
    `, [req.params.id]);

    res.json({ message: 'Delivery rejected', delivery: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/reject', authMiddleware, async (req, res) => {
  const { reason } = req.body;
  try {
    const result = await pool.query(`
      UPDATE deliveries 
      SET status = 'rejected', reject_reason = $1
      WHERE id = $2 RETURNING *
    `, [reason || null, req.params.id]);

    await pool.query(
      "UPDATE proposals SET status = 'Revision' WHERE id = (SELECT proposal_id FROM deliveries WHERE id = $1)",
      [req.params.id]
    );

    res.json({ message: 'Revision requested', delivery: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;