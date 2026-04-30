const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET signatures untuk contract tertentu
router.get('/:type/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contract_signatures WHERE contract_type = $1 AND contract_id = $2',
      [req.params.type, req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SAVE signature
router.post('/', authMiddleware, async (req, res) => {
  const { contract_type, contract_id, role, signature_data } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO contract_signatures (contract_type, contract_id, user_id, role, signature_data)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (contract_type, contract_id, user_id)
      DO UPDATE SET signature_data = $5, signed_at = NOW()
      RETURNING *
    `, [contract_type, contract_id, req.user.id, role, signature_data]);
    res.status(201).json({ signature: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE signature (clear)
router.delete('/:type/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM contract_signatures WHERE contract_type = $1 AND contract_id = $2 AND user_id = $3',
      [req.params.type, req.params.id, req.user.id]
    );
    res.json({ message: 'Signature cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
