-- ============================================================
-- PHONG THUY SONG VU - PostgreSQL Database Schema
-- Chạy lệnh này trong psql hoặc pgAdmin
-- ============================================================

-- Tạo database (chạy với user postgres)
-- CREATE DATABASE phongthuy_songvu;

-- ============================================================
-- 1. ROLES & USERS (RBAC)
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(50) UNIQUE NOT NULL,   -- 'super_admin','admin','editor','viewer'
  display_name VARCHAR(100),
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(200),
  role_id       INT REFERENCES roles(id) ON DELETE SET NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  last_login    TIMESTAMPTZ,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id             SERIAL PRIMARY KEY,
  category_id    INT REFERENCES product_categories(id) ON DELETE SET NULL,
  slug           VARCHAR(200) UNIQUE NOT NULL,
  name           VARCHAR(200) NOT NULL,
  description    TEXT,
  price          BIGINT NOT NULL DEFAULT 0,
  original_price BIGINT,
  rating         DECIMAL(3,2) DEFAULT 5.0,
  review_count   INT DEFAULT 0,
  image_url      TEXT,
  badge          VARCHAR(50),
  badge_color    VARCHAR(50),
  is_active      BOOLEAN DEFAULT TRUE,
  is_featured    BOOLEAN DEFAULT FALSE,
  sort_order     INT DEFAULT 0,
  created_by     INT REFERENCES users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. ARTICLES (Kiến Thức)
-- ============================================================
CREATE TABLE IF NOT EXISTS article_categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id           SERIAL PRIMARY KEY,
  category_id  INT REFERENCES article_categories(id) ON DELETE SET NULL,
  title        VARCHAR(500) NOT NULL,
  slug         VARCHAR(500) UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  image_url    TEXT,
  read_time    VARCHAR(20),
  view_count   INT DEFAULT 0,
  is_featured  BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  tags         TEXT[] DEFAULT '{}',
  created_by   INT REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. FAQ (Hỏi Đáp)
-- ============================================================
CREATE TABLE IF NOT EXISTS faq_categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  icon_name  VARCHAR(50),
  color      VARCHAR(50),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs (
  id          SERIAL PRIMARY KEY,
  category_id INT REFERENCES faq_categories(id) ON DELETE SET NULL,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_by  INT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. SERVICES (Dịch Vụ Tư Vấn)
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(200) UNIQUE NOT NULL,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  icon_name   VARCHAR(50),
  price_from  BIGINT,
  price_to    BIGINT,
  is_active   BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order  INT DEFAULT 0,
  created_by  INT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. TESTIMONIALS (Đánh Giá Khách Hàng)
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id          SERIAL PRIMARY KEY,
  customer_name VARCHAR(200) NOT NULL,
  customer_role VARCHAR(200),
  content     TEXT NOT NULL,
  rating      INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  created_by  INT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. BOOKINGS (Lịch Hẹn Tư Vấn)
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id              SERIAL PRIMARY KEY,
  customer_name   VARCHAR(200) NOT NULL,
  customer_phone  VARCHAR(20) NOT NULL,
  customer_email  VARCHAR(255),
  service_type    VARCHAR(100),
  preferred_date  DATE,
  preferred_time  VARCHAR(20),
  note            TEXT,
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','completed','cancelled')),
  assigned_to     INT REFERENCES users(id) ON DELETE SET NULL,
  source          VARCHAR(50) DEFAULT 'website',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. JOBS (Tuyển Dụng)
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
  id           SERIAL PRIMARY KEY,
  slug         VARCHAR(200) UNIQUE NOT NULL,
  title        VARCHAR(200) NOT NULL,
  department   VARCHAR(100),
  job_type     VARCHAR(20) DEFAULT 'fulltime'
               CHECK (job_type IN ('fulltime','parttime','intern')),
  location     VARCHAR(200),
  salary_range VARCHAR(100),
  description  TEXT,
  requirements TEXT[],
  benefits     TEXT[],
  tags         TEXT[],
  is_hot       BOOLEAN DEFAULT FALSE,
  is_urgent    BOOLEAN DEFAULT FALSE,
  is_active    BOOLEAN DEFAULT TRUE,
  deadline     DATE,
  created_by   INT REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. JOB APPLICATIONS (Đơn Ứng Tuyển)
-- ============================================================
CREATE TABLE IF NOT EXISTS job_applications (
  id           SERIAL PRIMARY KEY,
  job_id       INT REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_name  VARCHAR(200) NOT NULL,
  applicant_phone VARCHAR(20) NOT NULL,
  applicant_email VARCHAR(255),
  cover_letter TEXT,
  cv_url       TEXT,
  status       VARCHAR(20) DEFAULT 'new'
               CHECK (status IN ('new','reviewing','interviewed','accepted','rejected')),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. GALLERY
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200),
  description TEXT,
  image_url   TEXT NOT NULL,
  category    VARCHAR(100),
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_by  INT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10.5. ORDERS (Đơn Hàng)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  customer_name    VARCHAR(200) NOT NULL,
  customer_phone   VARCHAR(20) NOT NULL,
  customer_email   VARCHAR(255),
  shipping_address TEXT NOT NULL,
  total_amount     BIGINT NOT NULL DEFAULT 0,
  status           VARCHAR(50) DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','shipping','completed','cancelled')),
  payment_method   VARCHAR(50) DEFAULT 'cod' CHECK (payment_method IN ('cod','bank_transfer')),
  payment_status   VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid')),
  note             TEXT,
  assigned_to      INT REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200),
  price      BIGINT NOT NULL,
  quantity   INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id          SERIAL PRIMARY KEY,
  key         VARCHAR(100) UNIQUE NOT NULL,
  value       TEXT,
  description VARCHAR(300),
  group_name  VARCHAR(50) DEFAULT 'general',
  updated_by  INT REFERENCES users(id) ON DELETE SET NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id            SERIAL PRIMARY KEY,
  user_id       INT REFERENCES users(id) ON DELETE SET NULL,
  user_email    VARCHAR(255),
  action        VARCHAR(50) NOT NULL,       -- 'CREATE','UPDATE','DELETE','LOGIN','LOGOUT'
  resource_type VARCHAR(50),                -- 'product','article','user',...
  resource_id   INT,
  resource_name VARCHAR(300),
  old_values    JSONB,
  new_values    JSONB,
  ip_address    INET,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active     ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_articles_category   ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published  ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_faqs_category       ON faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status     ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date       ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_jobs_active         ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_job    ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user     ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created  ON audit_logs(created_at DESC);

