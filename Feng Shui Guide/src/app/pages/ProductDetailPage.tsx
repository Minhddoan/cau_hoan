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
  Info
} from "lucide-react";
import { useCart } from "../context/CartContext.tsx";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";

// Mock product data
const PRODUCTS = {
  "tram-huong-vip": {
    id: "tram-huong-vip",
    name: "Vòng Trầm Hương Tự Nhiên Cao Cấp - Song Vũ VIP",
    price: 8500000,
    originalPrice: 12000000,
    rating: 4.9,
    reviews: 128,
    description: "Vòng trầm hương được chế tác từ khối trầm tự nhiên lâu năm, mang đậm hương thơm thanh khiết, bền bỉ. Sản phẩm được trì chú bình an bởi Thầy Song Vũ, giúp cân bằng năng lượng, chiêu tài lộc và hộ thân cho chủ nhân.",
    features: [
      "Trầm hương tự nhiên trên 30 năm tuổi",
      "Hương thơm vĩnh cửu, càng đeo càng thơm",
      "Kích thước hạt: 12mm - 14 hạt (Phù hợp nam/nữ)",
      "Mặt dây chuyền vàng 18K khắc chữ Vạn",
      "Đã được khai quang trì chú bởi Thầy Song Vũ"
    ],
    images: [
      "https://images.unsplash.com/photo-1750751661623-f1c9496f2679?w=800",
      "https://images.unsplash.com/photo-1534976618208-4833d5b57d08?w=800",
      "https://images.unsplash.com/photo-1615484477778-ca3b77942c25?w=800"
    ],
    specifications: [
      { label: "Chất liệu", value: "Trầm hương Kỳ Nam loại 1" },
      { label: "Nguồn gốc", value: "Khánh Hòa, Việt Nam" },
      { label: "Màu sắc", value: "Nâu đen tự nhiên" },
      { label: "Trọng lượng", value: "15g - 18g" },
      { label: "Năng lượng", value: "Hành Mộc, Hành Hỏa" }
    ],
    tabs: [
      { id: "description", label: "Mô tả chi tiết" },
      { id: "usage", label: "Cách sử dụng" },
      { id: "reviews", label: "Đánh giá (128)" }
    ]
  }
};

const RELATED_PRODUCTS = [
  {
    id: "ty-huu-vang",
    name: "Tỳ Hưu Vàng 24K Chiêu Tài",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1671043121840-cf607dee6152?w=400",
    category: "Linh Vật"
  },
  {
    id: "thach-anh-tim",
    name: "Hốc Thạch Anh Tím Uruguay",
    price: 5500000,
    image: "https://images.unsplash.com/photo-1758800600436-eca719abf40c?w=400",
    category: "Đá Quý"
  },
  {
    id: "tram-huong-mini",
    name: "Vòng Trầm 108 Hạt",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1750751661623-f1c9496f2679?w=400",
    category: "Trang Sức"
  }
];

