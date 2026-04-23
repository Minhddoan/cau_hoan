import { motion } from "motion/react";
import { Link } from "react-router";
import {
  CheckCircle2,
  Award,
  Users,
  Target,
  Star,
  ArrowLeft,
  Eye,
  Heart,
  Shield,
  Leaf,
  TrendingUp,
  Home,
  Building2,
  Clock,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Footer } from "../components/Footer.tsx";

const heroImg =
  "https://images.unsplash.com/photo-1623351143485-b1d4937747f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cmFkaXRpb25hbCUyMEFzaWFuJTIwb2ZmaWNlJTIwaW50ZXJpb3IlMjBkYXJrfGVufDF8fHx8MTc3NTc5MDI0N3ww&ixlib=rb-4.1.0&q=80&w=1080";
const templeImg =
  "https://images.unsplash.com/photo-1773752867910-743cf44021ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6ZW4lMjBtZWRpdGF0aW9uJTIwc3Bpcml0dWFsJTIwYW5jaWVudCUyMHRlbXBsZXxlbnwxfHx8fDE3NzU3OTAyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const teamImg =
  "https://images.unsplash.com/photo-1758691737278-3af15b37af48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMHByb2Zlc3Npb25hbCUyMEFzaWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzc1NzkwMjUyfDA&ixlib=rb-4.1.0&q=80&w=1080";
const buildingImg =
  "https://images.unsplash.com/photo-1754078226734-a3a10f467f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaWV0bmFtZXNlJTIwYXJjaGl0ZWN0dXJlJTIwaGVyaXRhZ2UlMjBidWlsZGluZyUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc3NTc5MDI1NXww&ixlib=rb-4.1.0&q=80&w=1080";

const stats = [
  { icon: Award, label: "Năm Kinh Nghiệm", value: "15+" },
  { icon: Users, label: "Khách Hàng", value: "2,000+" },
  { icon: Target, label: "Dự Án", value: "500+" },
  { icon: Globe, label: "Tỉnh / Thành", value: "30+" },
];

const coreValues = [
  {
    icon: Eye,
    title: "Tầm Nhìn",
    desc: "Trở thành đơn vị phong thủy số 1 Việt Nam, mang tri thức Á Đông đến mọi không gian sống hiện đại.",
    color: "text-gold",
    border: "border-gold/20",
    bg: "bg-gold/5",
  },
  {
    icon: Heart,
    title: "Sứ Mệnh",
    desc: "Mang lại thịnh vượng và bình an cho từng gia đình, doanh nghiệp thông qua giải pháp phong thủy khoa học và nhân văn.",
    color: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5",
  },
  {
    icon: Shield,
    title: "Cam Kết",
    desc: "Tư vấn tận tâm, bảo mật tuyệt đối và đồng hành cùng khách hàng trọn đời trong mọi hành trình phong thủy.",
    color: "text-gold",
    border: "border-gold/20",
    bg: "bg-gold/5",
  },
];

const milestones = [
  {
    year: "2009",
    title: "Thành Lập",
    desc: "Phong Thủy Song Vũ ra đời với đội ngũ 3 chuyên gia, bắt đầu từ các dự án nhà ở tại Hà Nội.",
  },
  {
    year: "2013",
    title: "Mở Rộng",
    desc: "Mở rộng hoạt động vào TP.HCM và các tỉnh miền Nam, phục vụ hàng trăm khách hàng doanh nghiệp.",
  },
  {
    year: "2017",
    title: "Ra Mắt Sản Phẩm",
    desc: "Giới thiệu dòng sản phẩm vật phẩm phong thủy cao cấp – Linh Vật, Trầm Hương, Trang Sức.",
  },
  {
    year: "2020",
    title: "Số Hóa",
    desc: "Triển khai nền tảng tư vấn online, phục vụ khách hàng toàn quốc và kiều bào hải ngoại.",
  },
  {
    year: "2024",
    title: "Trợ Lý AI",
    desc: "Tích hợp Trợ Lý AI Phong Thủy – công cụ tra cứu và tư vấn thông minh đầu tiên tại Việt Nam.",
  },
];

const services = [
  { icon: Home, label: "Phong Thủy Nhà Ở", count: "800+ dự án" },
  { icon: Building2, label: "Phong Thủy Văn Phòng", count: "300+ dự án" },
  { icon: TrendingUp, label: "Phong Thủy Kinh Doanh", count: "400+ dự án" },
  { icon: Leaf, label: "Vật Phẩm Phong Thủy", count: "5,000+ sản phẩm" },
];

