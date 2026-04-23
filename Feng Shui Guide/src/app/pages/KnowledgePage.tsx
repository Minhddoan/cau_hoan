import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  ChevronRight,
  Clock,
  Eye,
  Tag,
  Search,
  X,
  Flame,
  Droplets,
  Wind,
  Mountain,
  CircleDot,
  Compass,
  Home,
  Star,
  ArrowRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Tất Cả",
  "Ngũ Hành",
  "Bát Trạch",
  "Huyền Không",
  "Tứ Trụ",
  "Phong Thủy Nhà Ở",
  "Phong Thủy Kinh Doanh",
];

const ARTICLES = [
  {
    id: 1,
    category: "Ngũ Hành",
    title: "Ngũ Hành – Triết Lý Vũ Trụ Á Đông",
    excerpt:
      "Năm yếu tố Kim – Mộc – Thủy – Hỏa – Thổ tạo nên sự vận hành của vũ trụ. Hiểu về Ngũ Hành là nền tảng để ứng dụng phong thủy vào cuộc sống.",
    image: "https://images.unsplash.com/photo-1498938271812-01861258f1a6?w=800",
    readTime: "8 phút",
    views: "12.4K",
    featured: true,
    icon: Flame,
    color: "text-red-400",
    tags: ["Căn Bản", "Ngũ Hành"],
  },
  {
    id: 2,
    category: "Bát Trạch",
    title: "Nguyên Lý Bát Trạch – Phân Tích 8 Cung Vị",
    excerpt:
      "Bát Trạch chia không gian nhà ở thành 8 cung vị tương ứng 8 hướng địa lý, mỗi cung mang năng lượng riêng. Tìm hiểu cách xác định cung vị của bạn.",
    image: "https://images.unsplash.com/photo-1556117153-659e8ce704c1?w=800",
    readTime: "10 phút",
    views: "9.1K",
    featured: false,
    icon: Compass,
    color: "text-gold",
    tags: ["Phong Thủy Căn Bản", "Bát Trạch"],
  },
  {
    id: 3,
    category: "Huyền Không",
    title: "Huyền Không Phi Tinh – Hệ Thống Nâng Cao",
    excerpt:
      "Huyền Không Phi Tinh phân tích 9 ngôi sao năng lượng di chuyển theo thời gian, giúp dự đoán vận khí từng năm, từng tháng trong không gian sống.",
    image: "https://images.unsplash.com/photo-1730627584454-fcbac9544df6?w=800",
    readTime: "12 phút",
    views: "7.8K",
    featured: false,
    icon: Star,
    color: "text-purple-400",
    tags: ["Nâng Cao", "Huyền Không"],
  },
  {
    id: 4,
    category: "Tứ Trụ",
    title: "Tứ Trụ Mệnh Số – Bản Đồ Cuộc Đời",
    excerpt:
      "Bốn trụ Năm – Tháng – Ngày – Giờ sinh tạo nên bản đồ vận mệnh. Phân tích Tứ Trụ giúp hiểu điểm mạnh, điểm yếu và định hướng sự nghiệp, hôn nhân.",
    image: "https://images.unsplash.com/photo-1736608152641-1bbe23152556?w=800",
    readTime: "15 phút",
    views: "11.2K",
    featured: false,
    icon: BookOpen,
    color: "text-blue-400",
    tags: ["Mệnh Học", "Tứ Trụ"],
  },
  {
    id: 5,
    category: "Phong Thủy Nhà Ở",
    title: "Cách Bố Trí Phòng Khách Theo Phong Thủy",
    excerpt:
      "Phòng khách là bộ mặt của căn nhà và tụ điểm khí trường. Hướng sofa, vị trí tivi, cây xanh và màu sắc đều ảnh hưởng đến vượng khí của gia đình.",
    image: "https://images.unsplash.com/photo-1556117153-659e8ce704c1?w=800&crop=entropy",
    readTime: "7 phút",
    views: "15.6K",
    featured: false,
    icon: Home,
    color: "text-green-400",
    tags: ["Nhà Ở", "Thực Hành"],
  },
  {
    id: 6,
    category: "Phong Thủy Nhà Ở",
    title: "Phong Thủy Phòng Ngủ – Ngủ Ngon, Khỏe Mạnh",
    excerpt:
      "Đầu giường đặt hướng nào? Gương có nên treo trong phòng ngủ? Màu sắc nào mang lại giấc ngủ sâu? Tất cả bí quyết phong thủy phòng ngủ cho bạn.",
    image: "https://images.unsplash.com/photo-1604680124443-5610f57efe0d?w=800",
    readTime: "9 phút",
    views: "18.3K",
    featured: false,
    icon: Home,
    color: "text-indigo-400",
    tags: ["Nhà Ở", "Sức Khỏe"],
  },
  {
    id: 7,
    category: "Phong Thủy Kinh Doanh",
    title: "Phong Thủy Văn Phòng – Thu Hút Tài Lộc",
    excerpt:
      "Vị trí bàn giám đốc, hướng cửa chính công ty, màu sắc thương hiệu và cách bài trí văn phòng theo phong thủy giúp tăng doanh thu và thuận hòa nội bộ.",
    image: "https://images.unsplash.com/photo-1583122078166-d3c8cde5a72e?w=800",
    readTime: "11 phút",
    views: "8.9K",
    featured: false,
    icon: Compass,
    color: "text-amber-400",
    tags: ["Kinh Doanh", "Tài Lộc"],
  },
  {
    id: 8,
    category: "Ngũ Hành",
    title: "Vòng Tương Sinh Tương Khắc Của Ngũ Hành",
    excerpt:
      "Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim. Nắm vững quy luật này để ứng dụng màu sắc, vật liệu và vị trí trong không gian sống.",
    image: "https://images.unsplash.com/photo-1750254218520-e3fbbd071bfd?w=800",
    readTime: "6 phút",
    views: "6.4K",
    featured: false,
    icon: CircleDot,
    color: "text-gray-300",
    tags: ["Ngũ Hành", "Căn Bản"],
  },
  {
    id: 9,
    category: "Phong Thủy Kinh Doanh",
    title: "Xem Ngày Khai Trương – Chọn Giờ Hoàng Đạo",
    excerpt:
      "Khai trương đúng ngày, đúng giờ là bước khởi đầu thuận lợi cho doanh nghiệp. Hướng dẫn chi tiết cách tính ngày tốt theo tuổi chủ và loại hình kinh doanh.",
    image: "https://images.unsplash.com/photo-1580524764788-08f860f58f50?w=800",
    readTime: "13 phút",
    views: "5.7K",
    featured: false,
    icon: BookOpen,
    color: "text-gold",
    tags: ["Xem Ngày", "Kinh Doanh"],
  },
];

