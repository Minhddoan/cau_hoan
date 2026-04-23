import { motion } from "motion/react";
import { Briefcase, Heart, Globe, Star, ArrowRight } from "lucide-react";

export function Careers() {
  const positions = [
    {
      title: "Chuyên Gia Tư Vấn Phong Thủy",
      type: "Toàn thời gian",
      location: "TP. Hồ Chí Minh",
      description: "Tư vấn phong thủy nhà ở, văn phòng cho khách hàng cao cấp.",
      salary: "Cạnh tranh",
    },
    {
      title: "Kiến Trúc Sư Nội Thất (Chuẩn Phong Thủy)",
      type: "Toàn thời gian",
      location: "Hà Nội",
      description: "Thiết kế không gian nội thất kết hợp các nguyên lý phong thủy hiện đại.",
      salary: "20tr - 35tr",
    },
    {
      title: "Chuyên Viên Digital Marketing",
      type: "Cộng tác viên / Freelance",
      location: "Làm việc từ xa",
      description: "Phát triển nội dung và chiến dịch quảng bá về phong thủy và tâm linh.",
      salary: "Thỏa thuận",
    },
  ];

  const benefits = [
    { icon: Heart, label: "Môi trường làm việc an nhiên", desc: "Không gian làm việc thiền định, hài hòa." },
    { icon: Globe, label: "Học hỏi trí tuệ cổ xưa", desc: "Đào tạo chuyên sâu về kiến thức phong thủy." },
    { icon: Star, label: "Cơ hội thăng tiến", desc: "Lộ trình phát triển nghề nghiệp rõ ràng." },
    { icon: Briefcase, label: "Đãi ngộ xứng đáng", desc: "Lương thưởng hấp dẫn và bảo hiểm đầy đủ." },
  ];

  return (
    <section id="careers" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block border border-gold/40 px-6 py-2 mb-6"
          >
            <span className="text-gold uppercase tracking-[0.2em] font-bold text-sm">Tuyển Dụng</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Đồng Hành Cùng <span className="text-primary font-bold">Song Vũ</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Chúng tôi luôn tìm kiếm những tâm hồn đồng điệu, khao khát mang lại giá trị tốt đẹp cho cộng đồng thông qua trí tuệ phong thủy.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-black/40 border border-white/5 rounded-2xl hover:border-gold/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{benefit.label}</h4>
              <p className="text-gray-500 text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Jobs List */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
            Vị trí đang tuyển dụng
            <span className="h-0.5 flex-1 bg-white/5" />
          </h3>
          
          {positions.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group p-8 bg-black/20 border border-white/5 rounded-2xl hover:bg-black/40 hover:border-gold/20 transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">
                      {job.type}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-gold" /> {job.location}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                    {job.title}
                  </h4>
                  <p className="text-gray-400">{job.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-gold font-bold text-lg mb-4">{job.salary}</div>
                  <button className="flex items-center gap-2 text-white/60 group-hover:text-white font-medium transition-colors">
                    Ứng tuyển ngay <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 bg-primary rounded-3xl text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-6">Bạn không thấy vị trí phù hợp?</h3>
            <p className="text-white/80 mb-10 max-w-xl mx-auto">
              Hãy gửi CV cho chúng tôi, Song Vũ luôn sẵn sàng chào đón những nhân tài khao khát cống hiến.
            </p>
            <button className="bg-white text-primary px-12 py-4 rounded-full font-bold hover:bg-gold hover:text-white transition-all">
              Gửi hồ sơ tự do
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </motion.div>
      </div>
    </section>
  );
}
