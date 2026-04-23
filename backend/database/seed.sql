-- ============================================================
-- SEED DATA - Chạy sau schema.sql
-- Yêu cầu: đã có super_admin user (chạy npm run seed sau)
-- ============================================================

-- Seed Products (cần category_id từ bảng product_categories)
INSERT INTO products (category_id, slug, name, description, price, original_price, rating, review_count, image_url, badge, badge_color, is_active, is_featured, sort_order) VALUES
  (1, 'ty-huu-vang',         'Tỳ Hưu Vàng 24K Chiêu Tài',        'Linh vật Tỳ Hưu được chế tác từ vàng 24K nguyên chất, tượng trưng cho quyền lực và khả năng chiêu tài hút lộc cực mạnh.', 3200000, NULL, 4.9, 128, 'https://images.unsplash.com/photo-1671043121840-cf607dee6152?w=600', 'Bán Chạy', 'bg-red-600',   TRUE, TRUE,  1),
  (1, 'di-lac-tram',         'Tượng Phật Di Lặc Trầm Hương',      'Tượng Phật Di Lặc mang lại bình an, hỷ lạc và thịnh vượng cho gia đình, được Thầy Song Vũ trực tiếp khai quang.',        12500000, NULL, 5.0, 86,  'https://images.unsplash.com/photo-1758800600436-eca719abf40c?w=600', 'VIP',       'bg-gold',      TRUE, TRUE,  2),
  (1, 'rong-vang',           'Rồng Vàng Phong Thủy Đế Vương',     'Tượng rồng mạ vàng 24K – biểu tượng quyền lực, may mắn và đế vương, giúp chủ nhân thăng tiến sự nghiệp.',               18900000, NULL, 4.9, 41,  'https://images.unsplash.com/photo-1767041988708-b501fe59e37b?w=600', 'Giới Hạn', 'bg-red-700',   TRUE, FALSE, 3),
  (1, 'phat-ba-quan-am',     'Phật Bà Quan Âm Ngọc Trắng',        'Tượng Quan Âm Bồ Tát bạch ngọc thiên nhiên, đem lại từ bi, phúc lộc và bình an cho gia đình.',                            9800000,  NULL, 5.0, 63,  'https://images.unsplash.com/photo-1655547229652-137073b160a5?w=600', 'Cao Cấp',  'bg-gold',      TRUE, FALSE, 4),
  (2, 'tram-huong-vip',      'Vòng Trầm Hương Song Vũ VIP',       'Vòng trầm hương tự nhiên trên 30 năm tuổi, hương thơm vĩnh cửu, mang lại linh khí và sự bình an cho chủ nhân.',           8500000,  NULL, 4.9, 147, 'https://images.unsplash.com/photo-1750751661623-f1c9496f2679?w=600', 'Cao Cấp',  'bg-gold',      TRUE, TRUE,  5),
  (2, 'tram-huong-108',      'Vòng Trầm 108 Hạt Kỳ Nam',          '108 hạt trầm kỳ nam kích thước đều, hương thơm đặc trưng, phù hợp thiền định và cân bằng tâm linh.',                       5200000,  NULL, 4.8, 92,  'https://images.unsplash.com/photo-1627769916425-74c2344a3439?w=600', NULL,        NULL,           TRUE, FALSE, 6),
  (3, 'vong-ngoc-bich',      'Vòng Ngọc Bích Thiên Nhiên',        'Ngọc bích thượng hạng, màu sắc đồng nhất, giúp tăng cường sức khỏe, cân bằng tâm trí và bảo vệ bình an.',                 6800000,  NULL, 4.8, 52,  'https://images.unsplash.com/photo-1582051924552-b4b6a6fccc01?w=600', 'Hiếm',     'bg-purple-600',TRUE, FALSE, 7),
  (3, 'vong-thach-anh-hong', 'Vòng Thạch Anh Hồng Tình Duyên',   'Thạch anh hồng tự nhiên giúp thu hút tình duyên, xua tan u ám, mang lại sức sống và tươi vui cho người đeo.',             2400000,  NULL, 4.7, 173, 'https://images.unsplash.com/photo-1586658066544-a87cdd681398?w=600', 'Bán Chạy', 'bg-red-600',   TRUE, FALSE, 8),
  (4, 'thach-anh-tim',       'Hốc Thạch Anh Tím Uruguay',         'Hốc thạch anh tím thiên nhiên nhập khẩu từ Uruguay, tỏa năng lượng bình an, giúp ngủ ngon và tăng trực giác.',             5500000,  NULL, 4.8, 67,  'https://images.unsplash.com/photo-1626470408813-f0059745d58b?w=600', NULL,        NULL,           TRUE, FALSE, 9),
  (4, 'thach-anh-trang',     'Cột Thạch Anh Trắng Thanh Lọc',    'Cột thạch anh trắng trong suốt, thanh lọc không gian sống, xua tà và thu hút vượng khí tích cực.',                         3100000,  NULL, 4.6, 49,  'https://images.unsplash.com/photo-1626470408813-f0059745d58b?w=600', NULL,        NULL,           TRUE, FALSE, 10)
