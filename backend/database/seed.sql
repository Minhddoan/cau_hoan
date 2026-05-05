-- ============================================================
-- SEED DATA (Updated for organized images)
-- ============================================================

-- Seed Products
-- Current logic: image_url stores 'products/filename.jpg'
INSERT INTO products (category_id, slug, name, description, price, original_price, rating, review_count, image_url, badge, badge_color, is_active, is_featured, sort_order) VALUES
  (1, 'ty-huu-vang',         'Tỳ Hưu Vàng 24K Chiêu Tài',        'Linh vật Tỳ Hưu được chế tác từ vàng 24K nguyên chất.', 3200000, NULL, 4.9, 128, 'products/ty-huu.jpg', 'Bán Chạy', 'bg-red-600',   TRUE, TRUE,  1),
  (1, 'di-lac-tram',         'Tượng Phật Di Lặc Trầm Hương',      'Tượng Phật Di Lặc mang lại bình an.',        12500000, NULL, 5.0, 86,  'products/phat-di-lac.jpg', 'VIP',       'bg-gold',      TRUE, TRUE,  2),
  (2, 'tram-huong-vip',      'Vòng Trầm Hương Song Vũ VIP',       'Vòng trầm hương tự nhiên trên 30 năm tuổi.',           8500000,  NULL, 4.9, 147, 'products/vong-tram.jpg', 'Cao Cấp',  'bg-gold',      TRUE, TRUE,  5)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed Articles
INSERT INTO articles (category_id, title, slug, excerpt, image_url, read_time, view_count, is_featured, is_published, tags, published_at) VALUES
  (1, 'Ngũ Hành – Triết Lý Vũ Trụ Á Đông', 'ngu-hanh-triet-ly-vu-tru-a-dong', 'Năm yếu tố Kim – Mộc – Thủy – Hỏa – Thổ.', 'articles/ngu-hanh.jpg', '8 phút', 12400, TRUE,  TRUE, ARRAY['Căn Bản','Ngũ Hành'], NOW())
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed Gallery
INSERT INTO gallery_images (title, description, image_url, category, sort_order) VALUES
  ('Kiến Trúc Đền Chùa', 'Vẻ đẹp tinh tế Á Đông', 'gallery/temple-1.jpg', 'Kiến Trúc', 1),
  ('Nội Thất Gỗ Trầm',  'Sự hài hòa không gian',  'gallery/interior-1.jpg', 'Nội Thất', 2)
ON CONFLICT DO NOTHING;
