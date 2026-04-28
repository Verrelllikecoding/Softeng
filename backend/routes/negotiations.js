const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET negotiation by proposal_id
router.get('/proposal/:proposal_id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM negotiations WHERE proposal_id = $1',
      [req.params.proposal_id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE atau UPDATE negotiation (upsert)
router.post('/proposal/:proposal_id', authMiddleware, async (req, res) => {
  const { messages, status, final_bid, final_timeline } = req.body;

  try {
    // Cek sudah ada atau belum
    const existing = await pool.query(
      'SELECT * FROM negotiations WHERE proposal_id = $1',
      [req.params.proposal_id]
    );

    let result;
    if (existing.rows.length > 0) {
  // Update
  result = await pool.query(`
    UPDATE negotiations 
    SET messages=$1, status=$2, final_bid=$3, final_timeline=$4, updated_at=NOW()
    WHERE proposal_id=$5 RETURNING *
  `, [JSON.stringify(messages), status, final_bid, final_timeline, req.params.proposal_id]);
} else {
  // Insert baru
  result = await pool.query(`
    INSERT INTO negotiations (proposal_id, messages, status, final_bid, final_timeline)
    VALUES ($1, $2, $3, $4, $5) RETURNING *
  `, [req.params.proposal_id, JSON.stringify(messages), status, final_bid, final_timeline]);
}

// ← TAMBAH INI: Update status proposal jika negosiasi finalized
if (status === "finalized") {
  await pool.query(
    "UPDATE proposals SET status = 'Accepted' WHERE id = $1",
    [req.params.proposal_id]
  );
}

res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;