const team = [
  { name: "Thầy Song Vũ", title: "Đại Sư – Sáng Lập", years: "15+ năm" },
  { name: "Thầy Minh Tuệ", title: "Chuyên Gia Bát Trạch", years: "12+ năm" },
  { name: "Cô Lan Hương", title: "Chuyên Gia Tứ Trụ", years: "10+ năm" },
  { name: "Thầy Quang Khải", title: "Chuyên Gia Huyền Không", years: "8+ năm" },
];

function SectionLabel({ text, color = "gold" }: { text: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`h-px w-12 ${color === "primary" ? "bg-primary" : "bg-gold"}`} />
      <span
        className={`${color === "primary" ? "text-primary" : "text-gold"} uppercase tracking-[0.2em] text-sm`}
        style={{ fontWeight: 700 }}
      >
        {text}
      </span>
    </div>
  );
}

export function CompanyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Phong Thủy Song Vũ" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        {/* Back button */}
        <div className="absolute top-28 left-6 z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Về trang chủ
          </Link>
        </div>

        <div className="relative container mx-auto px-6 pb-20 pt-32">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
            <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gold">Giới Thiệu Công Ty</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel text="Về Chúng Tôi" />
            <h1 className="text-5xl md:text-7xl mb-6 leading-tight" style={{ fontWeight: 700 }}>
              Phong Thủy <br />
              <span className="text-primary">Song Vũ</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Hơn 15 năm đồng hành, hàng nghìn gia đình thịnh vượng — chúng tôi không chỉ tư vấn phong thủy, chúng tôi kiến tạo cuộc sống.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-black border-y border-gold/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-gold rounded-full blur-[80px]" />
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                <div className="text-4xl text-white mb-1" style={{ fontWeight: 700 }}>{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative overflow-hidden shadow-2xl shadow-black/60">
                <img
                  src={templeImg}
                  alt="Câu chuyện thành lập"
                  className="w-full h-[500px] object-cover brightness-75 hover:brightness-90 transition-all duration-700"
                />
                <div className="absolute inset-0 border border-gold/20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-black/80 backdrop-blur-sm border border-gold/20 p-4">
                    <p className="text-gold/90 italic text-sm leading-relaxed">
                      "Thiên thời – Địa lợi – Nhân hòa. Phong thủy là nghệ thuật cân bằng ba yếu tố bất biến của vũ trụ."
                    </p>
                    <p className="text-gray-500 text-xs mt-2">— Triết lý sáng lập Phong Thủy Song Vũ</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full border border-gold/15 -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:pl-8"
            >
              <SectionLabel text="Câu Chuyện Của Chúng Tôi" />
              <h2 className="text-4xl md:text-5xl mb-8 leading-tight" style={{ fontWeight: 700 }}>
                Từ Đam Mê <span className="text-primary">Đến</span>{" "}
                <span className="text-gold">Sứ Mệnh</span>
              </h2>
              <div className="space-y-5 text-gray-400 text-base leading-relaxed">
                <p>
                  Phong Thủy Song Vũ được thành lập năm 2009 từ tâm huyết của Thầy Song Vũ — một con người dành trọn tuổi trẻ để nghiên cứu triết học phong thủy cổ đại từ các bộ sách kinh điển của người Hán và các luồng phong thủy Á Đông.
                </p>
                <p>
                  Nhận thấy phong thủy tại Việt Nam thường bị đơn giản hóa hoặc hiểu sai theo hướng mê tín, Thầy Song Vũ quyết tâm xây dựng một nền tảng tư vấn phong thủy khoa học, hệ thống và minh bạch — kết hợp nhuần nhuyễn giữa tri thức cổ đại và đời sống hiện đại.
                </p>
                <p>
                  Sau 15 năm phát triển, Phong Thủy Song Vũ đã trở thành địa chỉ tin cậy của hơn 2,000 gia đình và doanh nghiệp khắp cả nước, từ những căn nhà phố bình dị đến những tập đoàn lớn cần định hướng phong thủy chiến lược.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel text="Giá Trị Cốt Lõi" />
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 700 }}>
              Ba Trụ Cột <span className="text-gold">Tạo Nên Chúng Tôi</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`border ${val.border} ${val.bg} p-10 relative group hover:scale-105 transition-transform duration-300`}
              >
                <div className={`${val.color} mb-6`}>
                  <val.icon className="w-12 h-12" />
                </div>
                <h3 className={`text-2xl mb-4 ${val.color}`} style={{ fontWeight: 700 }}>{val.title}</h3>
                <p className="text-gray-400 leading-relaxed">{val.desc}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-px ${val.color === "text-gold" ? "bg-gold/20" : "bg-primary/20"} group-hover:bg-gold/60 transition-colors`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MILESTONES ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel text="Hành Trình Phát Triển" />
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 700 }}>
              Những <span className="text-primary">Cột Mốc</span>{" "}
              <span className="text-gold">Đáng Nhớ</span>
            </h2>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold/20 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div
                      className={`inline-block border border-gold/20 bg-gold/5 p-6 max-w-sm ${i % 2 === 0 ? "md:ml-auto" : ""}`}
                    >
                      <h3 className="text-xl text-white mb-2" style={{ fontWeight: 700 }}>{m.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-black border-2 border-gold flex items-center justify-center z-10">
                    <span className="text-gold text-xs" style={{ fontWeight: 700 }}>{m.year}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW ── */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <SectionLabel text="Lĩnh Vực Hoạt Động" color="primary" />
              <h2 className="text-4xl md:text-5xl mb-8 leading-tight" style={{ fontWeight: 700 }}>
                Toàn Diện Từ{" "}
                <span className="text-primary">Tư Vấn</span>{" "}
                Đến{" "}
                <span className="text-gold">Vật Phẩm</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {services.map((svc, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-white/5 bg-white/2 hover:border-gold/20 transition-colors">
                    <div className="w-10 h-10 bg-gold/10 flex items-center justify-center shrink-0">
                      <svc.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="text-white text-sm" style={{ fontWeight: 600 }}>{svc.label}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{svc.count}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  "Tư vấn phong thủy theo từng hệ phái: Bát Trạch, Huyền Không, Tứ Trụ",
                  "Đội ngũ chuyên gia được đào tạo bài bản, có chứng chỉ quốc tế",
                  "Quy trình tư vấn minh bạch, có báo cáo chi tiết cho mỗi dự án",
                  "Hậu mãi và theo dõi định kỳ sau khi hoàn tất tư vấn",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-gray-400">
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative overflow-hidden shadow-2xl">
                <img
                  src={buildingImg}
                  alt="Lĩnh vực hoạt động"
                  className="w-full h-[480px] object-cover brightness-75 hover:brightness-90 transition-all duration-700"
                />
                <div className="absolute inset-0 border border-gold/20 pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-primary/10 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <SectionLabel text="Đội Ngũ Chuyên Gia" />
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 700 }}>
              Những Người <span className="text-gold">Tạo Ra Kỳ Tích</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-gold/15 bg-gold/3 p-8 text-center hover:border-gold/30 hover:bg-gold/5 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                  <Users className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-white text-lg mb-1" style={{ fontWeight: 700 }}>{member.name}</h3>
                <p className="text-gold/70 text-sm mb-2">{member.title}</p>
                <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {member.years}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Team Photo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
          >
            <img
              src={teamImg}
              alt="Đội ngũ Phong Thủy Song Vũ"
              className="w-full h-64 object-cover brightness-60"
            />
            <div className="absolute inset-0 border border-gold/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-lg italic">Đội ngũ chuyên gia Phong Thủy Song Vũ</p>
                <div className="flex justify-center gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">4.9/5 từ 2,000+ đánh giá khách hàng</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gold rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel text="Bắt Đầu Hành Trình" />
            <h2 className="text-4xl md:text-5xl mb-6" style={{ fontWeight: 700 }}>
              Sẵn Sàng Thay Đổi{" "}
              <span className="text-gold">Vận Khí</span>{" "}
              Của Bạn?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Hãy để Phong Thủy Song Vũ đồng hành cùng bạn trên hành trình kiến tạo một không gian sống thịnh vượng và bình an.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#contact"
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full transition-all shadow-xl shadow-primary/20"
                style={{ fontWeight: 700 }}
              >
                Đặt Lịch Tư Vấn
              </Link>
              <Link
                to="/#master"
                className="inline-flex items-center gap-3 border border-gold/40 hover:border-gold text-gold px-10 py-4 rounded-full transition-all hover:bg-gold/5"
                style={{ fontWeight: 600 }}
              >
                Gặp Thầy Song Vũ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
