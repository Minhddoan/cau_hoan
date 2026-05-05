import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CheckCircle2,
  Info,
  Loader2
} from "lucide-react";
import { useCart } from "../context/CartContext.tsx";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";
import { getProductBySlug, getProducts, getImageUrl } from "../../lib/api";

export function ProductDetailPage() {
  const { id } = useParams(); // id is actually the slug based on our routes
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const res = await getProductBySlug(id);
        if (res.success) {
          setProduct(res.data);
          
          // Fetch related
          if (res.data.category_id) {
            const relRes = await getProducts({ category_id: res.data.category_id, limit: 3 });
            if (relRes.success) {
              setRelatedProducts(relRes.data.filter((p: any) => p.id !== res.data.id).slice(0,3));
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex flex-col items-center">
        <h1 className="text-white text-2xl uppercase tracking-widest mb-4">Không tìm thấy sản phẩm</h1>
        <Link to="/san-pham" className="text-gold uppercase tracking-[0.2em] text-sm hover:underline">Quay lại gian hàng</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: quantity,
      image: getImageUrl(product.image_url),
      category: product.category_name
    });
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const images = product.image_url ? [getImageUrl(product.image_url)] : ["https://placehold.co/800x800/111/gold?text=Chua+Co+Hinh"];

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-white/40 uppercase tracking-widest font-medium">
          <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/san-pham" className="hover:text-gold transition-colors">Vật Phẩm</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gold truncate">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square w-full rounded-2xl overflow-hidden bg-white/5 border border-gold/10 relative group"
          >
            <ImageWithFallback
              src={images[activeImage] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md transition-all duration-300 border
                ${isFavorite ? 'bg-red-500 border-red-500 text-white' : 'bg-black/50 border-white/10 text-white hover:text-red-500'}`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300
                  ${activeImage === idx ? 'border-gold shadow-lg shadow-gold/20' : 'border-white/5 opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 ${product.badge_color || 'bg-gold/10 text-gold border-gold/20'} text-[10px] uppercase tracking-[0.2em] font-bold rounded-full border`}>
                {product.badge || 'Sản phẩm'}
              </span>
              <div className="flex items-center gap-1 text-gold ml-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : ''}`} />
                ))}
                <span className="text-white/40 text-sm ml-2 font-medium">({product.review_count || 0} đánh giá)</span>
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl uppercase tracking-wider leading-tight" style={{ fontWeight: 800, color: "#D4AF37" }}>
              {product.name}
            </h1>

            <div className="flex items-end gap-6 pt-2">
              <span className="text-4xl text-white font-bold tracking-tight">
                {Number(product.price).toLocaleString("vi-VN")}đ
              </span>
              {product.original_price && Number(product.original_price) > Number(product.price) && (
                <>
                  <span className="text-xl text-white/30 line-through mb-1 font-light">
                    {Number(product.original_price).toLocaleString("vi-VN")}đ
                  </span>
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded mb-1">
                    -{Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6 mb-8">
            <p className="text-white/70 leading-relaxed font-light italic">
              "{product.description || "Đang cập nhật mô tả..."}"
            </p>
            
            <ul className="space-y-3">
               <li className="flex items-start gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  Giao hàng toàn quốc
               </li>
               <li className="flex items-start gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  Thầy Song Vũ trực tiếp khai quang trì chú
               </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-8">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Số lượng</p>
                <div className="flex items-center gap-1 bg-black rounded-xl border border-gold/20 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gold/10 text-gold rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center text-xl text-white font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gold/10 text-gold rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full h-14 bg-gold text-black flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-xl shadow-gold/20 hover:bg-gold/90 transition-all font-bold"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ hàng
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="h-14 border border-white/10 text-white/80 flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-xs hover:bg-white/5 transition-all font-semibold rounded-xl">
                <Share2 className="w-4 h-4" /> Chia sẻ
              </button>
              <button className="h-14 border border-gold/30 text-gold flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-xs hover:bg-gold/5 transition-all font-bold rounded-xl">
                Tư vấn ngay
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-6 h-6 text-gold/60" />
              <span className="text-[10px] uppercase tracking-wider text-white/50 leading-tight">Cam kết chính hãng</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-6 h-6 text-gold/60" />
              <span className="text-[10px] uppercase tracking-wider text-white/50 leading-tight">Giao hàng hỏa tốc</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="w-6 h-6 text-gold/60" />
              <span className="text-[10px] uppercase tracking-wider text-white/50 leading-tight">7 ngày đổi trả</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-20">
        <div className="border-b border-white/10 flex gap-10">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm uppercase tracking-[0.2em] relative transition-all duration-300 font-bold
                ${activeTab === 'description' ? 'text-gold' : 'text-white/40 hover:text-white/70'}`}
            >
              Mô tả chi tiết
              {activeTab === 'description' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm uppercase tracking-[0.2em] relative transition-all duration-300 font-bold
                ${activeTab === 'reviews' ? 'text-gold' : 'text-white/40 hover:text-white/70'}`}
            >
              Đánh giá ({product.review_count || 0})
              {activeTab === 'reviews' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
        </div>

        <div className="py-12 max-w-4xl">
          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed font-light" dangerouslySetInnerHTML={{__html: product.content || product.description || "Nội dung chi tiết đang được cập nhật..."}}>
                </div>
              </motion.div>
            )}
            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-10 bg-white/5 p-8 rounded-2xl border border-white/5">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-gold">{product.rating || 5}</p>
                    <div className="flex text-gold my-2 justify-center">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-xs text-white/40 uppercase tracking-widest">{product.review_count || 0} Đánh giá</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-4">
                        <span className="text-xs text-white/50 w-4">{star}</span>
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gold rounded-full" 
                            style={{ width: star === 5 ? '92%' : star === 4 ? '6%' : '1%' }} 
                          />
                        </div>
                        <span className="text-xs text-white/30 w-8">{star === 5 ? '92%' : star === 4 ? '6%' : '1%'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-6 mt-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold block mb-2">Có thể bạn quan tâm</span>
              <h2 className="text-3xl uppercase tracking-widest font-bold text-white">Vật phẩm liên quan</h2>
            </div>
            <Link to="/san-pham" className="text-gold text-sm uppercase tracking-widest border-b border-gold/30 pb-1 hover:border-gold transition-all font-bold">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -10 }}
                className="group bg-white/5 border border-white/5 hover:border-gold/30 rounded-2xl overflow-hidden transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={getImageUrl(item.image_url) || "https://placehold.co/600x400/111/gold?text=Placeholder"} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-gold text-[10px] uppercase tracking-widest font-bold rounded-full border border-gold/20">
                      {item.category_name}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-white text-lg uppercase tracking-wider mb-2 group-hover:text-gold transition-colors font-bold">
                    {item.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-gold font-bold text-xl">{Number(item.price).toLocaleString("vi-VN")}đ</p>
                    <Link 
                      to={`/san-pham/${item.slug}`}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-black hover:border-gold transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
