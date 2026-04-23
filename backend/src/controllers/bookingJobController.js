const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
const getBookings = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (status) { conditions.push(`b.status = $${idx++}`); params.push(status); }
    if (date) { conditions.push(`b.preferred_date = $${idx++}`); params.push(date); }
    if (search) {
      conditions.push(`(b.customer_name ILIKE $${idx} OR b.customer_phone ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(
      `SELECT b.*, u.full_name as assigned_to_name
       FROM bookings b LEFT JOIN users u ON b.assigned_to = u.id
       ${where} ORDER BY b.created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );
    const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM bookings b ${where}`, params);
    res.json({ success: true, data: rows, total: parseInt(countRows[0].count), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/bookings (public - khách đặt lịch)
const createBooking = async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_email, service_type, preferred_date, preferred_time, note } = req.body;
    if (!customer_name || !customer_phone) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên và số điện thoại' });
    }
    const { rows } = await pool.query(
      `INSERT INTO bookings (customer_name, customer_phone, customer_email, service_type, preferred_date, preferred_time, note, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW()) RETURNING *`,
      [customer_name, customer_phone, customer_email, service_type, preferred_date, preferred_time, note]
    );
    res.status(201).json({ success: true, data: rows[0], message: 'Đặt lịch thành công! Chúng tôi sẽ liên hệ trong 24h.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/admin/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_to, note } = req.body;
    const { rows: old } = await pool.query('SELECT * FROM bookings WHERE id=$1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
    const { rows } = await pool.query(
      `UPDATE bookings SET status=COALESCE($1,status), assigned_to=COALESCE($2,assigned_to), note=COALESCE($3,note), updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [status, assigned_to, note, id]
    );
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'booking', id, rows[0].customer_name, old[0], rows[0], req);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM bookings WHERE id=$1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    await pool.query('DELETE FROM bookings WHERE id=$1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'booking', id, rows[0].customer_name, rows[0], null, req);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── JOBS ─────────────────────────────────────────────────────────────────────
const getJobs = async (req, res) => {
  try {
    const { dept, type } = req.query;
    const conditions = ['is_active = TRUE'];
    const params = [];
    let idx = 1;
    if (dept) { conditions.push(`department = $${idx++}`); params.push(dept); }
    if (type) { conditions.push(`job_type = $${idx++}`); params.push(type); }
    const { rows } = await pool.query(
      `SELECT * FROM jobs WHERE ${conditions.join(' AND ')} ORDER BY is_hot DESC, created_at DESC`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getJobsAdmin = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT j.*, u.full_name as created_by_name,
              (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = j.id) as application_count
       FROM jobs j LEFT JOIN users u ON j.created_by = u.id ORDER BY j.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const createJob = async (req, res) => {
  try {
    const { slug, title, department, job_type, location, salary_range, description, requirements, benefits, tags, is_hot, is_urgent, is_active, deadline } = req.body;
    if (!title || !slug) return res.status(400).json({ success: false, message: 'Thiếu title và slug' });
    const { rows } = await pool.query(
      `INSERT INTO jobs (slug,title,department,job_type,location,salary_range,description,requirements,benefits,tags,is_hot,is_urgent,is_active,deadline,created_by,created_at,updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW(),NOW()) RETURNING *`,
      [slug, title, department, job_type || 'fulltime', location, salary_range, description,
       requirements || [], benefits || [], tags || [],
       is_hot || false, is_urgent || false, is_active !== false, deadline, req.user.id]
    );
    await logAudit(req.user.id, req.user.email, 'CREATE', 'job', rows[0].id, rows[0].title, null, rows[0], req);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, title, department, job_type, location, salary_range, description, requirements, benefits, tags, is_hot, is_urgent, is_active, deadline } = req.body;
    const { rows: old } = await pool.query('SELECT * FROM jobs WHERE id=$1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy vị trí' });
    const { rows } = await pool.query(
      `UPDATE jobs SET slug=$1,title=$2,department=$3,job_type=$4,location=$5,salary_range=$6,
       description=$7,requirements=$8,benefits=$9,tags=$10,is_hot=$11,is_urgent=$12,is_active=$13,deadline=$14,updated_at=NOW()
       WHERE id=$15 RETURNING *`,
      [slug, title, department, job_type, location, salary_range, description,
       requirements, benefits, tags, is_hot, is_urgent, is_active, deadline, id]
    );
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'job', id, rows[0].title, old[0], rows[0], req);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Slug đã tồn tại' });
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id=$1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    await pool.query('DELETE FROM jobs WHERE id=$1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'job', id, rows[0].title, rows[0], null, req);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Job Applications
const getJobApplications = async (req, res) => {
  try {
    const { job_id, status } = req.query;
    const conditions = [];
    const params = [];
    let idx = 1;
    if (job_id) { conditions.push(`ja.job_id = $${idx++}`); params.push(job_id); }
    if (status) { conditions.push(`ja.status = $${idx++}`); params.push(status); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(
      `SELECT ja.*, j.title as job_title FROM job_applications ja
       LEFT JOIN jobs j ON ja.job_id = j.id ${where} ORDER BY ja.created_at DESC`,
      params
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const createJobApplication = async (req, res) => {
  try {
    const { job_id, applicant_name, applicant_phone, applicant_email, cover_letter } = req.body;
    if (!job_id || !applicant_name || !applicant_phone) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }
    const { rows } = await pool.query(
      `INSERT INTO job_applications (job_id, applicant_name, applicant_phone, applicant_email, cover_letter, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW()) RETURNING *`,
      [job_id, applicant_name, applicant_phone, applicant_email, cover_letter]
    );
    res.status(201).json({ success: true, data: rows[0], message: 'Ứng tuyển thành công! Chúng tôi sẽ liên hệ trong 3-5 ngày.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const { rows: old } = await pool.query('SELECT * FROM job_applications WHERE id=$1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    const { rows } = await pool.query(
      `UPDATE job_applications SET status=COALESCE($1,status), notes=COALESCE($2,notes), updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [status, notes, id]
    );
    await logAudit(req.user.id, req.user.email, 'UPDATE', 'job_application', id, rows[0].applicant_name, old[0], rows[0], req);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getBookings, createBooking, updateBooking, deleteBooking,
  getJobs, getJobsAdmin, createJob, updateJob, deleteJob,
  getJobApplications, createJobApplication, updateJobApplication
};