const FIVE_ELEMENTS = [
  {
    element: "Kim",
    icon: CircleDot,
    color: "text-gray-200",
    borderColor: "border-gray-400/30",
    bgColor: "bg-gray-400/5",
    hoverBg: "hover:bg-gray-400/10",
    description: "Vững chắc & Quyết đoán",
    season: "Mùa Thu · Hướng Tây",
  },
  {
    element: "Mộc",
    icon: Wind,
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/5",
    hoverBg: "hover:bg-green-500/10",
    description: "Tăng trưởng & Sáng tạo",
    season: "Mùa Xuân · Hướng Đông",
  },
  {
    element: "Thủy",
    icon: Droplets,
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/5",
    hoverBg: "hover:bg-blue-500/10",
    description: "Lưu chuyển & Trí tuệ",
    season: "Mùa Đông · Hướng Bắc",
  },
  {
    element: "Hỏa",
    icon: Flame,
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/5",
    hoverBg: "hover:bg-red-500/10",
    description: "Đam mê & Tỏa sáng",
    season: "Mùa Hạ · Hướng Nam",
  },
  {
    element: "Thổ",
    icon: Mountain,
    color: "text-amber-500",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/5",
    hoverBg: "hover:bg-amber-500/10",
    description: "Ổn định & Nuôi dưỡng",
    season: "Giao Thời · Trung Tâm",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = ARTICLES.filter((a) => {
    const matchCat = activeCategory === "Tất Cả" || a.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.find((a) => a.featured) ?? filtered[0];
  const rest = filtered.filter((a) => a.id !== featured?.id);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-red-800/8 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-widest mb-8">
            <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">Kiến Thức Phong Thủy</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
              <span className="tracking-[0.3em] uppercase text-gold text-xs font-bold">Góc Phong Thủy</span>
            </div>
            <h1 className="text-4xl md:text-6xl uppercase tracking-widest mb-4 text-white font-extrabold leading-none">
              Kho Tàng <span className="text-gold">Kiến Thức</span>
            </h1>
            <p className="text-white/40 leading-relaxed font-light max-w-xl mb-8">
              Khám phá kho tàng tri thức phong thủy từ cơ bản đến nâng cao,
              được biên soạn chuyên sâu bởi Thầy Song Vũ.
            </p>

            {/* Search */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 pl-11 pr-10 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/40 transition-colors rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Ngũ Hành Banner ── */}
      <div className="border-b border-white/5 bg-white/[0.01]">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-5 gap-3">
            {FIVE_ELEMENTS.map((el, i) => (
              <motion.button
                key={el.element}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => {
                  setActiveCategory("Ngũ Hành");
                  setSearchQuery(el.element);
                }}
                className={`border ${el.borderColor} ${el.bgColor} ${el.hoverBg} p-4 text-center group transition-all duration-300 rounded-xl`}
              >
                <div className={`text-2xl mb-1 ${el.color} font-extrabold`}>{el.element}</div>
                <el.icon className={`w-4 h-4 ${el.color} mx-auto mb-1.5 opacity-50`} strokeWidth={1.5} />
                <p className="text-white/40 text-[10px] uppercase tracking-wider leading-tight">{el.description}</p>
                <p className="text-white/20 text-[9px] mt-1">{el.season}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="border-b border-white/5 sticky top-[64px] z-30 bg-black/95 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearchQuery(""); }}
                className={`shrink-0 px-5 py-2 text-xs uppercase tracking-widest transition-all duration-200 rounded-lg font-bold
                  ${activeCategory === cat
                    ? "bg-gold text-black shadow-lg shadow-gold/20"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-6 py-12">

        {/* Result info */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-white/30 text-sm">
            <span className="text-gold font-bold">{filtered.length}</span> bài viết
            {activeCategory !== "Tất Cả" && (
              <span className="ml-2 text-white/20">trong <span className="text-gold/60">{activeCategory}</span></span>
            )}
          </p>
          {(searchQuery || activeCategory !== "Tất Cả") && (
            <button
              onClick={() => { setActiveCategory("Tất Cả"); setSearchQuery(""); }}
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" /> Xóa bộ lọc
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <Search className="w-10 h-10 text-gold/20 mb-4" />
              <p className="text-white/30 text-lg uppercase tracking-widest mb-6">Không tìm thấy bài viết</p>
              <button
                onClick={() => { setActiveCategory("Tất Cả"); setSearchQuery(""); }}
                className="px-8 py-3 border border-gold/30 text-gold text-xs uppercase tracking-[0.3em] hover:bg-gold/5 transition-all"
              >
                Xem tất cả
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >

              {/* Featured Article */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500 mb-10 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === featured.id ? null : featured.id)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative overflow-hidden aspect-[16/9] lg:aspect-auto lg:min-h-[320px]">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 lg:block hidden" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-gold text-black text-[9px] uppercase tracking-[0.2em] font-bold rounded-full">
                          Nổi Bật
                        </span>
                      </div>
                    </div>
                    <div className="p-8 lg:p-10 flex flex-col justify-center bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-[10px] uppercase tracking-[0.2em] font-bold rounded-full">
                          {featured.category}
                        </span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl text-white uppercase tracking-wider mb-4 font-extrabold group-hover:text-gold transition-colors leading-tight">
                        {featured.title}
                      </h2>
                      <p className="text-white/50 leading-relaxed mb-6 font-light">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-6 text-xs text-white/30 uppercase tracking-wider mb-6">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{featured.views}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gold text-sm font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                        {expandedId === featured.id ? "Thu gọn" : "Đọc bài viết"}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedId === featured.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden border-t border-gold/10"
                      >
                        <div className="p-8 lg:p-10 bg-white/[0.02]">
                          <div className="max-w-3xl space-y-5 text-white/60 leading-relaxed">
                            <p>
                              Ngũ Hành là học thuyết cơ bản nhất trong triết học Á Đông, xuất hiện từ thời nhà Chu
                              (khoảng 1046 – 256 TCN). Học thuyết cho rằng vũ trụ được cấu thành bởi năm loại vật chất
                              và năng lượng cơ bản: Kim, Mộc, Thủy, Hỏa, Thổ – và mọi hiện tượng tự nhiên đều là biểu
                              hiện của sự tương tác giữa chúng.
                            </p>
                            <p>
                              Trong phong thủy, Ngũ Hành được ứng dụng để phân tích không gian sống, chọn màu sắc trang trí,
                              xác định hướng nhà, chọn vật phẩm phù hợp và thậm chí đặt tên cho con cái. Mỗi con người
                              khi sinh ra đều mang trong mình một mệnh thuộc một trong 5 hành, và cuộc sống sẽ thuận lợi
                              hơn khi được hỗ trợ bởi những yếu tố hợp mệnh.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                              {[
                                { title: "Vòng Tương Sinh", content: "Kim → Thủy → Mộc → Hỏa → Thổ → Kim. Hành này sinh ra hành kia, tạo nên chu kỳ nuôi dưỡng và phát triển." },
                                { title: "Vòng Tương Khắc", content: "Kim khắc Mộc, Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim. Kiểm soát và cân bằng lẫn nhau." },
                              ].map((block) => (
                                <div key={block.title} className="bg-white/5 border border-gold/10 p-5 rounded-xl">
                                  <h4 className="text-gold font-bold uppercase tracking-widest text-sm mb-3">{block.title}</h4>
                                  <p className="text-white/50 text-sm leading-relaxed">{block.content}</p>
                                </div>
                              ))}
                            </div>
                            <p>
                              Để biết mệnh của mình thuộc hành nào và cách ứng dụng Ngũ Hành vào cuộc sống, hãy liên hệ
                              với Thầy Song Vũ để được tư vấn chuyên sâu và cá nhân hóa.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Article Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="group bg-white/[0.02] border border-white/5 hover:border-gold/25 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer flex flex-col"
                      onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                    >
                      {/* Thumbnail */}
                      <div className="relative overflow-hidden aspect-video shrink-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
                          {article.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-gold text-[9px] uppercase tracking-wider font-bold rounded-full border border-gold/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3 text-[10px] text-white/30 uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.views}</span>
                          <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{article.category}</span>
                        </div>

                        <h3 className="text-white uppercase tracking-wider mb-3 font-bold group-hover:text-gold transition-colors leading-tight flex-1">
                          {article.title}
                        </h3>

                        <p className="text-white/40 text-sm leading-relaxed line-clamp-2 font-light mb-4">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center gap-2 text-gold/70 text-xs uppercase tracking-widest group-hover:text-gold group-hover:gap-3 transition-all font-bold">
                          {expandedId === article.id ? "Thu gọn" : "Đọc tiếp"}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Expandable content */}
                      <AnimatePresence>
                        {expandedId === article.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-2 border-t border-gold/10">
                              <p className="text-white/50 text-sm leading-relaxed mb-4">{article.excerpt}</p>
                              <p className="text-white/40 text-sm leading-relaxed">
                                Để tìm hiểu sâu hơn về chủ đề <span className="text-gold">{article.category}</span> và
                                nhận tư vấn cá nhân hóa theo tuổi, mệnh và không gian sống, hãy liên hệ trực tiếp với
                                Thầy Song Vũ qua hệ thống đặt lịch trực tuyến.
                              </p>
                              <button className="mt-4 flex items-center gap-2 text-xs text-gold/70 hover:text-gold uppercase tracking-widest transition-colors font-bold">
                                Đặt lịch tư vấn <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CTA Banner ── */}
      <div className="container mx-auto px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/5 via-transparent to-red-900/5 p-10 text-center"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/4 top-0 w-64 h-32 bg-gold/10 rounded-full blur-[60px]" />
            <div className="absolute right-1/4 bottom-0 w-64 h-32 bg-red-700/10 rounded-full blur-[60px]" />
          </div>
          <div className="relative z-10">
            <p className="text-gold text-xs uppercase tracking-[0.3em] font-bold mb-3">Tư Vấn Cá Nhân</p>
            <h3 className="text-2xl md:text-3xl text-white uppercase tracking-widest font-bold mb-3">
              Không Tìm Được Kiến Thức Bạn Cần?
            </h3>
            <p className="text-white/40 mb-8 max-w-xl mx-auto font-light">
              Hỏi trực tiếp Trợ Lý AI Phong Thủy của chúng tôi hoặc đặt lịch tư vấn 1-1 với Thầy Song Vũ
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/#assistant">
                <button className="px-8 py-3.5 bg-gold text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 rounded-xl">
                  Hỏi Trợ Lý AI
                </button>
              </Link>
              <Link to="/hoi-dap">
                <button className="px-8 py-3.5 border border-gold/30 text-gold text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold/5 transition-all rounded-xl">
                  Xem Hỏi Đáp
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
