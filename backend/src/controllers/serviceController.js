const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// GET /api/services (public)
const getServices = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM services WHERE is_active = TRUE ORDER BY sort_order, created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/admin/services (editor+)
const getServicesAdmin = async (req, res) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT s.*, u.full_name as created_by_name
      FROM services s LEFT JOIN users u ON s.created_by = u.id
    `;
    const params = [];
    if (search) {
      query += ` WHERE s.name ILIKE $1 OR s.slug ILIKE $1`;
      params.push(`%${search}%`);
    }
    query += ` ORDER BY s.sort_order, s.created_at DESC`;
    const { rows } = await pool.query(query, params);
    
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/admin/services (editor+)
const createService = async (req, res) => {
  try {
    const { 
      slug, name, description, icon_name, price_from, price_to, 
      is_active, is_featured, sort_order, features, deliverables, duration, image_url 
    } = req.body;
    
    if (!name || !slug) return res.status(400).json({ success: false, message: 'Thiếu tên hoặc slug' });

    const { rows } = await pool.query(
      `INSERT INTO services (
        slug, name, description, icon_name, price_from, price_to, 
        is_active, is_featured, sort_order, created_by, features, deliverables, duration, image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        slug, name, description, icon_name, price_from, price_to, 
        is_active ?? true, is_featured ?? false, sort_order || 0, req.user.id,
        features || [], deliverables || [], duration || null, image_url || null
      ]
    );

    await logAudit(req.user.id, req.user.email, 'CREATE', 'service', rows[0].id, rows[0].name, null, rows[0], req);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/admin/services/:id (editor+)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      slug, name, description, icon_name, price_from, price_to, 
      is_active, is_featured, sort_order, features, deliverables, duration, image_url 
    } = req.body;

    const { rows: old } = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    const { rows } = await pool.query(
      `UPDATE services 
       SET slug=COALESCE($1,slug), name=COALESCE($2,name), description=COALESCE($3,description),
           icon_name=COALESCE($4,icon_name), price_from=COALESCE($5,price_from), price_to=COALESCE($6,price_to),
           is_active=COALESCE($7,is_active), is_featured=COALESCE($8,is_featured), sort_order=COALESCE($9,sort_order),
           features=COALESCE($10,features), deliverables=COALESCE($11,deliverables), duration=COALESCE($12,duration),
           image_url=COALESCE($13,image_url), updated_at=NOW()
       WHERE id=$14 RETURNING *`,
      [
        slug, name, description, icon_name, price_from, price_to, 
        is_active, is_featured, sort_order, 
        features, deliverables, duration, image_url, id
      ]
    );

    await logAudit(req.user.id, req.user.email, 'UPDATE', 'service', id, rows[0].name, old[0], rows[0], req);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// DELETE /api/admin/services/:id (admin+)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows: old } = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    await pool.query('DELETE FROM services WHERE id = $1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'service', id, old[0].name, old[0], null, req);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getServices, getServicesAdmin, createService, updateService, deleteService };
