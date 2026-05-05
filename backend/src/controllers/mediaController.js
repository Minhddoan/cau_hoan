const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

/**
 * GET /api/images/:category
 * Lấy danh sách ảnh theo nhóm (category)
 */
const getImagesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 50 } = req.query;

    const { rows } = await pool.query(
      `SELECT * FROM gallery_images 
       WHERE category = $1 AND is_active = TRUE 
       ORDER BY sort_order ASC, created_at DESC 
       LIMIT $2`,
      [category, limit]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error in getImagesByCategory:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách ảnh' });
  }
};

/**
 * POST /api/admin/images/upload-multiple
 * Upload nhiều ảnh cho 1 category
 */
const uploadMultipleImages = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ success: false, message: 'Thiếu category' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có file nào được tải lên' });
    }

    const insertedImages = [];
    const type = category; // Dùng category làm type folder luôn cho đồng nhất

    for (const file of req.files) {
      // relativePath: category/filename.ext
      const relativePath = `${type}/${file.filename}`;
      
      const { rows } = await pool.query(
        `INSERT INTO gallery_images (title, title_accent, subtitle, description, badge, image_url, category, sort_order, is_active, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [file.originalname, '', '', '', '', relativePath, category, 0, true, req.user.id]
      );
      insertedImages.push(rows[0]);
    }

    await logAudit(
      req.user.id, 
      req.user.email, 
      'CREATE', 
      'gallery_images', 
      null, 
      `Multiple upload to ${category}`, 
      null, 
      { count: insertedImages.length, category }, 
      req
    );

    res.status(201).json({ 
      success: true, 
      data: insertedImages, 
      message: `Đã tải lên ${insertedImages.length} ảnh thành công` 
    });
  } catch (err) {
    console.error('Error in uploadMultipleImages:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi tải ảnh lên' });
  }
};

/**
 * DELETE /api/admin/images/:id
 * Xóa ảnh khỏi DB và xóa file vật lý
 */
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Lấy thông tin ảnh từ DB
    const { rows } = await pool.query('SELECT * FROM gallery_images WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy ảnh' });
    }

    const image = rows[0];

    // 2. Xóa file vật lý
    const filePath = path.join(__dirname, '../../uploads', image.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 3. Xóa bản ghi trong DB
    await pool.query('DELETE FROM gallery_images WHERE id = $1', [id]);

    await logAudit(
      req.user.id, 
      req.user.email, 
      'DELETE', 
      'gallery_images', 
      id, 
      image.title || 'Image', 
      image, 
      null, 
      req
    );

    res.json({ success: true, message: 'Đã xóa ảnh thành công' });
  } catch (err) {
    console.error('Error in deleteImage:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa ảnh' });
  }
};

/**
 * PUT /api/admin/images/reorder
 * Cập nhật thứ tự sắp xếp của các ảnh
 */
const reorderImages = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, sort_order }
    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    for (const item of orders) {
      await pool.query(
        'UPDATE gallery_images SET sort_order = $1, updated_at = NOW() WHERE id = $2',
        [item.sort_order, item.id]
      );
    }

    res.json({ success: true, message: 'Cập nhật thứ tự thành công' });
  } catch (err) {
    console.error('Error in reorderImages:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi sắp xếp ảnh' });
  }
};

/**
 * PUT /api/admin/images/:id
 * Cập nhật thông tin ảnh
 */
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, title_accent, subtitle, description, badge, sort_order, is_active } = req.body;

    const { rows } = await pool.query(
      `UPDATE gallery_images SET 
       title = COALESCE($1, title),
       title_accent = COALESCE($2, title_accent),
       subtitle = COALESCE($3, subtitle),
       description = COALESCE($4, description),
       badge = COALESCE($5, badge),
       sort_order = COALESCE($6, sort_order),
       is_active = COALESCE($7, is_active),
       updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [title, title_accent, subtitle, description, badge, sort_order, is_active, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy ảnh' });
    }

    res.json({ success: true, data: rows[0], message: 'Cập nhật ảnh thành công' });
  } catch (err) {
    console.error('Error in updateImage:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật ảnh' });
  }
};

module.exports = {
  getImagesByCategory,
  uploadMultipleImages,
  deleteImage,
  reorderImages,
  updateImage
};
