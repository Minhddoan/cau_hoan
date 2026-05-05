const pool = require('../config/db');
const { logAudit } = require('../middleware/auth');

// POST /api/orders (public) - Tạo đơn hàng từ ShoppingCart
const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { customer_name, customer_phone, customer_email, shipping_address, items, payment_method, note } = req.body;
    
    if (!customer_name || !customer_phone || !shipping_address || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt hàng hoặc giỏ hàng trống' });
    }

    await client.query('BEGIN');

    // 1. Tính tổng tiền và kiểm tra giá từ DB để bảo mật (không tin cậy giá từ frontend)
    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const { rows } = await client.query('SELECT name, price FROM products WHERE id = $1 AND is_active = TRUE', [item.id]);
      if (!rows[0]) {
        throw new Error(`Sản phẩm (ID: ${item.id}) không tồn tại hoặc ngừng kinh doanh`);
      }
      const product = rows[0];
      const price = parseInt(product.price);
      const qty = parseInt(item.quantity) || 1;
      total_amount += price * qty;

      orderItems.push({
        product_id: item.id,
        product_name: product.name,
        price,
        quantity: qty
      });
    }

    // 2. Tạo Order
    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (customer_name, customer_phone, customer_email, shipping_address, total_amount, payment_method, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [customer_name, customer_phone, customer_email, shipping_address, total_amount, payment_method || 'cod', note]
    );
    const orderId = orderRows[0].id;

    // 3. Tạo Order Items
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.product_name, item.price, item.quantity]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Đặt hàng thành công', order_id: orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(400).json({ success: false, message: err.message || 'Lỗi xử lý đơn hàng' });
  } finally {
    client.release();
  }
};

// GET /api/my-orders (private)
const getMyOrders = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM orders WHERE customer_email = $1 ORDER BY created_at DESC`,
      [req.user.email]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/admin/orders (editor+)
const getOrdersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let idx = 1;

    if (search) {
      conditions.push(`(customer_name ILIKE $${idx} OR customer_phone ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }
    if (status) {
      conditions.push(`status = $${idx}`); params.push(status); idx++;
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(
      `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );

    const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM orders ${where}`, params);

    res.json({ success: true, data: rows, total: parseInt(countRows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/admin/orders/:id (editor+) - Kèm chi tiết
const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    res.json({ success: true, data: { ...rows[0], items } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/admin/orders/:id (editor+) - Update status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status, note } = req.body;

    const { rows: old } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    const VALID_STATUS = ['pending','confirmed','shipping','completed','cancelled'];
    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái đơn hàng không hợp lệ' });
    }

    const { rows } = await pool.query(
      `UPDATE orders SET 
       status=COALESCE($1,status), payment_status=COALESCE($2,payment_status), note=COALESCE($3,note),
       updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [status, payment_status, note, id]
    );

    await logAudit(req.user.id, req.user.email, 'UPDATE', 'order', id, `Đơn hàng #${id}`, old[0], rows[0], req);
    res.json({ success: true, data: rows[0], message: 'Cập nhật thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// DELETE /api/admin/orders/:id (admin+)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows: old } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (!old[0]) return res.status(404).json({ success: false, message: 'Không tìm thấy' });

    // Cascading delete rules will remove items
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    await logAudit(req.user.id, req.user.email, 'DELETE', 'order', id, `Đơn hàng #${id}`, old[0], null, req);
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { createOrder, getMyOrders, getOrdersAdmin, getOrderDetail, updateOrderStatus, deleteOrder };