ON CONFLICT (slug) DO NOTHING;

-- Seed Articles
INSERT INTO articles (category_id, title, slug, excerpt, image_url, read_time, view_count, is_featured, is_published, tags, published_at) VALUES
  (1, 'Ngũ Hành – Triết Lý Vũ Trụ Á Đông', 'ngu-hanh-triet-ly-vu-tru-a-dong', 'Năm yếu tố Kim – Mộc – Thủy – Hỏa – Thổ tạo nên sự vận hành của vũ trụ. Hiểu về Ngũ Hành là nền tảng để ứng dụng phong thủy vào cuộc sống.', 'https://images.unsplash.com/photo-1498938271812-01861258f1a6?w=800', '8 phút', 12400, TRUE,  TRUE, ARRAY['Căn Bản','Ngũ Hành'],          NOW()),
  (2, 'Nguyên Lý Bát Trạch – Phân Tích 8 Cung Vị', 'bat-trach-phan-tich-8-cung-vi', 'Bát Trạch chia không gian nhà ở thành 8 cung vị tương ứng 8 hướng địa lý, mỗi cung mang năng lượng riêng.', 'https://images.unsplash.com/photo-1556117153-659e8ce704c1?w=800', '10 phút', 9100, FALSE, TRUE, ARRAY['Phong Thủy Căn Bản','Bát Trạch'], NOW()),
  (3, 'Huyền Không Phi Tinh – Hệ Thống Nâng Cao', 'huyen-khong-phi-tinh', 'Huyền Không Phi Tinh phân tích 9 ngôi sao năng lượng di chuyển theo thời gian, giúp dự đoán vận khí từng năm.', 'https://images.unsplash.com/photo-1730627584454-fcbac9544df6?w=800', '12 phút', 7800, FALSE, TRUE, ARRAY['Nâng Cao','Huyền Không'],        NOW()),
  (5, 'Cách Bố Trí Phòng Khách Theo Phong Thủy', 'bo-tri-phong-khach-phong-thuy', 'Phòng khách là bộ mặt của căn nhà và tụ điểm khí trường. Hướng sofa, vị trí tivi, cây xanh và màu sắc đều ảnh hưởng đến vượng khí.', 'https://images.unsplash.com/photo-1556117153-659e8ce704c1?w=800', '7 phút', 15600, FALSE, TRUE, ARRAY['Nhà Ở','Thực Hành'],             NOW())
ON CONFLICT (slug) DO NOTHING;

