import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { getArticles, getImageUrl } from "../../lib/api";

// ─── Static UI Data ──────────────────────────────────────────────────────────

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
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tất Cả"]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchArts = async () => {
      setLoading(true);
      try {
        const res = await getArticles({ limit: 100 });
        if (res.success) {
          setArticles(res.data);
          const cats = ["Tất Cả", ...Array.from(new Set(res.data.map((a: any) => a.category_name)))].filter(Boolean) as string[];
          setCategories(cats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArts();
  }, []);

  const filtered = articles.filter((a) => {
    const matchCat = activeCategory === "Tất Cả" || a.category_name === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
      (a.category_name && a.category_name.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const featured = filtered.find((a) => a.is_featured) ?? filtered[0];
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
            {categories.map((cat) => (
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
          {loading ? (
             <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-32">
               <Loader2 className="w-10 h-10 text-gold animate-spin" />
             </motion.div>
          ) : filtered.length === 0 ? (
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
                        src={getImageUrl(featured.image_url) || "https://placehold.co/800x600/111/gold?text=Chua+Co+Hinh"}
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
                          {featured.category_name}
                        </span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl text-white uppercase tracking-wider mb-4 font-extrabold group-hover:text-gold transition-colors leading-tight">
                        {featured.title}
                      </h2>
                      <p className="text-white/50 leading-relaxed mb-6 font-light">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-6 text-xs text-white/30 uppercase tracking-wider mb-6">
                        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{featured.view_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gold text-sm font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                        {expandedId === featured.id ? "Thu gọn" : "Đọc bài viết"}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

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
                          <div className="max-w-3xl space-y-5 text-white/60 leading-relaxed" 
                               dangerouslySetInnerHTML={{__html: featured.content || "Đang cập nhật nội dung..."}}>
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
                      <div className="relative overflow-hidden aspect-video shrink-0">
                        <img
                          src={getImageUrl(article.image_url) || "https://placehold.co/800x600/111/gold?text=Chua+Co+Hinh"}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3 text-[10px] text-white/30 uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.view_count || 0}</span>
                          <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{article.category_name}</span>
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
                              <div className="text-white/50 text-sm leading-relaxed mb-4" 
                                   dangerouslySetInnerHTML={{__html: article.content || "Đang cập nhật nội dung..."}}>
                              </div>
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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
