const path = require('path');
const fs   = require('fs');

// POST /api/admin/upload  (single file)
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không có file nào được upload' });
  }

  // Tạo URL truy cập public
  const baseUrl  = `${req.protocol}://${req.get('host')}`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    url: imageUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    message: 'Upload ảnh thành công',
  });
};

// DELETE /api/admin/upload/:filename
const deleteImage = (req, res) => {
  try {
    const filename = req.params.filename;
    // Bảo vệ: không cho xóa file ngoài thư mục uploads
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ success: false, message: 'Tên file không hợp lệ' });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File không tồn tại' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Đã xóa ảnh' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xóa file' });
  }
};

// GET /api/admin/uploads  (danh sách ảnh đã upload)
const listImages = (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    const files = fs.readdirSync(uploadsDir)
      .filter(f => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(f))
      .map(f => {
        const stat = fs.statSync(path.join(uploadsDir, f));
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return {
          filename: f,
          url: `${baseUrl}/uploads/${f}`,
          size: stat.size,
          created_at: stat.birthtime,
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ success: true, data: files, total: files.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi đọc thư mục' });
  }
};

module.exports = { uploadImage, deleteImage, listImages };
