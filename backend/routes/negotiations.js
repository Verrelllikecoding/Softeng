const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const notify = require('../utils/notify');

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
    const existing = await pool.query(
      'SELECT * FROM negotiations WHERE proposal_id = $1',
      [req.params.proposal_id]
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(`
        UPDATE negotiations 
        SET messages=$1, status=$2, final_bid=$3, final_timeline=$4, updated_at=NOW()
        WHERE proposal_id=$5 RETURNING *
      `, [JSON.stringify(messages), status, final_bid, final_timeline, req.params.proposal_id]);
    } else {
      result = await pool.query(`
        INSERT INTO negotiations (proposal_id, messages, status, final_bid, final_timeline)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `, [req.params.proposal_id, JSON.stringify(messages), status, final_bid, final_timeline]);
    }

    // ── Update proposal status & kirim notif kalau finalized ──
    if (status === 'finalized') {
      await pool.query(
        "UPDATE proposals SET status = 'Accepted' WHERE id = $1",
        [req.params.proposal_id]
      );

      // Ambil data untuk notifikasi
      const propData = await pool.query(`
        SELECT pr.freelancer_id, p.client_id, p.title
        FROM proposals pr
        LEFT JOIN projects p ON pr.project_id = p.id
        WHERE pr.id = $1
      `, [req.params.proposal_id]);

      if (propData.rows.length > 0) {
        const { freelancer_id, client_id, title } = propData.rows[0];
        await notify(
          freelancer_id,
          'deal_finalized',
          'Deal Finalized! 🎉',
          `Negotiation for "${title}" is complete. Project is now active!`,
          `/delivery/${req.params.proposal_id}`
        );
        await notify(
          client_id,
          'deal_finalized',
          'Deal Finalized! ✓',
          `You have finalized the deal for "${title}". Project is now active!`,
          `/delivery/${req.params.proposal_id}`
        );
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
