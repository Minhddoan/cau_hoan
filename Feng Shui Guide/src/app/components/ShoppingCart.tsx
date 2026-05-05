import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useState } from "react";
import { createOrder } from "../../lib/api";
import { toast } from "sonner";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { user } = useAuth();
  const { setLoginOpen } = useSettings();
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    shipping_address: "",
    notes: ""
  });

  const handleUpdateQuantity = (id: string | number, change: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + change);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.shipping_address) {
      toast.error("Vui lòng điền đủ thông tin bắt buộc.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        total_amount: totalPrice,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await createOrder(orderData);
      if (res.success) {
        clearCart();
        setStep("success");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      if (step === "success") {
        setStep("cart");
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black border-l border-gold/30 z-[60] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gold/10">
              <div className="flex items-center gap-3">
                {step === "checkout" && (
                  <button onClick={() => setStep("cart")} className="text-white/60 hover:text-gold transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h2 className="text-xl tracking-widest uppercase" style={{ fontWeight: 700, color: "#D4AF37" }}>
                    {step === "cart" ? "Giỏ Hàng" : step === "checkout" ? "Thanh Toán" : "Hoàn Tất"}
                  </h2>
                  {step === "cart" && <p className="text-xs text-white/50 uppercase tracking-tighter mt-1">Sản phẩm phong thủy của bạn</p>}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/60 hover:text-gold transition-colors p-2 bg-white/5 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {step === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gold/20">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                      <div className="w-20 h-20 rounded-full border border-gold/20 flex items-center justify-center">
                        <Trash2 className="w-8 h-8 text-gold" />
                      </div>
                      <p className="text-white/70 text-lg uppercase tracking-widest font-light">Giỏ hàng đang trống</p>
                      <button 
                        onClick={handleClose}
                        className="text-gold text-sm underline underline-offset-4 hover:text-gold/80 transition-colors uppercase tracking-widest"
                      >
                        Tiếp tục mua sắm
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          className="group relative flex gap-5 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-all duration-300"
                        >
                          <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-lg bg-black">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </div>

                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="text-white/90 text-sm tracking-wide line-clamp-2 uppercase" style={{ fontWeight: 600 }}>
                                  {item.name}
                                </h3>
                                <button
                                  onClick={() => {
                                    if (confirm('Xóa sản phẩm này khỏi giỏ hàng?')) removeFromCart(item.id);
                                  }}
                                  className="text-white/30 hover:text-red-500 transition-colors ml-2"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-gold text-sm mt-1" style={{ fontWeight: 600 }}>
                                {item.price.toLocaleString("vi-VN")}đ
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1 bg-black rounded-lg border border-gold/20 p-1">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center hover:bg-gold/10 text-gold rounded-md transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-xs text-white" style={{ fontWeight: 600 }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center hover:bg-gold/10 text-gold rounded-md transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white/5 border-t border-gold/20 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm text-white/50 uppercase tracking-widest">
                      <span>Tạm tính:</span>
                      <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-white/50 uppercase tracking-widest">
                      <span>Phí vận chuyển:</span>
                      <span className="text-gold">Miễn phí</span>
                    </div>
                    <div className="flex justify-between items-center text-xl pt-2">
                      <span className="uppercase tracking-widest text-white/80" style={{ fontWeight: 600 }}>Tổng tiền:</span>
                      <span className="text-gold" style={{ fontWeight: 700 }}>
                        {totalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!user) {
                        toast.error("Vui lòng đăng nhập để tiến hành đặt hàng.", {
                          action: {
                            label: "Đăng nhập",
                            onClick: () => {
                              setLoginOpen(true);
                              onClose();
                            }
                          }
                        });
                        return;
                      }
                      setStep("checkout");
                    }}
                    className="w-full bg-gold text-black py-4 tracking-[0.2em] uppercase shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all"
                    style={{ fontWeight: 700 }}
                    disabled={cartItems.length === 0}
                  >
                    Tiến hành đặt hàng
                  </motion.button>
                </div>
              </>
            )}

            {step === "checkout" && (
              <form onSubmit={handleCheckout} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gold/20">
                  <p className="text-white/60 text-sm italic">Vui lòng điền thông tin để chúng tôi liên hệ giao hàng.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/50 text-xs uppercase tracking-widest mb-2 font-bold">Họ và Tên *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.customer_name}
                        onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs uppercase tracking-widest mb-2 font-bold">Số điện thoại *</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors"
                        placeholder="09..."
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs uppercase tracking-widest mb-2 font-bold">Địa chỉ giao hàng *</label>
                      <textarea 
                        required
                        rows={3}
                        value={formData.shipping_address}
                        onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs uppercase tracking-widest mb-2 font-bold">Ghi chú thêm</label>
                      <textarea 
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
                        placeholder="Thời gian nhận hàng thuận tiện..."
                      />
                    </div>
                  </div>

                  <div className="border-t border-gold/10 pt-4 mt-8">
                     <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-bold">Tóm tắt đơn hàng</p>
                     <div className="space-y-2">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-white/60">{item.name} x {item.quantity}</span>
                            <span className="text-white/80 font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                          </div>
                        ))}
                     </div>
                     <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-white/5">
                        <span className="uppercase tracking-widest text-white/80 font-bold">Tổng thanh toán:</span>
                        <span className="text-gold font-bold">
                          {totalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 border-t border-gold/20">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full bg-gold text-black py-4 tracking-[0.2em] uppercase shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác Nhận Đặt Hàng"}
                  </motion.button>
                </div>
              </form>
            )}

            {step === "success" && (
               <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", damping: 12 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50"
                  >
                     <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl text-white font-bold uppercase tracking-wider mb-2">Đặt Hàng Thành Công</h3>
                  <p className="text-white/60 mb-8 max-w-xs">
                     Cảm ơn bạn đã tin tưởng vật phẩm phong thủy Song Vũ. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                  </p>
                  <button 
                    onClick={handleClose}
                    className="px-8 py-3 border border-gold/50 text-gold uppercase tracking-widest text-sm font-bold hover:bg-gold/10 transition-colors"
                  >
                     Trở về trang chủ
                  </button>
               </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
