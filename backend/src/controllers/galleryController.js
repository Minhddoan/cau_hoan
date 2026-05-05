const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// GET /api/gallery (public)
const getGallery = async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    const conditions = ['is_active = TRUE'];
    const params = [];
    if (category) {
      conditions.push(`category = $1`);
      params.push(category);
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    params.push(limit);
    
    const { rows } = await pool.query(
      `SELECT * FROM gallery_images ${where} ORDER BY sort_order, created_at DESC LIMIT $${params.length}`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/admin/gallery (editor+)
const getGalleryAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT g.*, u.full_name as created_by_name 
      FROM gallery_images g LEFT JOIN users u ON g.created_by = u.id 
      ORDER BY g.sort_order, g.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/admin/gallery (editor+)
const createGalleryItem = async (req, res) => {
  try {
    const { title, description, image_url, category, sort_order, is_active } = req.body;
    if (!image_url) return res.status(400).json({ success: false, message: 'Thiếu hình ảnh' });

    const { rows } = await pool.query(
      `INSERT INTO gallery_images (title, description, image_url, category, sort_order, is_active, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, image_url, category, sort_order || 0, is_active ?? true, req.user.id]
    );

    await logAudit(req.user.id, req.user.email, 'CREATE', 'gallery_images', rows[0].id, rows[0].title || 'Image', null, rows[0], req);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/admin/gallery/:id (editor+)
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, category, sort_order, is_active } = req.body;

    const { rows: old } = await pool.query('SELECT * FROM gallery_images WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    const { rows } = await pool.query(
      `UPDATE gallery_images 
       SET title=COALESCE($1,title), description=COALESCE($2,description), image_url=COALESCE($3,image_url),
           category=COALESCE($4,category), sort_order=COALESCE($5,sort_order), is_active=COALESCE($6,is_active),
           updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [title, description, image_url, category, sort_order, is_active, id]
    );

    await logAudit(req.user.id, req.user.email, 'UPDATE', 'gallery_images', id, rows[0].title || 'Image', old[0], rows[0], req);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// DELETE /api/admin/gallery/:id (admin+)
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows: old } = await pool.query('SELECT * FROM gallery_images WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    await pool.query('DELETE FROM gallery_images WHERE id = $1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'gallery_images', id, old[0].title || 'Image', old[0], null, req);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getGallery, getGalleryAdmin, createGalleryItem, updateGalleryItem, deleteGalleryItem };
