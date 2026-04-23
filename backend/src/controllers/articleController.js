const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// GET /api/articles (public)
const getArticles = async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    const conditions = ['a.is_published = TRUE'];
    const params = [];
    let idx = 1;

    if (category) { conditions.push(`ac.slug = $${idx++}`); params.push(category); }
    if (featured === 'true') { conditions.push('a.is_featured = TRUE'); }
    if (search) {
      conditions.push(`(a.title ILIKE $${idx} OR a.excerpt ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }

    const where = 'WHERE ' + conditions.join(' AND ');
    const { rows } = await pool.query(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.image_url, a.read_time, a.view_count,
              a.is_featured, a.tags, a.published_at,
              ac.name as category_name, ac.slug as category_slug
       FROM articles a LEFT JOIN article_categories ac ON a.category_id = ac.id
       ${where} ORDER BY a.is_featured DESC, a.published_at DESC
       LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM articles a LEFT JOIN article_categories ac ON a.category_id = ac.id ${where}`,
      params
    );

    res.json({ success: true, data: rows, total: parseInt(countRows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/articles/:slug (public) + increment view
const getArticleBySlug = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.*, ac.name as category_name, ac.slug as category_slug
       FROM articles a LEFT JOIN article_categories ac ON a.category_id = ac.id
       WHERE a.slug = $1 AND a.is_published = TRUE`,
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    await pool.query('UPDATE articles SET view_count = view_count + 1 WHERE id = $1', [rows[0].id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/admin/articles
const getArticlesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category_id, is_published } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (search) { conditions.push(`(a.title ILIKE $${idx} OR a.slug ILIKE $${idx})`); params.push(`%${search}%`); idx++; }
    if (category_id) { conditions.push(`a.category_id = $${idx++}`); params.push(category_id); }
    if (is_published !== undefined) { conditions.push(`a.is_published = $${idx++}`); params.push(is_published === 'true'); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(
      `SELECT a.*, ac.name as category_name, u.full_name as created_by_name
       FROM articles a
       LEFT JOIN article_categories ac ON a.category_id = ac.id
       LEFT JOIN users u ON a.created_by = u.id
       ${where} ORDER BY a.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );
    const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM articles a ${where}`, params);
    res.json({ success: true, data: rows, total: parseInt(countRows[0].count), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/admin/articles
const createArticle = async (req, res) => {
  try {
    const { category_id, title, slug, excerpt, content, image_url, read_time, is_featured, is_published, tags } = req.body;
    if (!title || !slug) return res.status(400).json({ success: false, message: 'Thiếu title và slug' });

    const { rows } = await pool.query(
      `INSERT INTO articles (category_id, title, slug, excerpt, content, image_url, read_time, is_featured, is_published, tags, created_by, published_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
               CASE WHEN $9 THEN NOW() ELSE NULL END,
               NOW(),NOW()) RETURNING *`,
      [category_id, title, slug, excerpt, content, image_url, read_time, is_featured || false,
       is_published || false, tags || [], req.user.id]
    );
    await logAudit(req.user.id, req.user.email, 'CREATE', 'article', rows[0].id, rows[0].title, null, rows[0], req);
    res.status(201).json({ success: true, data: rows[0], message: 'Tạo bài viết thành công' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/admin/articles/:id
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, title, slug, excerpt, content, image_url, read_time, is_featured, is_published, tags } = req.body;
    const { rows: old } = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });

    const { rows } = await pool.query(
      `UPDATE articles SET category_id=$1, title=$2, slug=$3, excerpt=$4, content=$5, image_url=$6,
       read_time=$7, is_featured=$8, is_published=$9, tags=$10, updated_at=NOW(),
       published_at = CASE WHEN $9 AND published_at IS NULL THEN NOW() ELSE published_at END
       WHERE id=$11 RETURNING *`,
      [category_id, title, slug, excerpt, content, image_url, read_time, is_featured, is_published, tags, id]
    );
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'article', id, rows[0].title, old[0], rows[0], req);
    res.json({ success: true, data: rows[0], message: 'Cập nhật thành công' });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// DELETE /api/admin/articles/:id
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'article', id, rows[0].title, rows[0], null, req);
    res.json({ success: true, message: 'Xóa bài viết thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getArticleCategories = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM article_categories ORDER BY sort_order, name');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getArticles, getArticleBySlug, getArticlesAdmin, createArticle, updateArticle, deleteArticle, getArticleCategories };
