const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');
const fs      = require('fs');
require('dotenv').config();

const authRoutes    = require('./routes/authRoutes');
const apiRoutes     = require('./routes/index');
const upload        = require('./middleware/upload');
const { uploadImage, deleteImage, listImages } = require('./controllers/uploadController');
const { authenticate, checkRole } = require('./middleware/auth');

const app = express();

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL    || 'http://localhost:5173',
  ],
  credentials: true,
}));

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static: serve ảnh đã upload ─────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ─── Upload Routes ────────────────────────────────────────────────────────────
app.post('/api/admin/upload',
  authenticate, checkRole('editor'),
  upload.single('image'),
  uploadImage
);
app.get('/api/admin/uploads',
  authenticate, checkRole('editor'),
  listImages
);
app.delete('/api/admin/upload/:filename',
  authenticate, checkRole('admin'),
  deleteImage
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api',      apiRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString(), service: 'Phong Thuy Song Vu API' });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} không tồn tại` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Phong Thuy Song Vu API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
