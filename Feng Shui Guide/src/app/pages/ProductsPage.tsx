import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
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
} from "lucide-react";
import { useCart } from "../context/CartContext.tsx";
import { toast } from "sonner";

// ─── Data ────────────────────────────────────────────────────────────────────

const ALL_PRODUCTS = [
  {
    id: "ty-huu-vang",
    category: "Linh Vật",
    name: "Tỳ Hưu Vàng 24K Chiêu Tài",
    description:
      "Linh vật Tỳ Hưu được chế tác từ vàng 24K nguyên chất, tượng trưng cho quyền lực và khả năng chiêu tài hút lộc cực mạnh.",
    price: 3200000,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1671043121840-cf607dee6152?w=600",
    badge: "Bán Chạy",
    badgeColor: "bg-red-600",
  },
  {
    id: "di-lac-tram",
    category: "Linh Vật",
    name: "Tượng Phật Di Lặc Trầm Hương",
    description:
      "Tượng Phật Di Lặc mang lại bình an, hỷ lạc và thịnh vượng cho gia đình, được Thầy Song Vũ trực tiếp khai quang.",
    price: 12500000,
    rating: 5.0,
    reviews: 86,
    image: "https://images.unsplash.com/photo-1758800600436-eca719abf40c?w=600",
    badge: "VIP",
    badgeColor: "bg-gold",
  },
  {
    id: "rong-vang",
    category: "Linh Vật",
    name: "Rồng Vàng Phong Thủy Đế Vương",
    description:
      "Tượng rồng mạ vàng 24K – biểu tượng quyền lực, may mắn và đế vương, giúp chủ nhân thăng tiến sự nghiệp.",
    price: 18900000,
    rating: 4.9,
    reviews: 41,
    image:
      "https://images.unsplash.com/photo-1767041988708-b501fe59e37b?w=600",
    badge: "Giới Hạn",
    badgeColor: "bg-red-700",
  },
  {
    id: "phat-ba-quan-am",
    category: "Linh Vật",
    name: "Phật Bà Quan Âm Ngọc Trắng",
    description:
      "Tượng Quan Âm Bồ Tát bạch ngọc thiên nhiên, đem lại từ bi, phúc lộc và bình an cho gia đình.",
    price: 9800000,
    rating: 5.0,
    reviews: 63,
    image:
      "https://images.unsplash.com/photo-1655547229652-137073b160a5?w=600",
    badge: "Cao Cấp",
    badgeColor: "bg-gold",
  },
  {
    id: "tram-huong-vip",
    category: "Trầm Hương",
    name: "Vòng Trầm Hương Song Vũ VIP",
    description:
      "Vòng trầm hương tự nhiên trên 30 năm tuổi, hương thơm vĩnh cửu, mang lại linh khí và sự bình an cho chủ nhân.",
    price: 8500000,
    rating: 4.9,
    reviews: 147,
    image:
      "https://images.unsplash.com/photo-1750751661623-f1c9496f2679?w=600",
    badge: "Cao Cấp",
    badgeColor: "bg-gold",
  },
  {
    id: "tram-huong-108",
    category: "Trầm Hương",
    name: "Vòng Trầm 108 Hạt Kỳ Nam",
    description:
      "108 hạt trầm kỳ nam kích thước đều, hương thơm đặc trưng, phù hợp thiền định và cân bằng tâm linh.",
    price: 5200000,
    rating: 4.8,
    reviews: 92,
    image:
      "https://images.unsplash.com/photo-1627769916425-74c2344a3439?w=600",
    badge: null,
    badgeColor: "",
  },
  {
    id: "tram-huong-cone",
    category: "Trầm Hương",
    name: "Nón Trầm Hương Khánh Hoà",
    description:
      "Trầm hương dạng nón từ vùng đất Khánh Hoà, đốt tỏa hương thanh khiết, làm sạch không gian và xua tà khí.",
    price: 1800000,
    rating: 4.7,
    reviews: 215,
    image:
      "https://images.unsplash.com/photo-1627769916425-74c2344a3439?w=600&crop=entropy",
    badge: "Phổ Biến",
    badgeColor: "bg-green-700",
  },
  {
    id: "vong-ngoc-bich",
    category: "Trang Sức",
    name: "Vòng Ngọc Bích Thiên Nhiên",
    description:
      "Ngọc bích thượng hạng, màu sắc đồng nhất, giúp tăng cường sức khỏe, cân bằng tâm trí và bảo vệ bình an.",
    price: 6800000,
    rating: 4.8,
    reviews: 52,
    image:
      "https://images.unsplash.com/photo-1582051924552-b4b6a6fccc01?w=600",
    badge: "Hiếm",
    badgeColor: "bg-purple-600",
  },
  {
    id: "vong-thach-anh-hong",
    category: "Trang Sức",
    name: "Vòng Thạch Anh Hồng Tình Duyên",
    description:
      "Thạch anh hồng tự nhiên giúp thu hút tình duyên, xua tan u ám, mang lại sức sống và tươi vui cho người đeo.",
    price: 2400000,
    rating: 4.7,
    reviews: 173,
    image:
      "https://images.unsplash.com/photo-1586658066544-a87cdd681398?w=600",
    badge: "Bán Chạy",
    badgeColor: "bg-red-600",
  },
  {
    id: "vong-hac-ong-thach",
    category: "Trang Sức",
    name: "Vòng Hắc Ưng Thạch Hộ Mệnh",
    description:
      "Hắc ưng thạch đen bóng huyền bí, tạo lá chắn tâm linh bảo vệ chủ nhân khỏi năng lượng tiêu cực và tà khí.",
    price: 3600000,
    rating: 4.9,
    reviews: 88,
    image:
      "https://images.unsplash.com/photo-1678259474357-6ee4a8a55d6f?w=600",
    badge: "Hộ Mệnh",
    badgeColor: "bg-gray-700",
  },
  {
    id: "thach-anh-tim",
    category: "Đá Quý",
    name: "Hốc Thạch Anh Tím Uruguay",
    description:
      "Hốc thạch anh tím thiên nhiên nhập khẩu từ Uruguay, tỏa năng lượng bình an, giúp ngủ ngon và tăng trực giác.",
    price: 5500000,
    rating: 4.8,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1626470408813-f0059745d58b?w=600",
    badge: null,
    badgeColor: "",
  },
  {
    id: "thach-anh-trang",
    category: "Đá Quý",
    name: "Cột Thạch Anh Trắng Thanh Lọc",
    description:
      "Cột thạch anh trắng trong suốt, thanh lọc không gian sống, xua tà và thu hút vượng khí tích cực.",
    price: 3100000,
    rating: 4.6,
    reviews: 49,
    image:
      "https://images.unsplash.com/photo-1626470408813-f0059745d58b?w=600&crop=top",
    badge: null,
    badgeColor: "",
  },
];

