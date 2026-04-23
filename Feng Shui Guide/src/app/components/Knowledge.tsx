import { motion } from "motion/react";
import { BookOpen, Compass, Home, Wind, Droplets, Flame, Mountain, CircleDot } from "lucide-react";
import { Link } from "react-router";

const principles = [
  {
    element: "Kim",
    icon: CircleDot,
    color: "text-gray-200",
    borderColor: "border-gray-400/30",
    bgColor: "bg-gray-400/5",
    description: "Kim Loại – Sự vững chắc, giàu sang và quyết đoán",
    details: "Đại diện cho mùa Thu, hướng Tây. Kim cần Thủy để sinh và cần Mộc để phát tiết năng lượng.",
  },
  {
    element: "Mộc",
    icon: Wind,
    color: "text-green-400",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/5",
    description: "Gỗ – Sự tăng trưởng, sáng tạo và linh hoạt",
    details: "Đại diện cho mùa Xuân, hướng Đông. Mộc cần Thủy để sinh và Hỏa để phát huy tối đa.",
  },
  {
    element: "Thủy",
    icon: Droplets,
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/5",
    description: "Nước – Sự lưu chuyển, trí tuệ và thích ứng",
    details: "Đại diện cho mùa Đông, hướng Bắc. Thủy cần Kim để sinh và Mộc để phát tiết năng lượng.",
  },
  {
    element: "Hỏa",
    icon: Flame,
    color: "text-primary",
    borderColor: "border-primary/30",
    bgColor: "bg-primary/5",
    description: "Lửa – Năng lượng, đam mê và sự chiếu sáng",
    details: "Đại diện cho mùa Hạ, hướng Nam. Hỏa cần Mộc để sinh và Thổ để phát tiết năng lượng.",
  },
  {
    element: "Thổ",
    icon: Mountain,
    color: "text-amber-500",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/5",
    description: "Đất – Sự ổn định, nuôi dưỡng và bảo bọc",
    details: "Đại diện cho Trung tâm và giao thời 4 mùa. Thổ cần Hỏa để sinh và Kim để phát huy.",
  },
];

const articles = [
  {
    icon: Home,
    title: "Nguyên Lý Bát Trạch",
    desc: "Phân chia nhà ở thành 8 cung vị tương ứng với 8 hướng địa lý. Mỗi cung mang năng lượng khác nhau.",
    tag: "Phong Thủy Căn Bản",
  },
  {
    icon: Compass,
    title: "Huyền Không Phi Tinh",
    desc: "Hệ thống phong thủy nâng cao phân tích sự chuyển động của 9 ngôi sao năng lượng theo thời gian.",
    tag: "Nâng Cao",
  },
  {
    icon: BookOpen,
    title: "Tứ Trụ Mệnh Số",
    desc: "Phân tích vận mệnh qua 4 trụ: Năm sinh, Tháng sinh, Ngày sinh và Giờ sinh của mỗi người.",
    tag: "Mệnh Học",
  },
];

export function Knowledge() {
  return (
    <section id="knowledge" className="py-32 px-6 md:px-12 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <span className="tracking-[0.3em] uppercase text-gold text-sm" style={{ fontWeight: 700 }}>
              Kiến Thức
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 text-white" style={{ fontWeight: 700 }}>
            Ngũ Hành –{" "}
            <span className="text-primary">Triết Lý Vũ Trụ</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Năm yếu tố cơ bản tạo nên sự cân bằng và vận hành của vũ trụ theo triết học Á Đông
          </p>
        </motion.div>

        {/* Five Elements */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-24">
          {principles.map((p, index) => (
            <motion.div
              key={p.element}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`border ${p.borderColor} ${p.bgColor} p-6 text-center group cursor-default transition-all duration-300`}
            >
              <div className={`text-5xl mb-3 ${p.color}`} style={{ fontWeight: 800 }}>
                {p.element}
              </div>
              <p.icon className={`w-6 h-6 ${p.color} mx-auto mb-3 opacity-60`} strokeWidth={1.5} />
              <p className="text-gray-400 text-xs leading-relaxed mb-3">{p.description}</p>
              <p className="text-gray-600 text-[11px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {p.details}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cycle graphic */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-24 flex-wrap"
        >
          {["Kim → Thủy", "Thủy → Mộc", "Mộc → Hỏa", "Hỏa → Thổ", "Thổ → Kim"].map((cycle, i) => (
            <span key={i} className="text-gray-600 text-sm px-3 py-1 border border-white/5">
              {cycle}
            </span>
          ))}
          <span className="text-gold/50 text-sm ml-2">↺ Vòng Sinh</span>
        </motion.div>

        {/* Articles section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl text-white mb-10 text-center" style={{ fontWeight: 700 }}>
            Hệ Thống Kiến Thức <span className="text-gold">Song Vũ</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="group border border-white/8 p-6 hover:border-gold/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center">
                    <article.icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 border border-gold/20 px-2 py-1">
                    {article.tag}
                  </span>
                </div>
                <h4 className="text-white mb-3" style={{ fontWeight: 700 }}>
                  {article.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">{article.desc}</p>
                <div className="mt-4 h-px bg-gradient-to-r from-gold/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-14">
            <Link to="/kien-thuc">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 border border-gold/30 text-gold text-xs uppercase tracking-[0.3em] font-bold hover:bg-gold/5 transition-all"
              >
                Xem Toàn Bộ Kiến Thức
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}