export function ProductDetailPage() {
  const { id } = useParams();
  const product = PRODUCTS[id as keyof typeof PRODUCTS] || PRODUCTS["tram-huong-vip"];
  const { addToCart } = useCart();
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      category: "Trang Sức"
    });
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-white/40 uppercase tracking-widest font-medium">
          <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="#products" className="hover:text-gold transition-colors">Vật Phẩm</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gold truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Product Images */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square w-full rounded-2xl overflow-hidden bg-white/5 border border-gold/10 relative group"
          >
            <ImageWithFallback
              src={product.images[activeImage]}
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

          {/* Thumbnail List */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, idx) => (
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

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] uppercase tracking-[0.2em] font-bold rounded-full border border-gold/20">
                Sản phẩm VIP
              </span>
              <div className="flex items-center gap-1 text-gold ml-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                ))}
                <span className="text-white/40 text-sm ml-2 font-medium">({product.reviews} đánh giá)</span>
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl uppercase tracking-wider leading-tight" style={{ fontWeight: 800, color: "#D4AF37" }}>
              {product.name}
            </h1>

            <div className="flex items-end gap-6 pt-2">
              <span className="text-4xl text-white font-bold tracking-tight">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
              {product.originalPrice && (
                <span className="text-xl text-white/30 line-through mb-1 font-light">
                  {product.originalPrice.toLocaleString("vi-VN")}đ
                </span>
              )}
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded mb-1">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-6 mb-8">
            <p className="text-white/70 leading-relaxed font-light italic">
              "{product.description}"
            </p>
            
            <ul className="space-y-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
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

          {/* Trust Badges */}
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

      {/* Tabs Section */}
      <div className="container mx-auto px-6 mt-20">
        <div className="border-b border-white/10 flex gap-10">
          {product.tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm uppercase tracking-[0.2em] relative transition-all duration-300 font-bold
                ${activeTab === tab.id ? 'text-gold' : 'text-white/40 hover:text-white/70'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
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
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/70 text-lg leading-relaxed font-light">
                    Mỗi khối trầm hương được tuyển chọn khắt khe từ vùng đất Khánh Hòa - thủ phủ của trầm hương Việt Nam. 
                    Dưới bàn tay điêu luyện của các nghệ nhân, những hạt trầm tròn đều, bóng mịn hiện lên, mang trong mình 
                    linh khí của trời đất hàng chục năm ròng.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                    <div className="space-y-4">
                      <h3 className="text-xl text-gold font-bold uppercase tracking-widest">Giá trị tâm linh</h3>
                      <p className="text-white/60 leading-relaxed">
                        Theo phong thủy, trầm hương mang tính Dương cực mạnh, có khả năng xua đuổi tà khí, thu hút vượng khí 
                        và cân bằng năng lượng cơ thể. Thầy Song Vũ đã trực tiếp trì chú từng sản phẩm tại đàn lễ, giúp 
                        vật phẩm phát huy tối đa công năng hộ thân.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl text-gold font-bold uppercase tracking-widest">Giá trị sức khỏe</h3>
                      <p className="text-white/60 leading-relaxed">
                        Hương thơm thoang thoảng của trầm hương giúp an thần, giảm căng thẳng và cải thiện giấc ngủ. 
                        Tinh dầu trầm thấm qua da giúp lưu thông khí huyết, mang lại cảm giác nhẹ nhàng, thư thái.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-gold/10 p-8 rounded-2xl">
                  <h4 className="text-lg text-white font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Info className="w-5 h-5 text-gold" /> Thông số kỹ thuật
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                    {product.specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-white/40 text-sm uppercase tracking-wider">{spec.label}</span>
                        <span className="text-white font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === "usage" && (
              <motion.div
                key="usage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-white/70"
              >
                <h3 className="text-2xl text-gold font-bold uppercase tracking-widest">Cách bảo quản & Sử dụng</h3>
                <ul className="space-y-4 list-disc pl-5">
                  <li>Tránh tiếp xúc trực tiếp với nước, hóa chất và chất tẩy rửa mạnh.</li>
                  <li>Khi không sử dụng, hãy để vòng trong hộp kín có lót vải nhung để giữ mùi thơm.</li>
                  <li>Nên đeo vòng ở tay trái khi tham gia các buổi tiệc, hội họp để thu hút may mắn.</li>
                  <li>Nên đeo vòng ở tay phải khi đi đến những nơi có năng lượng xấu như bệnh viện, nghĩa trang để hộ thân.</li>
                  <li>Vệ sinh vòng bằng khăn khô, mềm để làm bóng các hạt trầm.</li>
                </ul>
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
                    <p className="text-5xl font-bold text-gold">4.9</p>
                    <div className="flex text-gold my-2 justify-center">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-xs text-white/40 uppercase tracking-widest">128 Đánh giá</p>
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

                {/* Mock Review */}
                <div className="space-y-6 pt-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-b border-white/5 pb-8">
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                            {i === 1 ? 'HN' : 'MT'}
                          </div>
                          <div>
                            <p className="text-white font-bold tracking-wide">Hà Nguyễn</p>
                            <div className="flex text-gold">
                              {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-white/30">15/04/2026</span>
                      </div>
                      <p className="text-white/70 font-light leading-relaxed">
                        "Vòng rất đẹp, thơm nhẹ nhàng đúng chất trầm tự nhiên. Đeo vào cảm thấy tâm an hơn hẳn. 
                        Cảm ơn Thầy Song Vũ đã tư vấn và khai quang cho em."
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products */}
      <div className="container mx-auto px-6 mt-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold block mb-2">Có thể bạn quan tâm</span>
            <h2 className="text-3xl uppercase tracking-widest font-bold text-white">Vật phẩm liên quan</h2>
          </div>
          <Link to="#products" className="text-gold text-sm uppercase tracking-widest border-b border-gold/30 pb-1 hover:border-gold transition-all font-bold">
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RELATED_PRODUCTS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -10 }}
              className="group bg-white/5 border border-white/5 hover:border-gold/30 rounded-2xl overflow-hidden transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-gold text-[10px] uppercase tracking-widest font-bold rounded-full border border-gold/20">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white text-lg uppercase tracking-wider mb-2 group-hover:text-gold transition-colors font-bold">
                  {item.name}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-gold font-bold text-xl">{item.price.toLocaleString("vi-VN")}đ</p>
                  <Link 
                    to={`/san-pham/${item.id}`}
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
    </div>
  );
}
