import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    birthday: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        onClose();
      } else {
        await register({ 
          email: formData.email, 
          password: formData.password, 
          full_name: formData.name,
          phone: formData.phone,
          birthday: formData.birthday,
          address: formData.address
        });
        setIsLogin(true); // Switch to login after successful register
      }
    } catch (err) {
      // Errors are handled by toast in context
      console.error(err);
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-black border-2 border-primary/30 p-8 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl mb-2" style={{ fontWeight: 700 }}>
                  {isLogin ? "Đăng Nhập" : "Đăng Ký"}
                </h2>
                <div className="w-16 h-1 bg-primary mx-auto" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-2 text-gray-400 uppercase tracking-widest font-bold">Họ Tên *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-primary/20 px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-colors text-sm"
                        placeholder="Nguyễn Văn A"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-2 text-gray-400 uppercase tracking-widest font-bold">Số Điện Thoại</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-primary/20 px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-colors text-sm"
                        placeholder="0912..."
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="block text-xs mb-2 text-gray-400 uppercase tracking-widest font-bold">Ngày Sinh</label>
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      className="w-full bg-white/5 border border-primary/20 px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-colors text-sm"
                    />
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="block text-xs mb-2 text-gray-400 uppercase tracking-widest font-bold">Địa Chỉ</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white/5 border border-primary/20 px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-colors text-sm"
                      placeholder="Số nhà, đường, quận..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs mb-2 text-gray-400 uppercase tracking-widest font-bold">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white/5 border border-primary/20 px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-colors text-sm"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs mb-2 text-gray-400 uppercase tracking-widest font-bold">
                    Mật Khẩu *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-white/5 border border-primary/20 px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-colors text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-3 tracking-wide hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
