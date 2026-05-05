import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Star, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { useSettings } from "../context/SettingsContext.tsx";
import { toast } from "sonner";
import { getProducts, getProductCategories, getImageUrl } from "../../lib/api";

export function Products() {
  const [categories, setCategories] = useState(["Tất Cả"]);
  const [activeCategory, setActiveCategory] = useState("Tất Cả");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { setLoginOpen } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          getProductCategories(),
          getProducts({ limit: 12 })
        ]);
        
        if (catRes.success) {
          setCategories(["Tất Cả", ...catRes.data.map((c: any) => c.name)]);
        }
        if (prodRes.success) {
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered =
    activeCategory === "Tất Cả"
      ? products
      : products.filter((p) => p.category_name === activeCategory);

  const handleAddToCart = (product: any) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vật phẩm vào giỏ hàng.", {
        action: {
          label: "Đăng nhập",
          onClick: () => setLoginOpen(true)
        }
      });
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: getImageUrl(product.image_url),
      category: product.category_name
    });
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  return (
    <section id="products" className="py-32 px-6 md:px-12 bg-black border-t border-white/5">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <span className="tracking-[0.3em] uppercase text-gold text-sm font-bold">
              Vật Phẩm
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2 className="text-4xl md:text-5xl mb-6 text-white uppercase tracking-widest font-bold">
            Vật Phẩm <span className="text-gold">Phong Thủy</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
            Linh vật, trầm hương và trang sức được chọn lọc khắt khe và trì chú bởi Thầy Song Vũ, mang lại bình an và tài lộc.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 transition-all duration-300 text-xs uppercase tracking-widest border font-bold
                ${activeCategory === cat
                  ? "bg-gold text-black border-gold shadow-lg shadow-gold/20"
                  : "border-white/10 text-white/40 hover:border-gold/40 hover:text-gold"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
             <Loader2 className="w-10 h-10 text-gold animate-spin" />
           </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filtered.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500 shadow-2xl h-full flex flex-col">
                    <div className="relative overflow-hidden aspect-[4/5] shrink-0">
                      <img
                        src={getImageUrl(product.image_url) || "https://placehold.co/600x600/111/gold?text=Chua+Co+Hinh"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                      {product.badge && (
                        <div className={`absolute top-4 left-4 ${product.badge_color || 'bg-gold text-black'} text-[10px] px-3 py-1 uppercase tracking-[0.2em] font-bold rounded-full shadow-lg shadow-black/50`}>
                          {product.badge}
                        </div>
                      )}

                      <Link 
                        to={`/san-pham/${product.slug}`}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-gold hover:bg-black transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>

                      <div className="absolute bottom-6 left-6 right-6 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-gold text-black py-3.5 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold shadow-xl shadow-gold/20"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Thêm Vào Giỏ
                        </motion.button>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex text-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="text-white/30 text-[10px] uppercase tracking-widest font-medium ml-2">({product.review_count || 0})</span>
                      </div>
                      
                      <Link to={`/san-pham/${product.slug}`}>
                        <h3 className="text-white text-lg uppercase tracking-wider mb-2 font-bold group-hover:text-gold transition-colors line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-white/40 mb-5 text-xs leading-relaxed line-clamp-2 font-light italic flex-1">
                        {product.description || "Đang cập nhật mô tả..."}
                      </p>
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                        <span className="text-gold text-xl font-bold tracking-tight">
                          {Number(product.price).toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                          {product.category_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="text-center mt-20">
          <Link to="/vat-pham">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 border border-gold/30 text-gold text-xs uppercase tracking-[0.3em] font-bold hover:bg-gold/5 transition-all"
            >
              Tất cả vật phẩm
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}