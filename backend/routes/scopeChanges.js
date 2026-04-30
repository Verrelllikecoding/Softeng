const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const notify = require('../utils/notify');

// ─── GET scope changes untuk freelancer ──────────────────────
router.get('/my/freelancer', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sc.*, 
        p.title as project_title, p.budget as current_budget, p.deadline as current_deadline,
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

// ─── GET scope changes untuk client ──────────────────────────
router.get('/my/client', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sc.*,
        p.title as project_title, p.budget as current_budget, p.deadline as current_deadline,
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

// ─── GET scope changes untuk freelancer (alias /my) ──────────
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sc.*, 
        p.title as project_title, p.budget as current_budget, p.deadline as current_deadline,
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

// ─── CREATE scope change request (client only) ────────────────
router.post('/', authMiddleware, async (req, res) => {
  const { proposal_id, project_id, freelancer_id, description, additional_budget, additional_days } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO scope_changes 
        (proposal_id, project_id, client_id, freelancer_id, description, additional_budget, additional_days, messages)
      VALUES ($1, $2, $3, $4, $5, $6, $7, '[]')
      RETURNING *
    `, [proposal_id, project_id, req.user.id, freelancer_id, description, additional_budget || 0, additional_days || 0]);

    const projRes = await pool.query('SELECT title FROM projects WHERE id = $1', [project_id]);
    const title = projRes.rows[0]?.title || 'your project';
    const clientRes = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    const clientName = clientRes.rows[0]?.name || 'Client';

    await notify(
      freelancer_id,
      'scope_change_request',
      'Scope Change Requested 🔄',
      `${clientName} is requesting additional work on "${title}". Review and negotiate the terms.`,
      `/scope-change/${result.rows[0].id}`
    );

    res.status(201).json({ message: 'Scope change requested', scopeChange: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── SAVE negotiation messages ────────────────────────────────
router.post('/:id/messages', authMiddleware, async (req, res) => {
  const { messages, status, final_budget, final_days } = req.body;
  try {
    // ── Cek status sebelumnya untuk hindari double budget update ──
    const prevResult = await pool.query(
      'SELECT status FROM scope_changes WHERE id = $1',
      [req.params.id]
    );
    const wasAlreadyAccepted = prevResult.rows[0]?.status === 'accepted';

    const result = await pool.query(`
      UPDATE scope_changes 
      SET messages = $1, status = $2, counter_budget = $3, counter_days = $4, updated_at = NOW()
      WHERE id = $5 RETURNING *
    `, [JSON.stringify(messages), status, final_budget, final_days, req.params.id]);

    const sc = result.rows[0];
    const projRes = await pool.query('SELECT title FROM projects WHERE id = $1', [sc.project_id]);
    const title = projRes.rows[0]?.title || 'your project';

    const isClient = req.user.id === sc.client_id;
    const recipientId = isClient ? sc.freelancer_id : sc.client_id;
    const senderRes = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    const senderName = senderRes.rows[0]?.name || (isClient ? 'Client' : 'Freelancer');
    const senderRole = isClient ? 'Client' : 'Freelancer';

    // ── Notifikasi setiap pesan baru ──
    if (status === 'pending') {
      await notify(
        recipientId,
        'scope_change_message',
        `New message in Scope Change 💬`,
        `${senderName} (${senderRole}) sent a message regarding the scope change for "${title}"`,
        `/scope-change/${sc.id}`
      );
    }

    // ── Kalau accepted — hanya update budget SEKALI ──
    if (status === 'accepted' && !wasAlreadyAccepted) {
      const budgetAdd = final_budget || sc.additional_budget;
      const daysAdd = final_days || sc.additional_days;

      await pool.query(`
        UPDATE projects 
        SET budget = CONCAT('$', (CAST(REGEXP_REPLACE(budget, '[^0-9]', '', 'g') AS INT) + $1)::TEXT)
        WHERE id = $2
      `, [budgetAdd, sc.project_id]);

      await pool.query(
        "UPDATE proposals SET status = 'Accepted' WHERE id = $1",
        [sc.proposal_id]
      );

      await notify(
        sc.client_id,
        'scope_change_accepted',
        'Scope Change Accepted ✓',
        `The freelancer accepted your scope change for "${title}". New contract is ready to sign.`,
        `/scope-change/${sc.id}`
      );
      await notify(
        sc.freelancer_id,
        'scope_change_finalized',
        'Scope Change Finalized 🎉',
        `Scope change for "${title}" agreed! Please submit the additional work via Project Delivery.`,
        `/delivery/${sc.proposal_id}`
      );
    }

    // ── Kalau rejected ──
    if (status === 'rejected') {
      await notify(
        sc.client_id,
        'scope_change_rejected',
        'Scope Change Rejected',
        `The freelancer declined your scope change request for "${title}".`,
        `/dashboard`
      );
      await notify(
        sc.freelancer_id,
        'scope_change_rejected_self',
        'You Declined Scope Change',
        `You declined the scope change request for "${title}".`,
        `/dashboard`
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── RESPOND scope change — simple accept/reject ──────────────
router.put('/:id/respond', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    // ── Cek status sebelumnya untuk hindari double budget update ──
    const prevResult = await pool.query(
      'SELECT status FROM scope_changes WHERE id = $1',
      [req.params.id]
    );
    const wasAlreadyAccepted = prevResult.rows[0]?.status === 'accepted';

    const result = await pool.query(`
      UPDATE scope_changes SET status = $1, updated_at = NOW()
      WHERE id = $2 RETURNING *
    `, [status, req.params.id]);

    const sc = result.rows[0];
    const projRes = await pool.query('SELECT title FROM projects WHERE id = $1', [sc.project_id]);
    const title = projRes.rows[0]?.title || 'your project';

    if (status === 'accepted' && !wasAlreadyAccepted) {
      await pool.query(`
        UPDATE projects 
        SET budget = CONCAT('$', (CAST(REGEXP_REPLACE(budget, '[^0-9]', '', 'g') AS INT) + $1)::TEXT)
        WHERE id = $2
      `, [sc.additional_budget, sc.project_id]);

      await pool.query(
        "UPDATE proposals SET status = 'Accepted' WHERE id = $1",
        [sc.proposal_id]
      );

      await notify(
        sc.client_id,
        'scope_change_accepted',
        'Scope Change Accepted ✓',
        `The freelancer accepted your scope change for "${title}".`,
        `/scope-change/${sc.id}`
      );
      await notify(
        sc.freelancer_id,
        'scope_change_finalized',
        'Scope Change Finalized 🎉',
        `Scope change for "${title}" agreed! Please submit the additional work via Project Delivery.`,
        `/delivery/${sc.proposal_id}`
      );
    }

    if (status === 'rejected') {
      await notify(
        sc.client_id,
        'scope_change_rejected',
        'Scope Change Rejected',
        `The freelancer rejected your scope change request for "${title}".`,
        `/dashboard`
      );
    }

    res.json({ message: `Scope change ${status}`, scopeChange: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET scope change by ID — HARUS PALING BAWAH ─────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sc.*,
        p.title as project_title, p.budget as current_budget, p.deadline as current_deadline,
        uc.name as client_name, uf.name as freelancer_name
      FROM scope_changes sc
      LEFT JOIN projects p ON sc.project_id = p.id
      LEFT JOIN users uc ON sc.client_id = uc.id
      LEFT JOIN users uf ON sc.freelancer_id = uf.id
      WHERE sc.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Scope change tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
