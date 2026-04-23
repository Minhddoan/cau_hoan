import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, Minus, Search } from "lucide-react";
import { Link } from "react-router";

const faqs = [
  {
    id: 1,
    category: "Nhà Ở",
    question: "Làm thế nào để biết nhà mình có phong thủy tốt không?",
    answer:
      "Nhà có phong thủy tốt thường có: Cửa chính không đối diện thẳng cầu thang, không bị xà ngang đè đầu, phòng bếp không đối diện phòng ngủ, nhà vệ sinh không nằm ở trung cung. Ngoài ra, ánh sáng tự nhiên, thông gió tốt và cảm giác dễ chịu khi bước vào nhà cũng là dấu hiệu tốt. Để đánh giá chính xác cần xem hướng nhà, tuổi gia chủ và bản đồ phi tinh.",
  },
  {
    id: 2,
    category: "Nhà Ở",
    question: "Cửa chính quay hướng nào là tốt nhất?",
    answer:
      "Không có hướng nào tốt cho tất cả mọi người. Hướng cửa chính tốt phụ thuộc vào mệnh quái của gia chủ (tính theo năm sinh). Người mệnh Đông Tứ Trạch (Tốn, Khảm, Chấn, Ly) hợp hướng Đông, Đông Nam, Bắc, Nam. Người mệnh Tây Tứ Trạch (Càn, Đoài, Cấn, Khôn) hợp hướng Tây, Tây Bắc, Đông Bắc, Tây Nam.",
  },
  {
    id: 3,
    category: "Văn Phòng",
    question: "Bố trí bàn làm việc như thế nào là đúng phong thủy?",
    answer:
      "Bàn làm việc nên đặt: Lưng tựa tường (tàu hậu), nhìn ra cửa nhưng không ngồi thẳng trước cửa, không ngồi dưới xà ngang, không quay lưng ra cửa sổ lớn. Vị trí lý tưởng là góc chéo với cửa ra vào (vị trí Vượng Sơn hoặc Sinh Khí). Trên bàn nên gọn gàng, đặt cây nhỏ bên trái để kích hoạt Thanh Long.",
  },
  {
    id: 4,
    category: "Văn Phòng",
    question: "Màu sắc nào phù hợp cho không gian làm việc theo phong thủy?",
    answer:
      "Màu sắc phụ thuộc vào mệnh và hướng văn phòng: Xanh lá (Mộc) tốt cho sáng tạo, vàng/nâu (Thổ) tốt cho sự ổn định, trắng/xám (Kim) tốt cho tổ chức. Tránh dùng quá nhiều đỏ hoặc đen. Kết hợp màu chủ đạo của mệnh sẽ mang lại hiệu quả làm việc tốt nhất.",
  },
  {
    id: 5,
    category: "Vật Phẩm",
    question: "Nên đặt tượng Phật ở đâu trong nhà?",
    answer:
      "Tượng Phật nên đặt ở nơi trang trọng, sạch sẽ, thoáng đãng. Chiều cao tượng phải ngang mắt hoặc cao hơn. Không đặt trong phòng ngủ, nhà tắm, bếp. Tốt nhất là đặt ở phòng khách, quay mặt về hướng cửa chính. Không đặt đối diện nhà vệ sinh hoặc nơi có sát khí.",
  },
  {
    id: 6,
    category: "Vật Phẩm",
    question: "Trầm hương có tác dụng phong thủy gì?",
    answer:
      "Trầm hương có nhiều công dụng phong thủy: Thanh lọc năng lượng âm, xua tan sát khí và khí trọc; An thần, giảm stress, cải thiện giấc ngủ; Khai mở trí tuệ, tăng vận học hành; Kết nối năng lượng tâm linh trong cúng bái. Dùng nhang trầm hoặc đặt gỗ trầm trong không gian giúp cân bằng âm dương và lưu thông khí trường.",
  },
  {
    id: 7,
    category: "Xem Ngày",
    question: "Xem ngày cưới cần lưu ý những gì?",
    answer:
      "Khi xem ngày cưới cần xét: Tuổi hai người và tam hợp, lục hợp với nhau; Tránh ngày xung, hại, phá với tuổi; Tránh ngày Sát Chủ (ngày xung với chủ hôn); Ưu tiên các ngày Hoàng Đạo Lục Hợp; Xem Tiết, Trung, Hạ nguyên phù hợp; Cũng cần xem giờ hành lễ, giờ đón dâu phù hợp với tuổi cô dâu, chú rể.",
  },
  {
    id: 8,
    category: "Xem Ngày",
    question: "Ngày nào là ngày tốt để khai trương kinh doanh?",
    answer:
      "Ngày khai trương tốt cần: Không xung phạm với tuổi chủ; Ngày Hoàng Đạo (Thanh Long, Thiên Đức, Ngọc Đường, Tư Mệnh, Kim Quỹ, Bảo Quang); Tứ Đức, Sinh Khí theo tháng; Tránh tháng 3, tháng 7 âm lịch (tháng cô hồn). Ngoài ra cần chọn giờ phù hợp để mở cửa và thực hiện nghi lễ cúng khai trương.",
  },
];

const categories = ["Tất Cả", "Nhà Ở", "Văn Phòng", "Vật Phẩm", "Xem Ngày"];

export function QandA() {
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [openId, setOpenId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = faqs.filter((faq) => {
    const matchCategory = activeCategory === "Tất Cả" || faq.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section id="qanda" className="py-32 px-6 md:px-12 bg-gradient-to-b from-black to-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
            <span className="tracking-[0.3em] uppercase text-primary text-sm" style={{ fontWeight: 700 }}>
              Tra Cứu
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 text-white" style={{ fontWeight: 700 }}>
            Hỏi Đáp <span className="text-primary">Phong Thủy</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Giải đáp những câu hỏi thường gặp về phong thủy nhà ở, văn phòng và cuộc sống
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-8 relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi về phong thủy..."
            className="w-full bg-white/3 border border-white/10 pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 transition-all duration-300 text-sm border ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "border-white/10 text-gray-400 hover:border-primary/30 hover:text-primary"
              }`}
              style={{ fontWeight: activeCategory === cat ? 700 : 500 }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          <AnimatePresence>
            {filtered.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`border transition-all duration-300 ${
                  openId === faq.id
                    ? "border-primary/40 bg-primary/3"
                    : "border-white/8 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-start justify-between gap-4 p-6 text-left"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-primary/70 border border-primary/20 px-2 py-1 shrink-0 mt-0.5">
                      {faq.category}
                    </span>
                    <span className="text-white" style={{ fontWeight: 600 }}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`shrink-0 mt-0.5 transition-colors ${openId === faq.id ? "text-primary" : "text-gray-500"}`}>
                    {openId === faq.id ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="h-px bg-primary/10 mb-4" />
                        <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <p>Không tìm thấy câu hỏi phù hợp.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("Tất Cả"); }}
                className="text-primary/70 hover:text-primary mt-2 text-sm transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* CTA to AI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 mb-4">Không tìm thấy câu trả lời bạn cần?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#assistant"
              className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 text-primary px-8 py-3 hover:bg-primary/20 transition-all text-sm"
              style={{ fontWeight: 600 }}
            >
              Hỏi Trợ Lý AI Ngay
            </a>
            <Link
              to="/hoi-dap"
              className="inline-flex items-center gap-3 border border-gold/30 text-gold px-8 py-3 hover:bg-gold/5 transition-all text-sm"
              style={{ fontWeight: 600 }}
            >
              Xem Tất Cả Hỏi Đáp
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
