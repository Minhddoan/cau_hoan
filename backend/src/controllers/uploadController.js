const path = require('path');
const fs   = require('fs');

// Helper to get all files recursively
const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

// POST /api/admin/upload  (single file)
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Không có file nào được upload' });
  }

  // Lấy folder từ query param, ví dụ: others, products, services...
  const type = req.query.type || 'others';
  
  // Đường dẫn tương đối dùng để lưu vào DB và hiển thị (vd: products/filename.jpg)
  const relativePath = `${type}/${req.file.filename}`;

  // Tạo URL truy cập public
  const baseUrl  = `${req.protocol}://${req.get('host')}`;
  const imageUrl = `${baseUrl}/uploads/${relativePath}`;

  res.json({
    success: true,
    url: imageUrl,
    relativePath: relativePath, // Dùng cái này để lưu vào DB cho gọn
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    message: 'Upload ảnh thành công',
  });
};

// DELETE /api/admin/upload/:path(*)
const deleteImage = (req, res) => {
  try {
    const filePathParam = req.params[0] || req.params.filename;
    
    // Bảo vệ: không cho xóa file ngoài thư mục uploads
    if (filePathParam.includes('..')) {
      return res.status(400).json({ success: false, message: 'Đường dẫn không hợp lệ' });
    }

    const filePath = path.join(__dirname, '../../uploads', filePathParam);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File không tồn tại' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Đã xóa ảnh' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xóa file' });
  }
};

// GET /api/admin/uploads  (danh sách ảnh đã upload - đệ quy)
const listImages = (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) return res.json({ success: true, data: [], total: 0 });

    const allFiles = getAllFiles(uploadsDir);
    const files = allFiles
      .filter(f => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(f))
      .map(f => {
        const stat = fs.statSync(f);
        const relativePath = path.relative(uploadsDir, f).replace(/\\/g, '/');
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return {
          filename: path.basename(f),
          relativePath: relativePath,
          url: `${baseUrl}/uploads/${relativePath}`,
          size: stat.size,
          created_at: stat.birthtime,
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ success: true, data: files, total: files.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi đọc thư mục' });
  }
};

module.exports = { uploadImage, deleteImage, listImages };