const CATEGORIES = ["Tất Cả", "Linh Vật", "Trầm Hương", "Trang Sức", "Đá Quý"];

const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: 0, max: Infinity },
  { label: "Dưới 3 triệu", min: 0, max: 3000000 },
  { label: "3 – 7 triệu", min: 3000000, max: 7000000 },
  { label: "7 – 15 triệu", min: 7000000, max: 15000000 },
  { label: "Trên 15 triệu", min: 15000000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Nổi bật nhất", value: "featured" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
  { label: "Đánh giá cao nhất", value: "rating" },
  { label: "Đánh giá nhiều nhất", value: "reviews" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductsPage() {
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [activePriceIdx, setActivePriceIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];

    // Category
    if (activeCategory !== "Tất Cả") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Price
    const range = PRICE_RANGES[activePriceIdx];
    list = list.filter((p) => p.price >= range.min && p.price <= range.max);

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortValue) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        list.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return list;
  }, [activeCategory, activePriceIdx, searchQuery, sortValue]);

  const handleAddToCart = (product: (typeof ALL_PRODUCTS)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category,
    });
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const resetFilters = () => {
    setActiveCategory("Tất Cả");
    setActivePriceIdx(0);
    setSearchQuery("");
    setSortValue("featured");
  };

  const hasFilters =
    activeCategory !== "Tất Cả" ||
    activePriceIdx !== 0 ||
    searchQuery.trim() !== "";

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortValue)?.label ?? "Nổi bật nhất";

  // Sidebar filter panel (shared between desktop sidebar and mobile drawer)
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
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-2.5 text-sm uppercase tracking-wider transition-all duration-200 rounded-lg flex items-center justify-between
                  ${
                    activeCategory === cat
                      ? "bg-gold/10 text-gold border border-gold/20 font-bold"
                      : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
              >
                {cat}
                {activeCategory === cat && (
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
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 via-black to-black pointer-events-none" />
        <div className="container mx-auto px-6 py-16 relative z-10">
          {/* Breadcrumb */}
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
              Vật Phẩm{" "}
              <span className="text-gold">Phong Thủy</span>
            </h1>
            <p className="text-white/40 leading-relaxed font-light max-w-xl">
              Linh vật, trầm hương và trang sức được chọn lọc khắt khe, trì chú
              bởi Thầy Song Vũ, mang lại bình an, tài lộc và may mắn cho chủ nhân.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex gap-10">
          {/* ─ Desktop Sidebar ─ */}
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

          {/* ─ Right Column ─ */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-gold/40 transition-all text-sm uppercase tracking-wider"
              >
                <Filter className="w-4 h-4" /> Bộ lọc
              </button>

              {/* Result count */}
              <span className="text-white/30 text-sm ml-0 lg:ml-auto font-light">
                <span className="text-gold font-bold">{filtered.length}</span>{" "}
                sản phẩm
              </span>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-gold/30 transition-all text-sm uppercase tracking-wider"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {currentSortLabel}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
                  />
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
                          onClick={() => {
                            setSortValue(opt.value);
                            setShowSortDropdown(false);
                          }}
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
                {activeCategory !== "Tất Cả" && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs uppercase tracking-wider">
                    {activeCategory}
                    <button onClick={() => setActiveCategory("Tất Cả")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {activePriceIdx !== 0 && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs uppercase tracking-wider">
                    {PRICE_RANGES[activePriceIdx].label}
                    <button onClick={() => setActivePriceIdx(0)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs uppercase tracking-wider">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="w-20 h-20 rounded-full border border-gold/20 flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-gold/30" />
                  </div>
                  <p className="text-white/30 text-lg uppercase tracking-widest mb-2">
                    Không tìm thấy sản phẩm
                  </p>
                  <p className="text-white/20 text-sm mb-8">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-8 py-3 border border-gold/30 text-gold text-xs uppercase tracking-[0.3em] hover:bg-gold/5 transition-all"
                  >
                    Xóa bộ lọc
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={activeCategory + activePriceIdx + searchQuery + sortValue}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filtered.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                      className="group relative"
                    >
                      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 shadow-xl h-full flex flex-col">
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-[4/5] shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                          {/* Badge */}
                          {product.badge && (
                            <div
                              className={`absolute top-4 left-4 ${product.badgeColor} text-white text-[9px] px-3 py-1 uppercase tracking-[0.2em] font-bold rounded-full shadow-lg`}
                            >
                              {product.badge}
                            </div>
                          )}

                          {/* View Detail */}
                          <Link
                            to={`/san-pham/${product.id}`}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-gold hover:bg-black transition-all opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 duration-300"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>

                          {/* Add to cart overlay */}
                          <div className="absolute bottom-5 left-5 right-5 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleAddToCart(product)}
                              className="w-full bg-gold text-black py-3.5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold shadow-xl shadow-gold/20"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Thêm Vào Giỏ
                            </motion.button>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex text-gold">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                                />
                              ))}
                            </div>
                            <span className="text-white/25 text-[10px] uppercase tracking-widest ml-1.5">
                              ({product.reviews})
                            </span>
                          </div>

                          <Link to={`/san-pham/${product.id}`}>
                            <h3 className="text-white uppercase tracking-wider mb-1.5 font-bold group-hover:text-gold transition-colors line-clamp-2 leading-tight">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-white/35 text-xs leading-relaxed line-clamp-2 font-light italic mb-4 flex-1">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                            <span className="text-gold font-bold tracking-tight">
                              {product.price.toLocaleString("vi-VN")}đ
                            </span>
                            <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">
                              {product.category}
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

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilter(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#0d0d0d] border-r border-white/5 z-50 overflow-y-auto p-8 lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold" />
                  <span className="text-white font-bold text-sm uppercase tracking-widest">
                    Bộ Lọc
                  </span>
                </div>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <FilterPanel />
              <div className="mt-8">
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="w-full py-4 bg-gold text-black font-bold uppercase tracking-widest text-sm rounded-xl"
                >
                  Xem {filtered.length} sản phẩm
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Close sort dropdown on outside click */}
      {showSortDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSortDropdown(false)}
        />
      )}
    </div>
  );
}
