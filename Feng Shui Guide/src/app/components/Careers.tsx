import { motion } from "motion/react";
import { Briefcase, Heart, Globe, Star, ArrowRight, Zap, Flame, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getJobs } from "../../lib/api";

interface Position {
  title: string;
  type: string;
  location: string;
  description: string;
  salary: string;
  hot?: boolean;
  urgent?: boolean;
}

export function Careers() {
  const [featuredJobs, setFeaturedJobs] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobs();
        if (res.success) {
          // Chỉ lấy những job nổi bật (is_hot hoặc is_urgent)
          const featured = res.data.filter((job: any) => job.is_hot || job.is_urgent);
          // Map database field names to component field names if necessary
          setFeaturedJobs(featured.map((j: any) => ({
            ...j,
            type: j.job_type === 'fulltime' ? 'Toàn thời gian' : j.job_type === 'parttime' ? 'Bán thời gian' : 'Thực tập sinh',
            salary: j.salary_range
          })));
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-4">
              Vị trí tuyển gấp
              <span className="h-0.5 w-12 bg-primary/30" />
            </h3>
            <Link to="/tuyen-dung" className="text-gold text-sm font-bold uppercase tracking-widest hover:text-gold/80 transition-colors flex items-center gap-2">
              Xem tất cả vị trí <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : featuredJobs.length > 0 ? (
            featuredJobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group p-8 bg-black/20 border border-white/5 rounded-2xl hover:bg-black/40 hover:border-gold/20 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {(job as any).is_hot && (
                        <span className="px-3 py-1 bg-red-600/20 text-red-400 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 border border-red-600/30">
                          <Flame className="w-3 h-3" /> Hot
                        </span>
                      )}
                      {(job as any).is_urgent && (
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 border border-amber-500/20">
                          <Zap className="w-3 h-3" /> Tuyển gấp
                        </span>
                      )}
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">
                        {job.type}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-gold" /> {job.location}
                      </span>
                    </div>
                    <Link to="/tuyen-dung">
                      <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                        {job.title}
                      </h4>
                    </Link>
                    <p className="text-gray-400 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-gold font-bold text-lg mb-4">{job.salary}</div>
                    <Link to="/tuyen-dung">
                      <button className="flex items-center gap-2 text-white/60 group-hover:text-white font-medium transition-colors">
                        Xem chi tiết <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-black/10 border border-white/5 rounded-3xl">
              <p className="text-white/30 italic">Hiện tại chưa có vị trí tuyển gấp nào.</p>
            </div>
          )}
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
