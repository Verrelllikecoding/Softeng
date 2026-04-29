const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const notify = require('../utils/notify');

// GET semua proposals milik freelancer yang login
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pr.*, p.title as project_title, p.budget, p.status as project_status, p.client_id
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

// GET semua projects milik client beserta proposals
router.get('/client/my-projects', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
        COUNT(pr.id) as proposal_count,
        json_agg(
          json_build_object(
            'id', pr.id,
            'content', pr.content,
            'status', pr.status,
            'created_at', pr.created_at,
            'freelancer_name', u.name,
            'freelancer_rating', u.rating,
            'freelancer_id', pr.freelancer_id
          )
        ) FILTER (WHERE pr.id IS NOT NULL) as proposals
      FROM projects p
      LEFT JOIN proposals pr ON pr.project_id = p.id
      LEFT JOIN users u ON pr.freelancer_id = u.id
      WHERE p.client_id = $1
      GROUP BY p.id
      ORDER BY p.posted_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET semua proposals untuk 1 project
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

// CREATE proposal
router.post('/', authMiddleware, async (req, res) => {
  const { project_id, content } = req.body;
  try {
    const projectCheck = await pool.query(
      'SELECT client_id, title FROM projects WHERE id = $1',
      [project_id]
    );
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Project tidak ditemukan' });
    }
    if (projectCheck.rows[0].client_id === req.user.id) {
      return res.status(403).json({ message: 'Kamu tidak bisa submit proposal ke project milikmu sendiri' });
    }

    const existing = await pool.query(
      'SELECT * FROM proposals WHERE project_id = $1 AND freelancer_id = $2',
      [project_id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Kamu sudah submit proposal untuk project ini' });
    }

    const result = await pool.query(`
      INSERT INTO proposals (project_id, freelancer_id, content)
      VALUES ($1, $2, $3) RETURNING *
    `, [project_id, req.user.id, content]);

    await pool.query(
      'UPDATE projects SET proposals_count = proposals_count + 1 WHERE id = $1',
      [project_id]
    );

    // ── Notifikasi ke client ──
    const { client_id, title } = projectCheck.rows[0];
    const freelancerRes = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
    const freelancerName = freelancerRes.rows[0]?.name || 'A freelancer';

    await notify(
      client_id,
      'new_proposal',
      'New Proposal Received 📋',
      `${freelancerName} submitted a proposal for "${title}"`,
      `/dashboard`
    );

    res.status(201).json({ message: 'Proposal berhasil dikirim', proposal: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE status proposal
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE proposals SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proposal tidak ditemukan' });
    }

    // ── Notifikasi ke freelancer ──
    const proposal = result.rows[0];
    const projRes = await pool.query('SELECT title FROM projects WHERE id = $1', [proposal.project_id]);
    const projectTitle = projRes.rows[0]?.title || 'your project';

    if (status === 'Accepted') {
      await notify(
        proposal.freelancer_id,
        'proposal_accepted',
        'Proposal Accepted! 🎉',
        `Your proposal for "${projectTitle}" has been accepted!`,
        `/delivery/${proposal.id}`
      );
    } else if (status === 'Rejected') {
      await notify(
        proposal.freelancer_id,
        'proposal_rejected',
        'Proposal Rejected',
        `Your proposal for "${projectTitle}" was not selected this time.`,
        `/dashboard`
      );
    }

    res.json({ message: 'Status proposal diupdate', proposal: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE proposal
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
