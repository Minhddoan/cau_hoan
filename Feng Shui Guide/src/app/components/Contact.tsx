import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="relative py-32 px-6 md:px-12 overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1671043121840-cf607dee6152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmZW5nJTIwc2h1aSUyMHplbiUyMG1lZGl0YXRpb24lMjBnYXJkZW58ZW58MXx8fHwxNzc1NjY0MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Liên hệ"
          className="w-full h-full object-cover brightness-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
      </div>

      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
            <span className="tracking-[0.3em] uppercase text-primary text-sm" style={{ fontWeight: 700 }}>
              Liên Hệ
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="text-5xl md:text-7xl mb-6 text-white" style={{ fontWeight: 700 }}>
            Bắt Đầu Hành Trình
            <br />
            <span className="text-primary">Phong Thủy</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn và nhận báo giá dịch vụ phù hợp nhất
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {[
              {
                icon: Phone,
                label: "Điện Thoại / Zalo",
                value: "+84 123 456 789",
                sub: "Gọi hoặc nhắn Zalo 24/7",
              },
              {
                icon: Mail,
                label: "Email",
                value: "contact@phongthuysongu.vn",
                sub: "Phản hồi trong vòng 2 giờ",
              },
              {
                icon: MapPin,
                label: "Địa Chỉ",
                value: "123 Đường Phong Thủy, Q.1, TP.HCM",
                sub: "Mở cửa: T2 – T7, 8:00 – 18:00",
              },
              {
                icon: Clock,
                label: "Giờ Làm Việc",
                value: "Thứ 2 – Thứ 7: 8:00 – 18:00",
                sub: "Chủ nhật: Theo đặt lịch",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start group"
              >
                <div className="w-12 h-12 border border-primary/30 flex items-center justify-center shrink-0 group-hover:border-primary/60 transition-colors bg-primary/5">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-white" style={{ fontWeight: 600 }}>{item.value}</div>
                  <div className="text-gray-500 text-sm mt-0.5">{item.sub}</div>
                </div>
              </motion.div>
            ))}

            {/* Social CTA */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm" style={{ fontWeight: 600 }}>Tư vấn nhanh qua Zalo/Facebook</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="#"
                  className="flex items-center justify-center py-3 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all text-sm"
                  style={{ fontWeight: 600 }}
                >
                  Nhắn Facebook
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center py-3 border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all text-sm"
                  style={{ fontWeight: 600 }}
                >
                  Nhắn Zalo
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-black/60 backdrop-blur-sm border border-white/10 p-8 space-y-5"
            >
              <h3 className="text-xl text-white mb-6" style={{ fontWeight: 700 }}>
                Gửi Yêu Cầu Tư Vấn
              </h3>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Họ Tên *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-white/3 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Số Điện Thoại *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0123 456 789"
                  className="w-full bg-white/3 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Dịch Vụ Quan Tâm</label>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors text-sm appearance-none"
                >
                  <option value="" className="bg-black">-- Chọn dịch vụ --</option>
                  <option value="ho-so-phong-thuy" className="bg-black">Hồ Sơ Phong Thủy</option>
                  <option value="ho-so-dich-vu" className="bg-black">Hồ Sơ Dịch Vụ</option>
                  <option value="xem-ngay" className="bg-black">Xem Ngày</option>
                  <option value="vat-pham" className="bg-black">Vật Phẩm Phong Thủy</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Nội Dung</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Mô tả yêu cầu của bạn..."
                  className="w-full bg-white/3 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors resize-none text-sm"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full py-4 transition-all text-sm ${
                  sent
                    ? "bg-green-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
                style={{ fontWeight: 700 }}
              >
                {sent ? "✓ Đã Gửi Thành Công!" : "Gửi Yêu Cầu Tư Vấn"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
