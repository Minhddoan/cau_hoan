import { motion } from "motion/react";
import { FileText, ClipboardList, CalendarDays, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getServices } from "../../lib/api";
import { useSettings } from "../context/SettingsContext.tsx";

const ICONS = [FileText, ClipboardList, CalendarDays, Sparkles];
const COLORS = [
  { border: "border-primary/30 hover:border-primary/60", text: "text-primary", badge: "bg-primary/10 text-primary" },
  { border: "border-gold/30 hover:border-gold/60", text: "text-gold", badge: "bg-gold/10 text-gold" },
  { border: "border-white/10 hover:border-white/30", text: "text-gray-300", badge: "bg-white/5 text-gray-300" }
];

export function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAssetUrl } = useSettings();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await getServices();
        if (res.success) {
          setServices(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-32 px-6 md:px-12 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="container mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
            <span className="tracking-[0.3em] uppercase text-primary text-sm" style={{ fontWeight: 700 }}>
              Dịch Vụ
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 text-white" style={{ fontWeight: 700 }}>
            Tư Vấn <span className="text-primary">Chuyên Nghiệp</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Các dịch vụ cốt lõi giúp bạn kiến tạo không gian sống và làm việc đạt chuẩn phong thủy
          </p>
        </motion.div>

        {loading ? (
           <div className="flex justify-center py-10">
             <Loader2 className="w-8 h-8 text-primary animate-spin" />
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = ICONS[index % ICONS.length];
              const colorInfo = COLORS[index % COLORS.length];
              
              const features = Array.isArray(service.features) ? service.features : [];

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className={`border ${colorInfo.border} p-8 h-full transition-all duration-300 bg-gradient-to-br from-white/2 to-transparent relative overflow-hidden flex flex-col`}>
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${colorInfo.badge} mb-6 text-lg font-bold`}>
                      0{index + 1}
                    </div>

                    {service.image_url && (
                      <div className="mb-6 relative h-48 overflow-hidden group/img">
                        <img 
                          src={getAssetUrl(service.image_url)} 
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}

                    <div className="mb-4">
                      <Icon className={`w-10 h-10 ${colorInfo.text}`} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-2xl text-white mb-4" style={{ fontWeight: 700 }}>
                      {service.name}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-6 text-sm flex-1">
                      {service.description}
                    </p>

                    {features.length > 0 && (
                      <ul className="space-y-2 mb-8">
                        {features.map((feat: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-gray-500 text-sm">
                            <span className={`w-1 h-1 rounded-full ${colorInfo.text.replace("text-", "bg-")}`} />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                      <div className="flex flex-col">
                        <span className={`${colorInfo.text} text-sm font-bold`}>
                          {Number(service.price_from).toLocaleString("vi-VN")}đ
                          {service.price_to && ` - ${Number(service.price_to).toLocaleString("vi-VN")}đ`}
                        </span>
                        <span className="text-[10px] text-white/20 uppercase tracking-widest leading-none mt-1">Gói cơ bản</span>
                      </div>
                      <Link to={`/ho-so-dich-vu`}>
                        <button className="flex items-center gap-1 text-sm text-gray-400 group-hover:text-white transition-colors border-none bg-transparent cursor-pointer">
                          Phân Tích <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>

                    <div className={`absolute top-0 right-0 w-16 h-16 border-t border-r ${colorInfo.border.split(" ")[0]} opacity-50`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a href="#contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-primary/90 text-white px-12 py-4 transition-all shadow-xl shadow-primary/20 cursor-pointer"
              style={{ fontWeight: 700 }}
            >
              Đặt Lịch Tư Vấn Ngay
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}