-- ============================================================
-- SEED: ROLES
-- ============================================================
INSERT INTO roles (name, display_name, description) VALUES
  ('super_admin', 'Super Admin', 'Toàn quyền hệ thống'),
  ('admin',       'Admin',       'Quản lý nội dung và người dùng trừ phân quyền'),
  ('editor',      'Editor',      'Tạo và sửa nội dung, không xóa'),
  ('viewer',      'Viewer',      'Chỉ xem, không chỉnh sửa')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- SEED: PRODUCT CATEGORIES
-- ============================================================
INSERT INTO product_categories (name, slug, sort_order) VALUES
  ('Linh Vật',   'linh-vat',   1),
  ('Trầm Hương', 'tram-huong', 2),
  ('Trang Sức',  'trang-suc',  3),
  ('Đá Quý',     'da-quy',     4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: ARTICLE CATEGORIES
-- ============================================================
INSERT INTO article_categories (name, slug, sort_order) VALUES
  ('Ngũ Hành',              'ngu-hanh',              1),
  ('Bát Trạch',             'bat-trach',             2),
  ('Huyền Không',           'huyen-khong',           3),
  ('Tứ Trụ',                'tu-tru',                4),
  ('Phong Thủy Nhà Ở',      'phong-thuy-nha-o',      5),
  ('Phong Thủy Kinh Doanh', 'phong-thuy-kinh-doanh', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: FAQ CATEGORIES
-- ============================================================
INSERT INTO faq_categories (name, slug, icon_name, color, sort_order) VALUES
  ('Nhà Ở',    'nha-o',    'Home',         'text-green-400',  1),
  ('Văn Phòng','van-phong','Briefcase',    'text-blue-400',   2),
  ('Vật Phẩm', 'vat-pham', 'Gem',          'text-purple-400', 3),
  ('Xem Ngày', 'xem-ngay', 'CalendarDays', 'text-gold',       4),
  ('Hôn Nhân', 'hon-nhan', 'Heart',        'text-red-400',    5),
  ('Đặt Tên',  'dat-ten',  'Baby',         'text-pink-400',   6),
  ('Cải Vận',  'cai-van',  'Sparkles',     'text-amber-400',  7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (key, value, description, group_name) VALUES
  ('site_name',       'Phong Thủy Song Vũ',            'Tên website',                 'general'),
  ('site_tagline',    'Khoa học phong thủy cho người Việt', 'Mô tả ngắn',              'general'),
  ('contact_phone',   '0912 345 678',                  'Số điện thoại liên hệ',       'contact'),
  ('contact_email',   'info@phongthuysongvu.com',      'Email liên hệ',               'contact'),
  ('contact_address', 'Hà Nội, Việt Nam',              'Địa chỉ',                     'contact'),
  ('facebook_url',    'https://facebook.com/phongthuysongvu', 'Link Facebook',         'social'),
  ('youtube_url',     'https://youtube.com/@phongthuysongvu', 'Link YouTube',          'social'),
  ('zalo_link',       'https://zalo.me/0912345678',    'Link Zalo',                   'social'),
  ('booking_enabled', 'true',                          'Cho phép đặt lịch online',    'features'),
  ('ai_chat_enabled', 'true',                          'Bật Trợ lý AI',               'features')
ON CONFLICT (key) DO NOTHING;
