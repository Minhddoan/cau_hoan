const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

// GET /api/products  (public)
const getProducts = async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const conditions = ['p.is_active = TRUE'];
    const params = [];
    let idx = 1;

    if (category) { conditions.push(`pc.slug = $${idx++}`); params.push(category); }
    if (featured === 'true') { conditions.push(`p.is_featured = TRUE`); }
    if (search) {
      conditions.push(`(p.name ILIKE $${idx} OR p.description ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }
    const { min_price, max_price } = req.query;
    if (min_price) { conditions.push(`p.price >= $${idx++}`); params.push(min_price); }
    if (max_price) { conditions.push(`p.price <= $${idx++}`); params.push(max_price); }

    const { sort } = req.query;
    let orderBy = 'ORDER BY p.sort_order, p.created_at DESC';
    if (sort === 'price_asc') orderBy = 'ORDER BY p.price ASC';
    else if (sort === 'price_desc') orderBy = 'ORDER BY p.price DESC';
    else if (sort === 'rating') orderBy = 'ORDER BY p.rating DESC, p.review_count DESC';
    else if (sort === 'reviews') orderBy = 'ORDER BY p.review_count DESC, p.rating DESC';

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(
      `SELECT p.*, pc.name as category_name, pc.slug as category_slug
       FROM products p LEFT JOIN product_categories pc ON p.category_id = pc.id
       ${where} ${orderBy}
       LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM products p LEFT JOIN product_categories pc ON p.category_id = pc.id ${where}`,
      params
    );

    res.json({ success: true, data: rows, total: parseInt(countRows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/products/:slug (public)
const getProductBySlug = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, pc.name as category_name, pc.slug as category_slug
       FROM products p LEFT JOIN product_categories pc ON p.category_id = pc.id
       WHERE p.slug = $1 AND p.is_active = TRUE`,
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/admin/products (all, including inactive)
const getProductsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category_id } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (search) {
      conditions.push(`(p.name ILIKE $${idx} OR p.slug ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }
    if (category_id) { conditions.push(`p.category_id = $${idx++}`); params.push(category_id); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(
      `SELECT p.*, pc.name as category_name, u.full_name as created_by_name
       FROM products p
       LEFT JOIN product_categories pc ON p.category_id = pc.id
       LEFT JOIN users u ON p.created_by = u.id
       ${where} ORDER BY p.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );
    const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM products p ${where}`, params);

    res.json({ success: true, data: rows, total: parseInt(countRows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const { category_id, slug, name, description, price, original_price, image_url, badge, badge_color, is_active, is_featured, sort_order } = req.body;
    if (!name || !slug || !price) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc: name, slug, price' });
    }
    const { rows } = await pool.query(
      `INSERT INTO products (category_id, slug, name, description, price, original_price, image_url, badge, badge_color, is_active, is_featured, sort_order, created_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW()) RETURNING *`,
      [category_id, slug, name, description, price, original_price, image_url, badge, badge_color,
       is_active !== false, is_featured || false, sort_order || 0, req.user.id]
    );
    await logAudit(req.user.id, req.user.email, 'CREATE', 'product', rows[0].id, rows[0].name, null, rows[0], req);
    res.status(201).json({ success: true, data: rows[0], message: 'Tạo sản phẩm thành công' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, slug, name, description, price, original_price, image_url, badge, badge_color, is_active, is_featured, sort_order } = req.body;

    const { rows: old } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });

    const { rows } = await pool.query(
      `UPDATE products SET 
       category_id=COALESCE($1,category_id), slug=COALESCE($2,slug), name=COALESCE($3,name), 
       description=COALESCE($4,description), price=COALESCE($5,price), original_price=COALESCE($6,original_price),
       image_url=COALESCE($7,image_url), badge=COALESCE($8,badge), badge_color=COALESCE($9,badge_color), 
       is_active=COALESCE($10,is_active), is_featured=COALESCE($11,is_featured), sort_order=COALESCE($12,sort_order), 
       updated_at=NOW()
       WHERE id=$13 RETURNING *`,
      [category_id, slug, name, description, price, original_price, image_url, badge, badge_color,
       is_active, is_featured, sort_order, id]
    );
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'product', id, rows[0].name, old[0], rows[0], req);
    res.json({ success: true, data: rows[0], message: 'Cập nhật thành công' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows: old } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'product', id, old[0].name, old[0], null, req);
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/product-categories
const getProductCategories = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM product_categories ORDER BY sort_order, name');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getProducts, getProductBySlug, getProductsAdmin, createProduct, updateProduct, deleteProduct, getProductCategories };
