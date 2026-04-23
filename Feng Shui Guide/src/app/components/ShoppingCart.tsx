import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();

  const handleUpdateQuantity = (id: string | number, change: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + change);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              <div>
                <h2 className="text-2xl tracking-widest uppercase" style={{ fontWeight: 700, color: "#D4AF37" }}>
                  Giỏ Hàng
                </h2>
                <p className="text-xs text-white/50 uppercase tracking-tighter mt-1">Sản phẩm phong thủy của bạn</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-gold transition-colors p-2 bg-white/5 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gold/20">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                  <div className="w-20 h-20 rounded-full border border-gold/20 flex items-center justify-center">
                    <Trash2 className="w-8 h-8 text-gold" />
                  </div>
                  <p className="text-white/70 text-lg uppercase tracking-widest font-light">Giỏ hàng đang trống</p>
                  <button 
                    onClick={onClose}
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
                              onClick={() => removeFromCart(item.id)}
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
                          <span className="text-xs text-white/40 uppercase tracking-widest font-medium">
                            Tổng: {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                          </span>
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
                className="w-full bg-gold text-black py-4 tracking-[0.2em] uppercase shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all"
                style={{ fontWeight: 700 }}
                disabled={cartItems.length === 0}
              >
                Tiến hành đặt hàng
              </motion.button>

              <p className="text-[10px] text-center text-white/30 uppercase tracking-[0.1em]">
                Giao hàng toàn quốc • Tư vấn phong thủy miễn phí
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

