import { motion } from "motion/react";
import { FileText, ClipboardList, CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const services = [
  {
    icon: FileText,
    badge: "01",
    title: "Hồ Sơ Phong Thủy",
    route: "/ho-so-phong-thuy",
    description:
      "Lập hồ sơ phong thủy toàn diện cho nhà ở, văn phòng, cơ sở kinh doanh. Phân tích chi tiết hướng cung, vị trí cửa, phòng ngủ, bếp và các khu vực quan trọng.",
    features: [
      "Khảo sát tại thực địa",
      "Vẽ bản đồ năng lượng",
      "Báo cáo chi tiết PDF",
      "Tư vấn giải pháp",
    ],
    price: "Từ 2.000.000đ",
    color: "border-primary/30 hover:border-primary/60",
    accentColor: "text-primary",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    icon: ClipboardList,
    badge: "02",
    title: "Hồ Sơ Dịch Vụ",
    route: "/ho-so-dich-vu",
    description:
      "Tư vấn phong thủy chuyên sâu dành cho doanh nghiệp, khách sạn, nhà hàng. Tối ưu hóa không gian kinh doanh thu hút tài lộc và cải thiện vận may.",
    features: [
      "Phân tích vị trí thương mại",
      "Bố trí bàn ghế, nội thất",
      "Hướng khai trương tốt",
      "Hóa giải sát khí",
    ],
    price: "Từ 5.000.000đ",
    color: "border-gold/30 hover:border-gold/60",
    accentColor: "text-gold",
    badgeColor: "bg-gold/10 text-gold",
  },
  {
    icon: CalendarDays,
    badge: "03",
    title: "Xem Ngày",
    route: "/xem-ngay",
    description:
      "Chọn ngày hoàng đạo chuẩn phong thủy cho các sự kiện quan trọng: khai trương, động thổ, ký hợp đồng, cưới hỏi, xuất hành và nhiều việc lớn khác.",
    features: [
      "Xem ngày theo tuổi gia chủ",
      "Tra cứu ngày cát hung",
      "Kết hợp Tứ Trụ mệnh số",
      "Cung cấp lịch tháng",
    ],
    price: "Từ 500.000đ",
    color: "border-white/10 hover:border-white/30",
    accentColor: "text-gray-300",
    badgeColor: "bg-white/5 text-gray-300",
  },
];

export function Services() {
  return (
    <section id="services" className="py-32 px-6 md:px-12 bg-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)",
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
            Tư Vấn{" "}
            <span className="text-primary">Chuyên Nghiệp</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Ba dịch vụ cốt lõi giúp bạn kiến tạo không gian sống và làm việc đạt chuẩn phong thủy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div
                className={`border ${service.color} p-8 h-full transition-all duration-300 bg-gradient-to-br from-white/2 to-transparent relative overflow-hidden`}
              >
                {/* Badge number */}
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${service.badgeColor} mb-6 text-lg`}
                  style={{ fontWeight: 800 }}
                >
                  {service.badge}
                </div>

                <div className="mb-4">
                  <service.icon className={`w-10 h-10 ${service.accentColor}`} strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl text-white mb-4" style={{ fontWeight: 700 }}>
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-500 text-sm">
                      <span className={`w-1 h-1 rounded-full ${service.accentColor.replace("text-", "bg-")}`} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className={`${service.accentColor} text-sm`} style={{ fontWeight: 700 }}>
                    {service.price}
                  </span>
                  <Link to={service.route}>
                    <button className="flex items-center gap-1 text-sm text-gray-400 group-hover:text-white transition-colors">
                      Chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 border-t border-r ${service.color.split(" ")[0]} opacity-50`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary hover:bg-primary/90 text-white px-12 py-4 transition-all shadow-xl shadow-primary/20"
            style={{ fontWeight: 700 }}
          >
            Đặt Lịch Tư Vấn Ngay
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}