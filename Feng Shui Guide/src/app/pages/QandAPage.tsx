import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import type { ElementType } from "react";
import { Link } from "react-router";
import {
  Plus,
  Minus,
  Search,
  X,
  ChevronRight,
  MessageCircle,
  Home,
  Briefcase,
  Gem,
  CalendarDays,
  Heart,
  Baby,
  Sparkles,
  HelpCircle,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { icon: ElementType; color: string; bg: string }> = {
  "Nhà Ở":       { icon: Home,          color: "text-green-400",  bg: "bg-green-400/10"  },
  "Văn Phòng":   { icon: Briefcase,     color: "text-blue-400",   bg: "bg-blue-400/10"   },
  "Vật Phẩm":    { icon: Gem,           color: "text-purple-400", bg: "bg-purple-400/10" },
  "Xem Ngày":    { icon: CalendarDays,  color: "text-gold",       bg: "bg-gold/10"       },
  "Hôn Nhân":    { icon: Heart,         color: "text-red-400",    bg: "bg-red-400/10"    },
  "Đặt Tên":     { icon: Baby,          color: "text-pink-400",   bg: "bg-pink-400/10"   },
  "Cải Vận":     { icon: Sparkles,      color: "text-amber-400",  bg: "bg-amber-400/10"  },
};

const FAQS = [
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
      "Không có hướng nào tốt cho tất cả mọi người. Hướng cửa chính tốt phụ thuộc vào mệnh quái của gia chủ tính theo năm sinh. Người mệnh Đông Tứ Trạch hợp hướng Đông, Đông Nam, Bắc, Nam. Người mệnh Tây Tứ Trạch hợp hướng Tây, Tây Bắc, Đông Bắc, Tây Nam.",
  },
  {
    id: 3,
    category: "Nhà Ở",
    question: "Bếp và phòng ngủ đối nhau có ảnh hưởng gì không?",
    answer:
      "Bếp đối diện phòng ngủ là một trong những bố cục xấu trong phong thủy. Hỏa khí từ bếp sẽ xung vào phòng ngủ, gây ra tình trạng ngủ không yên, dễ cãi vã trong gia đình và ảnh hưởng đến sức khỏe. Giải pháp: đặt bình phong hoặc rèm dày ngăn cách hai không gian, trồng cây có lá rậm để hóa giải.",
  },
  {
    id: 4,
    category: "Nhà Ở",
    question: "Phòng ngủ đặt gương ở đâu là hợp phong thủy?",
    answer:
      "Gương không nên đặt đối diện giường ngủ vì theo phong thủy, gương phản chiếu có thể hút mất sinh khí và gây hoảng hốt khi tỉnh giấc ban đêm. Cũng tránh đặt gương chiếu thẳng cửa phòng ngủ. Vị trí tốt nhất là gắn trong tủ quần áo hoặc đặt bên cạnh tường không đối diện giường.",
  },
  {
    id: 5,
    category: "Văn Phòng",
    question: "Bố trí bàn làm việc như thế nào là đúng phong thủy?",
    answer:
      "Bàn làm việc nên đặt: Lưng tựa tường (tàu hậu), nhìn ra cửa nhưng không ngồi thẳng trước cửa, không ngồi dưới xà ngang, không quay lưng ra cửa sổ lớn. Vị trí lý tưởng là góc chéo với cửa ra vào. Trên bàn nên gọn gàng, đặt cây nhỏ bên trái để kích hoạt Thanh Long.",
  },
  {
    id: 6,
    category: "Văn Phòng",
    question: "Màu sắc nào phù hợp cho không gian làm việc?",
    answer:
      "Màu sắc phụ thuộc vào mệnh và hướng văn phòng: Xanh lá (Mộc) tốt cho sáng tạo, vàng/nâu (Thổ) tốt cho sự ổn định, trắng/xám (Kim) tốt cho tổ chức. Tránh dùng quá nhiều đỏ hoặc đen. Kết hợp màu chủ đạo của mệnh sẽ mang lại hiệu quả làm việc tốt nhất.",
  },
  {
    id: 7,
    category: "Văn Phòng",
    question: "Cây gì nên đặt trong văn phòng để hút tài lộc?",
    answer:
      "Các loại cây tốt cho văn phòng: Kim Tiền (thu hút tài lộc), Phát Tài (mang lại may mắn sự nghiệp), Trúc Phát Tài (biểu tượng của sự phát triển bền vững), Thiên Môn Đông (thanh lọc không khí và năng lượng). Đặt cây ở góc Đông Nam (cung Tốn – chủ về tài lộc) hoặc bên trái bàn làm việc.",
  },
  {
    id: 8,
    category: "Vật Phẩm",
    question: "Nên đặt tượng Phật ở đâu trong nhà?",
    answer:
      "Tượng Phật nên đặt ở nơi trang trọng, sạch sẽ, thoáng đãng. Chiều cao tượng phải ngang mắt hoặc cao hơn. Không đặt trong phòng ngủ, nhà tắm, bếp. Tốt nhất là đặt ở phòng khách, quay mặt về hướng cửa chính. Không đặt đối diện nhà vệ sinh hoặc nơi có sát khí.",
  },
  {
    id: 9,
    category: "Vật Phẩm",
    question: "Trầm hương có tác dụng phong thủy gì?",
    answer:
      "Trầm hương có nhiều công dụng phong thủy: Thanh lọc năng lượng âm, xua tan sát khí và khí trọc; An thần, giảm stress, cải thiện giấc ngủ; Khai mở trí tuệ, tăng vận học hành; Kết nối năng lượng tâm linh trong cúng bái. Dùng nhang trầm hoặc đặt gỗ trầm trong không gian giúp cân bằng âm dương.",
  },
  {
    id: 10,
    category: "Vật Phẩm",
    question: "Tỳ Hưu nên đặt hướng nào và ở đâu?",
    answer:
      "Tỳ Hưu nên đặt trên bàn làm việc hoặc tủ thờ tài thần, đầu hướng ra cửa sổ hoặc cửa chính để chiêu tài từ bên ngoài vào. Không đặt trên sàn hoặc nơi thấp hơn thắt lưng. Tỳ Hưu theo cặp (một đực, một cái) sẽ hiệu quả hơn, đực đặt bên trái, cái bên phải.",
  },
  {
    id: 11,
    category: "Xem Ngày",
    question: "Xem ngày cưới cần lưu ý những gì?",
    answer:
      "Khi xem ngày cưới cần xét: Tuổi hai người và tam hợp, lục hợp với nhau; Tránh ngày xung, hại, phá với tuổi; Tránh ngày Sát Chủ (ngày xung với chủ hôn); Ưu tiên các ngày Hoàng Đạo Lục Hợp; Cũng cần xem giờ hành lễ, giờ đón dâu phù hợp với tuổi cô dâu, chú rể.",
  },
  {
    id: 12,
    category: "Xem Ngày",
    question: "Ngày nào tốt để khai trương kinh doanh?",
    answer:
      "Ngày khai trương tốt cần: Không xung phạm với tuổi chủ; Ngày Hoàng Đạo (Thanh Long, Thiên Đức, Ngọc Đường, Tư Mệnh, Kim Quỹ, Bảo Quang); Tứ Đức, Sinh Khí theo tháng; Tránh tháng 3, tháng 7 âm lịch. Ngoài ra cần chọn giờ phù hợp để mở cửa và thực hiện nghi lễ cúng khai trương.",
  },
  {
    id: 13,
    category: "Xem Ngày",
    question: "Xem ngày động thổ xây nhà như thế nào?",
    answer:
      "Ngày động thổ quan trọng với tuổi gia chủ và hướng nhà. Cần chọn ngày: Không tam, tứ hại với tuổi gia chủ; Ngày Thiên Đức, Nguyệt Đức, Hoàng Đạo; Không rơi vào ngày Nguyệt Phá, Thụ Tử; Giờ động thổ phù hợp với tuổi. Nên xem thêm tuổi cả gia đình để chọn ngày hài hòa nhất.",
  },
  {
    id: 14,
    category: "Hôn Nhân",
    question: "Hợp tuổi là gì và tại sao quan trọng trong hôn nhân?",
    answer:
      "Hợp tuổi trong phong thủy là sự tương hợp của Can Chi năm sinh giữa hai người. Các mức độ hợp: Lục Hợp (hợp hoàn toàn – tốt nhất), Tam Hợp (hợp theo cục – rất tốt), Tam Hòa (không xung không hợp – trung tính). Tránh: Tứ Hành Xung, Tương Hại, Tương Phá. Tuy nhiên, hợp tuổi chỉ là một yếu tố – tình cảm và sự tôn trọng lẫn nhau vẫn quan trọng hơn.",
  },
  {
    id: 15,
    category: "Hôn Nhân",
    question: "Tuổi Dần và Thân có lấy nhau được không?",
    answer:
      "Dần và Thân là hai chi Tứ Hành Xung (Dần – Thân – Tỵ – Hợi xung nhau). Trong phong thủy truyền thống, đây được xem là tổ hợp tuổi xấu, thường dẫn đến bất hòa, tranh cãi. Tuy nhiên, nếu Can năm sinh tương sinh hoặc một bên có Can hóa giải, tác động xung có thể giảm nhẹ. Cần xem Tứ Trụ toàn diện để đánh giá chính xác.",
  },
  {
    id: 16,
    category: "Đặt Tên",
    question: "Đặt tên theo phong thủy cần dựa vào yếu tố nào?",
    answer:
      "Đặt tên theo phong thủy cần căn cứ: Ngũ Hành của tên (số nét trong từng chữ theo Khang Hy tự điển); Mệnh Ngũ Hành của đứa trẻ (từ giờ, ngày, tháng, năm sinh); Họ cha – tên phải tương sinh; Ý nghĩa tốt đẹp của chữ; Âm thanh khi đọc tên đầy đủ phải hài hòa. Tên tốt là tên bổ sung những hành còn thiếu trong Tứ Trụ.",
  },
  {
    id: 17,
    category: "Đặt Tên",
    question: "Số nét tên tốt theo phong thủy là bao nhiêu?",
    answer:
      "Theo Hán Tự Học, một số tổ hợp số nét tốt: 3-5-8-11-13-15-16-21-23-24-25-31-32 được xem là cát. Số nét cần xem theo tổng ba bộ: Thiên Cách (tên + 1), Nhân Cách (họ + tên đệm), Địa Cách (tên đệm + tên + 1). Tuy nhiên đây là phương pháp phức tạp, nên nhờ chuyên gia để có kết quả chính xác.",
  },
  {
    id: 18,
    category: "Cải Vận",
    question: "Cải vận bằng phong thủy có hiệu quả thật không?",
    answer:
      "Phong thủy tác động đến 30-40% vận mệnh con người (thiên thời – địa lợi – nhân hòa). Cải vận phong thủy không thay thế được nỗ lực cá nhân, nhưng tạo ra môi trường năng lượng thuận lợi để phát huy tối đa tiềm năng. Các phương pháp cải vận: Điều chỉnh bố cục không gian sống, đeo vật phẩm hợp mệnh, chọn màu sắc phù hợp, xem ngày thực hiện việc quan trọng.",
  },
  {
    id: 19,
    category: "Cải Vận",
    question: "Năm Hạn Tam Tai là gì và cách hóa giải?",
    answer:
      "Tam Tai là chu kỳ 3 năm liên tiếp gặp nhiều trắc trở theo tuổi. Mỗi tuổi trải qua Tam Tai khoảng 3 lần trong đời. Cách hóa giải: Đeo vòng đeo tay bằng chất liệu hợp mệnh, thờ cúng thêm tại gia, tránh các quyết định lớn trong năm Tam Tai nặng nhất, có thể nhờ thầy làm lễ giải Tam Tai theo tập tục truyền thống.",
  },
  {
    id: 20,
    category: "Cải Vận",
    question: "Màu sắc quần áo có ảnh hưởng đến vận mệnh không?",
    answer:
      "Có, màu sắc mang năng lượng Ngũ Hành. Mặc màu hợp mệnh giúp tăng cường năng lượng tích cực: Mệnh Kim mặc vàng/trắng/xám; Mệnh Mộc mặc xanh lá/xanh lam; Mệnh Thủy mặc đen/xanh đen; Mệnh Hỏa mặc đỏ/cam/hồng; Mệnh Thổ mặc vàng nâu/be. Đặc biệt quan trọng trong những ngày phỏng vấn, gặp đối tác hoặc đám cưới.",
  },
];

