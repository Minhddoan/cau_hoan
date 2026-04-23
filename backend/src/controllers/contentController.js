const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// ─── FAQs ────────────────────────────────────────────────────────────────────
const getFaqs = async (req, res) => {
  try {
    const { category } = req.query;
    let query = `SELECT f.*, fc.name as category_name, fc.slug as category_slug, fc.icon_name, fc.color
                 FROM faqs f LEFT JOIN faq_categories fc ON f.category_id = fc.id
                 WHERE f.is_active = TRUE`;
    const params = [];
    if (category) { query += ` AND fc.slug = $1`; params.push(category); }
    query += ' ORDER BY f.sort_order, f.created_at';
    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getFaqsAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.*, fc.name as category_name FROM faqs f
       LEFT JOIN faq_categories fc ON f.category_id = fc.id ORDER BY fc.sort_order, f.sort_order`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const createFaq = async (req, res) => {
  try {
    const { category_id, question, answer, sort_order, is_active } = req.body;
    if (!question || !answer) return res.status(400).json({ success: false, message: 'Thiếu câu hỏi và trả lời' });
    const { rows } = await pool.query(
      `INSERT INTO faqs (category_id, question, answer, sort_order, is_active, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW()) RETURNING *`,
      [category_id, question, answer, sort_order || 0, is_active !== false, req.user.id]
    );
    await logAudit(req.user.id, req.user.email, 'CREATE', 'faq', rows[0].id, rows[0].question.substring(0, 50), null, rows[0], req);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, question, answer, sort_order, is_active } = req.body;
    const { rows: old } = await pool.query('SELECT * FROM faqs WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy FAQ' });

    const { rows } = await pool.query(
      `UPDATE faqs SET category_id=$1, question=$2, answer=$3, sort_order=$4, is_active=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [category_id, question, answer, sort_order, is_active, id]
    );
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'faq', id, rows[0].question.substring(0, 50), old[0], rows[0], req);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM faqs WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy FAQ' });
    await pool.query('DELETE FROM faqs WHERE id = $1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'faq', id, rows[0].question.substring(0, 50), rows[0], null, req);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getFaqCategories = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM faq_categories ORDER BY sort_order, name');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
const getTestimonials = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY sort_order, created_at'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { customer_name, customer_role, content, rating, avatar_url, is_active, sort_order } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO testimonials (customer_name, customer_role, content, rating, avatar_url, is_active, sort_order, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW()) RETURNING *`,
      [customer_name, customer_role, content, rating || 5, avatar_url, is_active !== false, sort_order || 0, req.user.id]
    );
    await logAudit(req.user.id, req.user.email, 'CREATE', 'testimonial', rows[0].id, rows[0].customer_name, null, rows[0], req);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, customer_role, content, rating, avatar_url, is_active, sort_order } = req.body;
    const { rows: old } = await pool.query('SELECT * FROM testimonials WHERE id=$1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    const { rows } = await pool.query(
      `UPDATE testimonials SET customer_name=$1, customer_role=$2, content=$3, rating=$4, avatar_url=$5, is_active=$6, sort_order=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [customer_name, customer_role, content, rating, avatar_url, is_active, sort_order, id]
    );
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'testimonial', id, rows[0].customer_name, old[0], rows[0], req);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM testimonials WHERE id=$1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    await pool.query('DELETE FROM testimonials WHERE id=$1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'testimonial', id, rows[0].customer_name, rows[0], null, req);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getFaqs, getFaqsAdmin, createFaq, updateFaq, deleteFaq, getFaqCategories,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial
};
