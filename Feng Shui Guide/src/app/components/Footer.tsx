import { motion } from "motion/react";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}

function FooterLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="21" stroke="#D4AF37" strokeWidth="1.5" />
        <path d="M22 8L34 18V36H10V18L22 8Z" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
        <path d="M16 36V25H28V36" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
        <circle cx="22" cy="21" r="3" fill="#D4AF37" />
        <path d="M22 8V5M8 22H5M39 22H36M22 39V42" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-[9px] tracking-[0.35em] uppercase text-gold/60 font-medium">Phong Thủy</span>
        <span
          className="text-xl tracking-[0.15em] uppercase"
          style={{ color: "#D4AF37", fontWeight: 700 }}
        >
          Song Vũ
        </span>
      </div>
    </div>
  );
}

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-black pt-20 pb-10 border-t border-gold/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <FooterLogo />
            <p className="text-gray-500 leading-relaxed text-sm">
              Kiến tạo không gian sống hài hòa, mang lại tài lộc và bình an qua nghệ thuật phong thủy Á Đông hiện đại.
            </p>
            <div className="flex gap-3">
              {String(settings.facebook_url || "#").split('\n').filter(link => link.trim() !== "").map((href, i) => (
                <motion.a
                  key={`fb-${i}`}
                  href={href.trim()}
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </motion.a>
              ))}
              {String(settings.youtube_url || "#").split('\n').filter(link => link.trim() !== "").map((href, i) => (
                <motion.a
                  key={`yt-${i}`}
                  href={href.trim()}
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </motion.a>
              ))}
              {String(settings.tiktok_url || "#").split('\n').filter(link => link.trim() !== "").map((href, i) => (
                <motion.a
                  key={`tt-${i}`}
                  href={href.trim()}
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/30 transition-colors"
                >
                  <TiktokIcon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-6 border-l-2 border-gold pl-3" style={{ fontWeight: 700 }}>Điều Hướng</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Trang chủ", href: "#home" },
                { label: "Giới thiệu", href: "#about" },
                { label: "Thầy Song Vũ", href: "#master" },
                { label: "Dịch vụ", href: "#services" },
                { label: "Vật phẩm", href: "#products" },
                { label: "Tuyển dụng", href: "#careers" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-gold transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gold/40 group-hover:text-gold transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white mb-6 border-l-2 border-gold pl-3" style={{ fontWeight: 700 }}>Dịch Vụ</h4>
            <ul className="space-y-2.5">
              {[
                "Hồ Sơ Phong Thủy",
                "Hồ Sơ Dịch Vụ",
                "Xem Ngày Tốt",
                "Kiến Thức Ngũ Hành",
                "Tra Cứu & Hỏi Đáp",
                "Trợ Lý AI Phong Thủy",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-gold transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gold/40 group-hover:text-gold transition-colors" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-6 border-l-2 border-gold pl-3" style={{ fontWeight: 700 }}>Liên Hệ</h4>
            <ul className="space-y-4">
              {String(settings.contact_address || "123 Đường Phong Thủy, Quận 1, TP. Hồ Chí Minh").split('\n').map((line, idx) => (
                <li key={`addr-${idx}`} className="flex gap-3 text-gray-500 text-sm">
                  <MapPin className="w-5 h-5 text-gold/60 shrink-0 mt-0.5" />
                  <span>{line.trim()}</span>
                </li>
              ))}
              {String(settings.contact_phone || "0123 456 789").split('\n').map((line, idx) => (
                <li key={`phone-${idx}`} className="flex gap-3 text-gray-500 text-sm">
                  <Phone className="w-5 h-5 text-gold/60 shrink-0" />
                  <span>{line.trim()}</span>
                </li>
              ))}
              {String(settings.contact_email || "contact@phongthuysongu.vn").split('\n').map((line, idx) => (
                <li key={`email-${idx}`} className="flex gap-3 text-gray-500 text-sm">
                  <Mail className="w-5 h-5 text-gold/60 shrink-0" />
                  <span>{line.trim()}</span>
                </li>
              ))}
            </ul>

            {/* Gold ornament */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
              <span className="text-gold/40 text-xl">☯</span>
              <div className="h-px flex-1 bg-gradient-to-l from-gold/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-sm">
          <p>© 2026 Phong Thủy Song Vũ. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-gold transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-gold transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
