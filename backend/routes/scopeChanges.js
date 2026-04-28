const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET scope changes untuk freelancer
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sc.*, 
        p.title as project_title,
        u.name as client_name
      FROM scope_changes sc
      LEFT JOIN projects p ON sc.project_id = p.id
      LEFT JOIN users u ON sc.client_id = u.id
      WHERE sc.freelancer_id = $1
      ORDER BY sc.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET scope changes untuk client
router.get('/client', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sc.*,
        p.title as project_title,
        u.name as freelancer_name
      FROM scope_changes sc
      LEFT JOIN projects p ON sc.project_id = p.id
      LEFT JOIN users u ON sc.freelancer_id = u.id
      WHERE sc.client_id = $1
      ORDER BY sc.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE scope change request (client only)
router.post('/', authMiddleware, async (req, res) => {
  const { proposal_id, project_id, freelancer_id, description, additional_budget, additional_days } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO scope_changes 
        (proposal_id, project_id, client_id, freelancer_id, description, additional_budget, additional_days)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [proposal_id, project_id, req.user.id, freelancer_id, description, additional_budget || 0, additional_days || 0]);
    res.status(201).json({ message: 'Scope change requested', scopeChange: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// RESPOND scope change (freelancer accept/reject)
router.put('/:id/respond', authMiddleware, async (req, res) => {
  const { status } = req.body; // 'accepted' atau 'rejected'
  try {
    const result = await pool.query(`
      UPDATE scope_changes SET status = $1, updated_at = NOW()
      WHERE id = $2 RETURNING *
    `, [status, req.params.id]);

    if (status === 'accepted') {
      // Update budget dan deadline di project
      const sc = result.rows[0];
      await pool.query(`
        UPDATE projects 
        SET 
          budget = CONCAT('$', (CAST(REGEXP_REPLACE(budget, '[^0-9]', '', 'g') AS INT) + $1)::TEXT),
          deadline = (
            SELECT TO_CHAR(
              TO_DATE(deadline, 'Mon DD, YYYY') + INTERVAL '1 day' * $2,
              'Mon DD, YYYY'
            )
          )
        WHERE id = $3
      `, [sc.additional_budget, sc.additional_days, sc.project_id]);
    }

    res.json({ message: `Scope change ${status}`, scopeChange: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;