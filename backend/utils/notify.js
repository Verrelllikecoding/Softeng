const pool = require('../db');

/**
 * Kirim notifikasi ke user
 * @param {number} userId - ID user penerima
 * @param {string} type - Tipe notifikasi
 * @param {string} title - Judul notifikasi
 * @param {string} message - Pesan notifikasi
 * @param {string|null} link - Link yang dibuka saat notif diklik
 */
const notify = async (userId, type, title, message, link = null) => {
  try {
    await pool.query(`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, type, title, message, link]);
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

module.exports = notify;
