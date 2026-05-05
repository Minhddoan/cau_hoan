import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
  ShoppingCart,
  Star,
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext.tsx";
import { toast } from "sonner";
import { getProducts, getProductCategories, getImageUrl } from "../../lib/api";

const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: 0, max: 999999999 },
  { label: "Dưới 3 triệu", min: 0, max: 3000000 },
  { label: "3 – 7 triệu", min: 3000000, max: 7000000 },
  { label: "7 – 15 triệu", min: 7000000, max: 15000000 },
  { label: "Trên 15 triệu", min: 15000000, max: 999999999 },
];

const SORT_OPTIONS = [
  { label: "Nổi bật nhất", value: "featured" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
  { label: "Đánh giá cao nhất", value: "rating" },
  { label: "Đánh giá nhiều nhất", value: "reviews" },
];

export function ProductsPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategorySlug, setActiveCategorySlug] = useState("");
  const [activePriceIdx, setActivePriceIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("featured");
  
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getProductCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products based on filters
  useEffect(() => {
    const fetchProds = async () => {
      setLoading(true);
      try {
        const range = PRICE_RANGES[activePriceIdx];
        const params: any = {
          limit: 100, // For demo, fetch a large chunk
          min_price: range.min,
          max_price: range.max,
        };
        if (activeCategorySlug) params.category = activeCategorySlug;
        if (searchQuery.trim()) params.search = searchQuery;
        if (sortValue !== "featured") {
          params.sort = sortValue;
        }

        const res = await getProducts(params);
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải sản phẩm. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    
    // Add debounce for search query
    const debounceId = setTimeout(() => {
      fetchProds();
    }, 500);
    return () => clearTimeout(debounceId);
  }, [activeCategorySlug, activePriceIdx, searchQuery, sortValue]);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: getImageUrl(product.image_url),
      category: product.category_name,
    });
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const resetFilters = () => {
    setActiveCategorySlug("");
    setActivePriceIdx(0);
    setSearchQuery("");
    setSortValue("featured");
  };

  const hasFilters =
    activeCategorySlug !== "" ||
    activePriceIdx !== 0 ||
    searchQuery.trim() !== "";

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortValue)?.label ?? "Nổi bật nhất";

  const getCategoryName = (slug: string) => {
    if (!slug) return "Tất Cả";
    return categories.find(c => c.slug === slug)?.name || slug;
  };

  const FilterPanel = () => (
    <div className="space-y-10">
      {/* Search */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4">
          Tìm kiếm
        </p>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
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
      </div>

      {/* Categories */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4">
          Danh Mục
        </p>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveCategorySlug("")}
              className={`w-full text-left px-4 py-2.5 text-sm uppercase tracking-wider transition-all duration-200 rounded-lg flex items-center justify-between
                ${
                  activeCategorySlug === ""
                    ? "bg-gold/10 text-gold border border-gold/20 font-bold"
                    : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
            >
              Tất cả
              {activeCategorySlug === "" && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`w-full text-left px-4 py-2.5 text-sm uppercase tracking-wider transition-all duration-200 rounded-lg flex items-center justify-between
                  ${
                    activeCategorySlug === cat.slug
                      ? "bg-gold/10 text-gold border border-gold/20 font-bold"
                      : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
              >
                {cat.name}
                {activeCategorySlug === cat.slug && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-4">
          Mức Giá
        </p>
        <ul className="space-y-1">
          {PRICE_RANGES.map((range, idx) => (
            <li key={range.label}>
              <button
                onClick={() => setActivePriceIdx(idx)}
                className={`w-full text-left px-4 py-2.5 text-sm uppercase tracking-wider transition-all duration-200 rounded-lg flex items-center justify-between
                  ${
                    activePriceIdx === idx
                      ? "bg-gold/10 text-gold border border-gold/20 font-bold"
                      : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
              >
                {range.label}
                {activePriceIdx === idx && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset */}
      {hasFilters && (
        <button
          onClick={resetFilters}
          className="w-full py-3 border border-white/10 text-white/40 hover:text-white hover:border-white/30 text-xs uppercase tracking-[0.2em] transition-all rounded-lg flex items-center justify-center gap-2"
        >
          <X className="w-3 h-3" /> Xóa bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 via-black to-black pointer-events-none" />
        <div className="container mx-auto px-6 py-16 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-widest mb-8">
            <Link to="/" className="hover:text-gold transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">Vật Phẩm Phong Thủy</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
              <span className="tracking-[0.3em] uppercase text-gold text-xs font-bold">
                Bộ Sưu Tập
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl uppercase tracking-widest mb-4 text-white font-extrabold leading-none">
              Vật Phẩm <span className="text-gold">Phong Thủy</span>
            </h1>
            <p className="text-white/40 leading-relaxed font-light max-w-xl">
              Linh vật, trầm hương và trang sức được chọn lọc khắt khe, trì chú bởi Thầy Song Vũ, mang lại bình an, tài lộc và may mắn.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-8">
                <SlidersHorizontal className="w-4 h-4 text-gold" />
                <span className="text-white font-bold text-sm uppercase tracking-widest">
                  Bộ Lọc
                </span>
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Right Column */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-gold/40 transition-all text-sm uppercase tracking-wider"
              >
                <Filter className="w-4 h-4" /> Bộ lọc
              </button>
              
              <span className="text-white/30 text-sm ml-0 lg:ml-auto font-light">
                <span className="text-gold font-bold">{products.length}</span> sản phẩm
              </span>

              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-gold/30 transition-all text-sm uppercase tracking-wider"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {currentSortLabel}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-[#111] border border-white/10 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortValue(opt.value); setShowSortDropdown(false); }}
                          className={`w-full text-left px-5 py-3 text-sm uppercase tracking-wider transition-colors
                            ${sortValue === opt.value ? "bg-gold/10 text-gold font-bold" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCategorySlug !== "" && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs uppercase tracking-wider">
                    {getCategoryName(activeCategorySlug)}
                    <button onClick={() => setActiveCategorySlug("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {activePriceIdx !== 0 && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs uppercase tracking-wider">
                    {PRICE_RANGES[activePriceIdx].label}
                    <button onClick={() => setActivePriceIdx(0)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs uppercase tracking-wider">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid or Empty or Loading */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-32">
                  <Loader2 className="w-10 h-10 text-gold animate-spin" />
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-20 h-20 rounded-full border border-gold/20 flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-gold/30" />
                  </div>
                  <p className="text-white/30 text-lg uppercase tracking-widest mb-2">Không tìm thấy sản phẩm</p>
                  <p className="text-white/20 text-sm mb-8">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                  <button onClick={resetFilters} className="px-8 py-3 border border-gold/30 text-gold text-xs uppercase tracking-[0.3em] hover:bg-gold/5 transition-all">
                    Xóa bộ lọc
                  </button>
                </motion.div>
              ) : (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.06 }} className="group relative">
                      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 shadow-xl h-full flex flex-col">
                        <div className="relative overflow-hidden aspect-[4/5] shrink-0">
                          <img src={getImageUrl(product.image_url) || "https://placehold.co/600x600/111/gold?text=Chua+Co+Hinh"} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                          
                          {product.badge && (
                            <div className={`absolute top-4 left-4 ${product.badge_color || 'bg-gold text-black'} text-[9px] px-3 py-1 uppercase tracking-[0.2em] font-bold rounded-full shadow-lg`}>
                              {product.badge}
                            </div>
                          )}

                          <Link to={`/san-pham/${product.slug}`} className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-gold hover:bg-black transition-all opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 duration-300">
                            <ChevronRight className="w-5 h-5" />
                          </Link>

                          <div className="absolute bottom-5 left-5 right-5 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                            <motion.button onClick={() => handleAddToCart(product)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full bg-gold text-black py-3.5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold shadow-xl shadow-gold/20">
                              <ShoppingCart className="w-4 h-4" /> Thêm Vào Giỏ
                            </motion.button>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex text-gold">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? "fill-current" : ""}`} />
                              ))}
                            </div>
                            <span className="text-white/25 text-[10px] uppercase tracking-widest ml-1.5">({product.review_count || 0})</span>
                          </div>

                          <Link to={`/san-pham/${product.slug}`}>
                            <h3 className="text-white uppercase tracking-wider mb-1.5 font-bold group-hover:text-gold transition-colors line-clamp-2 leading-tight">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-white/35 text-xs leading-relaxed line-clamp-2 font-light italic mb-4 flex-1">
                            {product.description || "Đang cập nhật mô tả..."}
                          </p>

                          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                            <span className="text-gold font-bold tracking-tight">
                              {Number(product.price).toLocaleString("vi-VN")}đ
                            </span>
                            <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">
                              {product.category_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileFilter(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div key="drawer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed left-0 top-0 bottom-0 w-80 bg-[#0d0d0d] border-r border-white/5 z-50 overflow-y-auto p-8 lg:hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold" />
                  <span className="text-white font-bold text-sm uppercase tracking-widest">Bộ Lọc</span>
                </div>
                <button onClick={() => setShowMobileFilter(false)} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <FilterPanel />
              <div className="mt-8">
                <button onClick={() => setShowMobileFilter(false)} className="w-full py-4 bg-gold text-black font-bold uppercase tracking-widest text-sm rounded-xl">
                  Xem {products.length} sản phẩm
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showSortDropdown && <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} />}
    </div>
  );
}
