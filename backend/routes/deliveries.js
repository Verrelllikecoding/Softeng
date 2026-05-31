const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const notify = require('../utils/notify');
const { Resend } = require('resend');

// Initialize Resend with your API Key from the .env file
const resend = new Resend(process.env.RESEND_API_KEY);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

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

// SUBMIT delivery
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  const { proposal_id, project_id, message } = req.body;
  const file_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const projectResult = await pool.query(
      'SELECT client_id, title FROM projects WHERE id = $1',
      [project_id]
    );
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Project tidak ditemukan' });
    }
    const { client_id, title } = projectResult.rows[0];

    const result = await pool.query(`
      INSERT INTO deliveries (proposal_id, project_id, freelancer_id, client_id, file_url, message)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [proposal_id, project_id, req.user.id, client_id, file_url, message]);

    await pool.query(
      "UPDATE proposals SET status = 'Delivered' WHERE id = $1",
      [proposal_id]
    );

    // ── Notifikasi ke client ──
    await notify(
      client_id,
      'delivery_submitted',
      'Work Delivered! 📦',
      `Freelancer has submitted work for "${title}". Please review and confirm payment.`,
      `/delivery/${proposal_id}`
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

    if (result.rows.length > 0) {
      const delivery = result.rows[0];

      await pool.query(
        "UPDATE proposals SET status = 'Completed' WHERE id = $1",
        [delivery.proposal_id]
      );

      // --- EMAIL RECEIPT LOGIC START ---
      
      // 1. Fetch user & project details
      const detailsQuery = `
        SELECT 
          p.title, p.description, p.budget,
          c.email AS client_email, c.name AS client_name,
          f.email AS freelancer_email, f.name AS freelancer_name
        FROM projects p
        JOIN users c ON p.client_id = c.id
        JOIN users f ON f.id = $1
        WHERE p.id = $2;
      `;
      const detailsResult = await pool.query(detailsQuery, [delivery.freelancer_id, delivery.project_id]);
      const project = detailsResult.rows[0];

      // Convert the project budget string into a clean number
      const fallbackBudget = Number((project.budget || "0").replace(/[^0-9.-]+/g, ""));

      // 2. Fetch Negotiation base price (fallback to original budget if no negotiation)
      const negQuery = `SELECT final_bid FROM negotiations WHERE proposal_id = $1`;
      const negResult = await pool.query(negQuery, [delivery.proposal_id]);
      
      const basePrice = (negResult.rows.length > 0 && negResult.rows[0].final_bid !== null) 
        ? Number(negResult.rows[0].final_bid) 
        : fallbackBudget;

      // 3. Fetch accepted Scope Changes
      const scopeQuery = `
        SELECT additional_budget, counter_budget 
        FROM scope_changes 
        WHERE proposal_id = $1 AND status = 'accepted'
      `;
      const scopeResult = await pool.query(scopeQuery, [delivery.proposal_id]);
      
      let scopeChangesTotal = 0;
      scopeResult.rows.forEach(row => {
        const agreedExtra = row.counter_budget !== null ? row.counter_budget : row.additional_budget;
        scopeChangesTotal += Number(agreedExtra);
      });

      // 4. Calculate Math
      const grandTotal = basePrice + scopeChangesTotal;
      const formattedTotal = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0 
      }).format(grandTotal);

      // 5. Construct HTML
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <h2>Project Completed: ${project.title} 🎉</h2>
          <p>The client has officially confirmed the delivery and authorized the payment.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Transaction Receipt</h3>
            <p><strong>Base Negotiated Price:</strong> $${basePrice}</p>
            <p><strong>Approved Scope Changes:</strong> +$${scopeChangesTotal}</p>
            <h3 style="color: #15803d; font-size: 24px; margin: 10px 0;">Total Paid: ${formattedTotal}</h3>
            
            <div style="margin-top: 20px; font-size: 14px; color: #64748b;">
              <p><strong>Client:</strong> ${project.client_name}</p>
              <p><strong>Freelancer:</strong> ${project.freelancer_name}</p>
            </div>
          </div>

          <h4>Project Summary:</h4>
          <p style="color: #475569; line-height: 1.5; background: #f1f5f9; padding: 15px; border-radius: 6px;">
            ${project.description}
          </p>
          
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
            Thank you for using Proposalin!
          </p>
        </div>
      `;

      // 6. Send Email (Wrapped in try/catch so if Resend fails, the app doesn't crash)
      try {
        await resend.emails.send({
          from: 'Proposalin <onboarding@resend.dev>', // MUST be this testing domain for now
          to: [project.client_email, project.freelancer_email],
          subject: `Receipt: Payment Confirmed for ${project.title}`,
          html: emailHtml,
        });
      } catch (emailErr) {
        console.error("Email failed to send, but database was updated:", emailErr);
      }
      
      // --- EMAIL RECEIPT LOGIC END ---

      // ── Notifikasi in-app ke freelancer ──
      const title = project?.title || 'your project';

      await notify(
        delivery.freelancer_id,
        'payment_confirmed',
        'Payment Confirmed! 💰',
        `Payment has been confirmed for "${title}". Project completed!`,
        `/delivery/${delivery.proposal_id}`
      );
      
      return res.json({ message: 'Payment confirmed!', delivery: result.rows[0], grandTotal });
    }

    res.status(404).json({ message: 'Delivery not found' });
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
      SET status = 'rejected', reject_reason = $1
      WHERE id = $2 RETURNING *
    `, [reason || null, req.params.id]);

    if (result.rows.length > 0) {
      const delivery = result.rows[0];

      await pool.query(
        "UPDATE proposals SET status = 'Revision' WHERE id = $1",
        [delivery.proposal_id]
      );

      // ── Notifikasi ke freelancer ──
      const projRes = await pool.query('SELECT title FROM projects WHERE id = $1', [delivery.project_id]);
      const title = projRes.rows[0]?.title || 'your project';

      await notify(
        delivery.freelancer_id,
        'revision_requested',
        'Revision Requested 🔄',
        `Client requested a revision for "${title}". ${reason ? `Reason: "${reason}"` : ''}`,
        `/delivery/${delivery.proposal_id}`
      );
    }

    res.json({ message: 'Revision requested', delivery: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;