const CATEGORIES = ["Tất Cả", "Nhà Ở", "Văn Phòng", "Vật Phẩm", "Xem Ngày", "Hôn Nhân", "Đặt Tên", "Cải Vận"];

// ─── Component ────────────────────────────────────────────────────────────────

export function QandAPage() {
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchCat = activeCategory === "Tất Cả" || faq.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Group by category for display
  const grouped = useMemo(() => {
    if (activeCategory !== "Tất Cả" || searchQuery) return null;
    const map: Record<string, typeof FAQS> = {};
    FAQS.forEach((faq) => {
      if (!map[faq.category]) map[faq.category] = [];
      map[faq.category].push(faq);
    });
    return map;
  }, [activeCategory, searchQuery]);

  const displayList = grouped ? null : filtered;

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-[500px] h-[250px] bg-red-800/8 rounded-full blur-[100px]" />
          <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-gold/5 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-widest mb-8">
            <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">Hỏi Đáp Phong Thủy</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500" />
              <span className="tracking-[0.3em] uppercase text-red-400 text-xs font-bold">Tra Cứu</span>
            </div>
            <h1 className="text-4xl md:text-6xl uppercase tracking-widest mb-4 text-white font-extrabold leading-none">
              Hỏi Đáp <span className="text-red-400">Phong Thủy</span>
            </h1>
            <p className="text-white/40 leading-relaxed font-light max-w-xl mb-8">
              Giải đáp{" "}
              <span className="text-gold font-bold">{FAQS.length}+</span> câu hỏi
              thường gặp về phong thủy nhà ở, văn phòng, hôn nhân và cuộc sống.
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm câu hỏi phong thủy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 pl-11 pr-10 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/40 transition-colors rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Category Quick-access Cards ── */}
      {!searchQuery && activeCategory === "Tất Cả" && (
        <div className="border-b border-white/5 bg-white/[0.01]">
          <div className="container mx-auto px-6 py-6">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {Object.entries(CATEGORY_META).map(([cat, meta]) => {
                const count = FAQS.filter((f) => f.category === cat).length;
                return (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -3 }}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl border border-white/8 ${meta.bg} hover:border-white/20 transition-all duration-200`}
                  >
                    <meta.icon className={`w-4 h-4 ${meta.color}`} />
                    <div className="text-left">
                      <p className="text-white text-xs font-bold uppercase tracking-wider leading-none">{cat}</p>
                      <p className="text-white/30 text-[10px] mt-0.5">{count} câu hỏi</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Category Tabs ── */}
      <div className="border-b border-white/5 sticky top-[64px] z-30 bg-black/95 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenId(null); }}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest transition-all duration-200 rounded-lg font-bold
                    ${activeCategory === cat
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {meta && <meta.icon className="w-3 h-3" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FAQ Content ── */}
      <div className="container mx-auto px-6 py-12">

        {/* Status bar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-white/30 text-sm">
            <span className="text-gold font-bold">{filtered.length}</span> câu hỏi
            {activeCategory !== "Tất Cả" && (
              <> về <span className="text-red-400/80">{activeCategory}</span></>
            )}
          </p>
          {(searchQuery || activeCategory !== "Tất Cả") && (
            <button
              onClick={() => { setActiveCategory("Tất Cả"); setSearchQuery(""); setOpenId(null); }}
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" /> Xóa bộ lọc
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Empty state ── */}
          {filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <HelpCircle className="w-12 h-12 text-gold/20 mb-4" />
              <p className="text-white/30 text-lg uppercase tracking-widest mb-6">Không tìm thấy câu hỏi</p>
              <button
                onClick={() => { setActiveCategory("Tất Cả"); setSearchQuery(""); }}
                className="px-8 py-3 border border-gold/30 text-gold text-xs uppercase tracking-[0.3em] hover:bg-gold/5 transition-all"
              >
                Xem tất cả
              </button>
            </motion.div>
          )}

          {/* ── Search / filtered results ── */}
          {displayList && displayList.length > 0 && (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-3"
            >
              {displayList.map((faq, index) => (
                <FaqItem
                  key={faq.id}
                  faq={faq}
                  index={index}
                  isOpen={openId === faq.id}
                  onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                />
              ))}
            </motion.div>
          )}

          {/* ── Grouped by category (default view) ── */}
          {grouped && (
            <motion.div
              key="grouped"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-14 max-w-4xl mx-auto"
            >
              {Object.entries(grouped).map(([cat, items]) => {
                const meta = CATEGORY_META[cat];
                return (
                  <div key={cat}>
                    {/* Category header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center`}>
                        <meta.icon className={`w-5 h-5 ${meta.color}`} />
                      </div>
                      <div>
                        <h2 className="text-white font-bold uppercase tracking-widest">{cat}</h2>
                        <p className="text-white/30 text-xs">{items.length} câu hỏi</p>
                      </div>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <div className="space-y-3">
                      {items.map((faq, idx) => (
                        <FaqItem
                          key={faq.id}
                          faq={faq}
                          index={idx}
                          isOpen={openId === faq.id}
                          onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CTA ── */}
      <div className="container mx-auto px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* AI Assistant */}
          <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-white font-bold uppercase tracking-widest mb-2">Trợ Lý AI</h3>
              <p className="text-white/40 text-sm mb-6 leading-relaxed font-light">
                Không tìm được câu trả lời? Hỏi trực tiếp Trợ Lý AI Phong Thủy của chúng tôi để được giải đáp tức thì.
              </p>
              <Link to="/#assistant">
                <button className="flex items-center gap-2 px-6 py-3 bg-gold text-black text-xs uppercase tracking-widest font-bold hover:bg-gold/90 transition-all rounded-xl shadow-lg shadow-gold/20">
                  Hỏi Ngay <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Direct Consultation */}
          <div className="relative overflow-hidden rounded-2xl border border-red-600/20 bg-gradient-to-br from-red-900/10 to-transparent p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-5">
                <MessageCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-bold uppercase tracking-widest mb-2">Tư Vấn Trực Tiếp</h3>
              <p className="text-white/40 text-sm mb-6 leading-relaxed font-light">
                Đặt lịch tư vấn 1-1 với Thầy Song Vũ để được phân tích chuyên sâu và cá nhân hóa theo mệnh của bạn.
              </p>
              <Link to="/#contact">
                <button className="flex items-center gap-2 px-6 py-3 border border-red-600/40 text-red-400 text-xs uppercase tracking-widest font-bold hover:bg-red-600/10 transition-all rounded-xl">
                  Đặt Lịch Ngay <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── FAQ Item Sub-component ────────────────────────────────────────────────────

interface FaqItemProps {
  faq: (typeof FAQS)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ faq, index, isOpen, onToggle }: FaqItemProps) {
  const meta = CATEGORY_META[faq.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`border rounded-2xl overflow-hidden transition-all duration-300
        ${isOpen
          ? "border-red-500/30 bg-red-900/5"
          : "border-white/5 hover:border-white/15 bg-white/[0.02]"
        }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-5 text-left"
      >
        <div className="flex items-start gap-3">
          {meta && (
            <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
              <meta.icon className={`w-4 h-4 ${meta.color}`} />
            </div>
          )}
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold block mb-1">
              {faq.category}
            </span>
            <span className="text-white font-semibold leading-snug text-sm">
              {faq.question}
            </span>
          </div>
        </div>
        <div className={`shrink-0 mt-1 transition-colors duration-200 ${isOpen ? "text-red-400" : "text-white/30"}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 pl-16">
              <div className="h-px bg-red-500/10 mb-4" />
              <p className="text-white/55 leading-relaxed text-sm font-light">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}