-- Seed FAQs
INSERT INTO faqs (category_id, question, answer, sort_order, is_active) VALUES
  (1, 'Làm thế nào để biết nhà mình có phong thủy tốt không?', 'Nhà có phong thủy tốt thường có: Cửa chính không đối diện thẳng cầu thang, không bị xà ngang đè đầu, phòng bếp không đối diện phòng ngủ, nhà vệ sinh không nằm ở trung cung.', 1, TRUE),
  (1, 'Cửa chính quay hướng nào là tốt nhất?', 'Không có hướng nào tốt cho tất cả mọi người. Hướng cửa chính tốt phụ thuộc vào mệnh quái của gia chủ tính theo năm sinh.', 2, TRUE),
  (2, 'Bố trí bàn làm việc như thế nào là đúng phong thủy?', 'Bàn làm việc nên đặt: Lưng tựa tường (tàu hậu), nhìn ra cửa nhưng không ngồi thẳng trước cửa, không ngồi dưới xà ngang.', 1, TRUE),
  (3, 'Nên đặt tượng Phật ở đâu trong nhà?', 'Tượng Phật nên đặt ở nơi trang trọng, sạch sẽ, thoáng đãng. Chiều cao tượng phải ngang mắt hoặc cao hơn. Không đặt trong phòng ngủ.', 1, TRUE)
ON CONFLICT DO NOTHING;

-- Seed Testimonials
INSERT INTO testimonials (customer_name, customer_role, content, rating, is_active, sort_order) VALUES
  ('Anh Minh Phúc',  'Giám đốc Công ty BĐS', 'Sau khi điều chỉnh phong thủy văn phòng theo tư vấn của Thầy Song Vũ, doanh thu công ty tôi tăng gần 40% chỉ trong 6 tháng. Thầy rất tận tâm và chuyên nghiệp.', 5, TRUE, 1),
  ('Chị Lan Anh',    'Chủ nhà hàng',          'Thầy đã giúp tôi chọn ngày khai trương và bố trí nội thất chuẩn phong thủy. Nhà hàng liên tục đông khách từ ngày đầu tiên.', 5, TRUE, 2),
  ('Anh Quang Huy',  'Doanh nhân',            'Tôi đã gặp nhiều thầy phong thủy nhưng Thầy Song Vũ là người giải thích khoa học và hệ thống nhất. Không mơ hồ, không phán xét.', 5, TRUE, 3),
  ('Bà Ngọc Hà',    'Gia chủ',                'Thầy tư vấn phong thủy cho ngôi nhà mới của gia đình tôi. Sau khi vào nhà, gia đình thuận hòa, công việc của chồng và con cái đều hanh thông hơn rõ rệt.', 5, TRUE, 4)
ON CONFLICT DO NOTHING;

-- Seed Jobs
INSERT INTO jobs (slug, title, department, job_type, location, salary_range, description, requirements, benefits, tags, is_hot, is_urgent, is_active, deadline) VALUES
  ('tu-van-phong-thuy', 'Chuyên Viên Tư Vấn Phong Thủy', 'Tư Vấn', 'fulltime', 'Hà Nội / TP.HCM', '15 – 30 triệu/tháng',
   'Trực tiếp tư vấn phong thủy cho khách hàng cá nhân và doanh nghiệp dưới sự hướng dẫn của Thầy Song Vũ.',
   ARRAY['Có kiến thức cơ bản về phong thủy','Tốt nghiệp đại học hoặc tương đương','Giao tiếp tốt, thái độ chuyên nghiệp'],
   ARRAY['Lương cứng + hoa hồng không giới hạn','Được đào tạo chuyên sâu bởi Thầy Song Vũ','BHXH đầy đủ + thưởng hiệu suất'],
   ARRAY['Phong thủy','Tư vấn','Kinh nghiệm 2+ năm'],
   TRUE, FALSE, TRUE, '2026-05-30'),
  ('content-creator', 'Content Creator – Phong Thủy & Tâm Linh', 'Marketing', 'fulltime', 'Hà Nội (Remote linh hoạt)', '12 – 20 triệu/tháng',
   'Sản xuất nội dung chất lượng cao về phong thủy, mệnh học và văn hóa Á Đông cho website, mạng xã hội và kênh YouTube.',
   ARRAY['Kinh nghiệm viết content / sản xuất video 1+ năm','Yêu thích phong thủy, tâm linh','Kỹ năng viết hấp dẫn, SEO cơ bản'],
   ARRAY['Môi trường sáng tạo tự do','Làm việc remote linh hoạt','Bonus nếu nội dung viral'],
   ARRAY['Content','Social Media','Video'],
   FALSE, TRUE, TRUE, '2026-05-20')
ON CONFLICT (slug) DO NOTHING;
