const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Cho phép upload vào các thư mục con: products, services, articles, gallery, avatars, banners
    const type = req.query.type || req.body.category || 'others';
    const targetDir = path.join(uploadsDir, type);
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const type = req.query.type || req.body.category || 'others';
    // Đặt tên file kèm prefix loại để dễ quản lý
    const name = `${type}-${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Chỉ hỗ trợ: JPG, PNG, WEBP, GIF, AVIF'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
