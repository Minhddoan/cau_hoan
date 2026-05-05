const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  getProducts, getProductBySlug, getProductsAdmin, createProduct, updateProduct, deleteProduct, getProductCategories
} = require('../controllers/productController');
const {
  getArticles, getArticleBySlug, getArticlesAdmin, createArticle, updateArticle, deleteArticle, getArticleCategories
} = require('../controllers/articleController');
const {
  getFaqs, getFaqsAdmin, createFaq, updateFaq, deleteFaq, getFaqCategories,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial
} = require('../controllers/contentController');
const {
  getBookings, createBooking, updateBooking, deleteBooking,
  getJobs, getJobsAdmin, createJob, updateJob, deleteJob,
  getJobApplications, createJobApplication, updateJobApplication
} = require('../controllers/bookingJobController');
const {
  getUsers, createUser, updateUser, deleteUser, resetUserPassword,
  getRoles, getAuditLogs, getSettings, updateSettings, getDashboard
} = require('../controllers/adminController');
const { updateMe } = require('../controllers/authController');
const { getMyBookings } = require('../controllers/bookingJobController');
const { getMyOrders } = require('../controllers/orderController');
const { getServices, getServicesAdmin, createService, updateService, deleteService } = require('../controllers/serviceController');
const { getGallery, getGalleryAdmin, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { 
  getImagesByCategory, uploadMultipleImages, deleteImage: deleteMedia, reorderImages, updateImage
} = require('../controllers/mediaController');
const { createOrder, getOrdersAdmin, getOrderDetail, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { chatWithAI } = require('../controllers/chatController');

// ═══ PUBLIC ROUTES ════════════════════════════════════════════════════════════
router.get('/settings',                    getSettings);
router.get('/products',                   getProducts);
router.get('/products/:slug',             getProductBySlug);
router.get('/product-categories',         getProductCategories);

router.get('/articles',                   getArticles);
router.get('/articles/:slug',             getArticleBySlug);
router.get('/article-categories',         getArticleCategories);

router.get('/faqs',                       getFaqs);
router.get('/faq-categories',             getFaqCategories);
router.get('/testimonials',               getTestimonials);
router.get('/jobs',                       getJobs);
router.get('/services',                   getServices);
router.get('/gallery',                    getGallery);
router.get('/images/:category',           getImagesByCategory);

router.post('/bookings',                  createBooking);       // khách đặt lịch
router.post('/job-applications',          createJobApplication); // khách ứng tuyển
router.post('/orders',                    createOrder);         // khách đặt hàng
router.post('/chat',                      chatWithAI);          // trợ lý AI

// ═══ CUSTOMER DASHBOARD (authenticate required) ════════════════════════════════
router.put('/auth/me',                    authenticate, updateMe);
router.get('/my-bookings',                authenticate, getMyBookings);
router.get('/my-orders',                  authenticate, getMyOrders);

// ═══ ADMIN ROUTES (authenticate required) ═════════════════════════════════════
const a = authenticate;
const editor  = [authenticate, checkRole('editor')];
const admin   = [authenticate, checkRole('admin')];
const suAdmin = [authenticate, checkRole('super_admin')];

// Dashboard
router.get('/admin/dashboard',            ...editor, getDashboard);

// Products admin
router.get('/admin/products',             ...editor, getProductsAdmin);
router.post('/admin/products',            ...editor, createProduct);
router.put('/admin/products/:id',         ...editor, updateProduct);
router.delete('/admin/products/:id',      ...admin,  deleteProduct);

// Articles admin
router.get('/admin/articles',             ...editor, getArticlesAdmin);
router.post('/admin/articles',            ...editor, createArticle);
router.put('/admin/articles/:id',         ...editor, updateArticle);
router.delete('/admin/articles/:id',      ...admin,  deleteArticle);

// FAQs admin
router.get('/admin/faqs',                 ...editor, getFaqsAdmin);
router.post('/admin/faqs',                ...editor, createFaq);
router.put('/admin/faqs/:id',             ...editor, updateFaq);
router.delete('/admin/faqs/:id',          ...admin,  deleteFaq);

// Testimonials admin
router.post('/admin/testimonials',        ...editor, createTestimonial);
router.put('/admin/testimonials/:id',     ...editor, updateTestimonial);
router.delete('/admin/testimonials/:id',  ...admin,  deleteTestimonial);

// Bookings admin
router.get('/admin/bookings',             ...editor, getBookings);
router.put('/admin/bookings/:id',         ...editor, updateBooking);
router.delete('/admin/bookings/:id',      ...admin,  deleteBooking);

// Jobs admin
router.get('/admin/jobs',                 ...editor, getJobsAdmin);
router.post('/admin/jobs',                ...editor, createJob);
router.put('/admin/jobs/:id',             ...editor, updateJob);
router.delete('/admin/jobs/:id',          ...admin,  deleteJob);

// Job Applications admin
router.get('/admin/job-applications',     ...editor, getJobApplications);
router.put('/admin/job-applications/:id', ...editor, updateJobApplication);

// Services admin
router.get('/admin/services',             ...editor, getServicesAdmin);
router.post('/admin/services',            ...editor, createService);
router.put('/admin/services/:id',         ...editor, updateService);
router.delete('/admin/services/:id',      ...admin,  deleteService);

// Gallery admin
router.get('/admin/gallery',              ...editor, getGalleryAdmin);
router.post('/admin/gallery',             ...editor, createGalleryItem);
router.put('/admin/gallery/:id',          ...editor, updateGalleryItem);
router.delete('/admin/gallery/:id',       ...admin,  deleteGalleryItem);

// Media Management admin
router.post('/admin/images/upload',       ...editor, upload.array('images', 10), uploadMultipleImages);
router.put('/admin/images/:id',           ...editor, updateImage);
router.delete('/admin/images/:id',        ...admin,  deleteMedia);
router.put('/admin/images/reorder',       ...editor, reorderImages);

// Orders admin
router.get('/admin/orders',               ...editor, getOrdersAdmin);
router.get('/admin/orders/:id',           ...editor, getOrderDetail);
router.put('/admin/orders/:id',           ...editor, updateOrderStatus);
router.delete('/admin/orders/:id',        ...admin,  deleteOrder);

// Users & Roles (super_admin only)
router.get('/admin/users',                ...suAdmin, getUsers);
router.post('/admin/users',               ...suAdmin, createUser);
router.put('/admin/users/:id',            ...suAdmin, updateUser);
router.delete('/admin/users/:id',         ...suAdmin, deleteUser);
router.put('/admin/users/:id/password',   ...suAdmin, resetUserPassword);
router.get('/admin/roles',                ...admin,   getRoles);

// Settings
router.get('/admin/settings',             ...editor,  getSettings);
router.put('/admin/settings',             ...admin,   updateSettings);

// Audit Logs
router.get('/admin/audit-logs',           ...admin,   getAuditLogs);

module.exports = router;
