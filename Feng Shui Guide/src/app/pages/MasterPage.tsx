import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import {
  Star,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Award,
  Users,
  Clock,
  Quote,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Sparkles,
  GraduationCap,
  Globe,
  Feather,
} from "lucide-react";
import { Footer } from "../components/Footer.tsx";
import { BookingModal } from "../components/BookingModal.tsx";

const masterImg = "https://images.unsplash.com/photo-1768478563694-b9b38533f2f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwbWFzdGVyJTIwdGVhY2hlciUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc3NTc4OTA1Nnww&ixlib=rb-4.1.0&q=80&w=1080";
const caliImg = "https://images.unsplash.com/photo-1765188989032-eff7462279ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMENoaW5lc2UlMjBjYWxsaWdyYXBoeSUyMGluayUyMGJydXNoJTIwd3JpdGluZ3xlbnwxfHx8fDE3NzU4MDA3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080";
const gardenImg = "https://images.unsplash.com/photo-1765379911140-771ee36b4125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBc2lhbiUyMGdhcmRlbiUyMG1lZGl0YXRpb24lMjBwZWFjZWZ1bCUyMG5hdHVyZSUyMHplbnxlbnwxfHx8fDE3NzU4MDA3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080";
const ceremonyImg = "https://images.unsplash.com/photo-1703268643709-d86aa708f664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGlyaXR1YWwlMjBjb25zdWx0YXRpb24lMjBpbmNlbnNlJTIwY2FuZGxlJTIwY2VyZW1vbnklMjBkYXJrfGVufDF8fHx8MTc3NTgwMDcyNXww&ixlib=rb-4.1.0&q=80&w=1080";

const expertise = [
  {
    icon: BookOpen,
    title: "Bát Trạch",
    sub: "Phong Thủy Nhà Ở",
    desc: "Luận cung vị, phân tích hướng nhà và bố trí nội thất theo hệ thống Bát Trạch – phương pháp phổ biến và hiệu quả nhất trong phong thủy dân gian.",
  },
  {
    icon: Sparkles,
    title: "Huyền Không Phi Tinh",
    sub: "Cửu Cung Phi Tinh",
    desc: "Ứng dụng hệ thống Phi Tinh vào không gian sống để xác định vượng khí, suy khí và hung tinh theo từng giai đoạn thời gian.",
  },
  {
    icon: GraduationCap,
    title: "Tứ Trụ – Bát Tự",
    sub: "Tử Vi Mệnh Học",
    desc: "Luận giải vận mệnh qua ngày giờ sinh, phân tích Can Chi, Ngũ Hành để tìm hướng phát triển và hóa giải hạn vận.",
  },
  {
    icon: Feather,
    title: "Kỳ Môn Độn Giáp",
    sub: "Cổ Pháp Tối Thượng",
    desc: "Pháp thuật tối thượng trong hệ thống huyền học cổ đại Trung Hoa, ứng dụng để chọn thời điểm hành động và bố trí kh��ng gian chiến lược.",
  },
  {
    icon: Globe,
    title: "Loan Đầu Pháp",
    sub: "Địa Lý Phong Thủy",
    desc: "Khảo sát địa hình, sơn thủy, long mạch và minh đường để đánh giá tổng thể năng lượng của một mảnh đất hay công trình.",
  },
  {
    icon: Clock,
    title: "Chọn Ngày Tốt",
    sub: "Trạch Nhật Pháp",
    desc: "Lựa chọn ngày lành tháng tốt cho các sự kiện trọng đại: khai trương, cưới hỏi, động thổ, xuất hành theo đúng âm dương lịch.",
  },
];

const testimonials = [
  {
    name: "Anh Minh Phúc",
    role: "Giám đốc Công ty BĐS",
    text: "Sau khi điều chỉnh phong thủy văn phòng theo tư vấn của Thầy Song Vũ, doanh thu công ty tôi tăng gần 40% chỉ trong 6 tháng. Thầy rất tận tâm và chuyên nghiệp.",
    stars: 5,
  },
  {
    name: "Chị Lan Anh",
    role: "Chủ nhà hàng",
    text: "Thầy đã giúp tôi chọn ngày khai trương và bố trí nội thất chuẩn phong thủy. Nhà hàng liên tục đông khách từ ngày đầu tiên, điều tôi không ngờ tới.",
    stars: 5,
  },
  {
    name: "Anh Quang Huy",
    role: "Doanh nhân",
    text: "Tôi đã gặp nhiều thầy phong thủy nhưng Thầy Song Vũ là người giải thích khoa học và hệ thống nhất. Không mơ hồ, không phán xét, chỉ đưa ra giải pháp thực tiễn.",
    stars: 5,
  },
  {
    name: "Bà Ngọc Hà",
    role: "Gia chủ",
    text: "Thầy tư vấn phong thủy cho ngôi nhà mới của gia đình tôi. Sau khi vào nhà, gia đình thuận hòa, công việc của chồng và con cái đều hanh thông hơn rõ rệt.",
    stars: 5,
  },
];

const journey = [
  { year: "1994", title: "Bắt Đầu Học Đạo", desc: "Bắt đầu nghiên cứu triết học Á Đông, Kinh Dịch và phong thủy từ thư viện gia đình từ năm 18 tuổi." },
  { year: "2001", title: "Tu Học Chuyên Sâu", desc: "Thụ giáo trực tiếp từ các bậc thầy phong thủy danh tiếng tại Hà Nội và Trung Quốc." },
  { year: "2005", title: "Chứng Nhận Quốc Tế", desc: "Hoàn thành chương trình đào tạo phong thủy nâng cao tại Học viện Phong Thủy Hồng Kông." },
  { year: "2009", title: "Sáng Lập Song Vũ", desc: "Thành lập Phong Thủy Song Vũ, mang sứ mệnh đưa phong thủy khoa học đến với đại chúng." },
  { year: "2018", title: "Giảng Dạy & Đào Tạo", desc: "Bắt đầu giảng dạy phong thủy, đào tạo thế hệ chuyên gia kế thừa." },
  { year: "2024", title: "Tiên Phong AI", desc: "Ra mắt Trợ Lý AI Phong Thủy đầu tiên tại Việt Nam tích hợp trí tuệ nhân tạo." },
];

const books = [
  { title: "Phong Thủy Và Cuộc Sống Hiện Đại", year: "2015", desc: "Cẩm nang phong thủy ứng dụng cho nhà ở đô thị Việt Nam." },
  { title: "Huyền Không Phi Tinh Thực Hành", year: "2018", desc: "Hướng dẫn chi tiết ứng dụng Huyền Không vào không gian sống." },
  { title: "Bát Tự Mệnh Lý Nhập Môn", year: "2021", desc: "Giáo trình học Tứ Trụ từ cơ bản đến nâng cao cho người Việt." },
];

export function MasterPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={masterImg} alt="Thầy Song Vũ" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Back */}
        <div className="absolute top-28 left-6 z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Về trang chủ
          </Link>
        </div>

        <div className="relative container mx-auto px-6 pb-20 pt-32">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/35 mb-6 flex-wrap">
            <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/#master" className="hover:text-gold transition-colors">Giới Thiệu</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gold">Thầy Song Vũ</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary uppercase tracking-[0.2em] text-sm" style={{ fontWeight: 700 }}>Đại Sư Phong Thủy</span>
            </div>
            <h1 className="text-6xl md:text-8xl mb-4 leading-tight" style={{ fontWeight: 700 }}>
              Thầy <span className="text-gold">Song Vũ</span>
            </h1>
            <p className="text-gold/70 text-xl italic mb-6">Đại sư Phong Thủy – Kiến trúc Á Đông</p>
            <div className="flex items-center gap-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-gold text-gold" />)}
              <span className="text-gray-400 text-sm">4.9/5 từ 2,000+ đánh giá</span>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mt-10">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full transition-all shadow-xl shadow-primary/30"
                style={{ fontWeight: 700 }}
              >
                <Calendar className="w-5 h-5" />
                Đặt Lịch Gặp Thầy
              </motion.button>
              <motion.a
                href="#expertise"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 px-8 py-4 rounded-full transition-all"
                style={{ fontWeight: 600 }}
              >
                <BookOpen className="w-5 h-5" />
                Tìm Hiểu Thêm
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 bg-black border-y border-gold/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-gold rounded-full blur-[80px]" />
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Clock, value: "30+", label: "Năm Tu Học" },
              { icon: Users, value: "2,000+", label: "Khách Hàng" },
              { icon: Award, value: "500+", label: "Dự Án" },
              { icon: BookOpen, value: "3", label: "Sách Đã Xuất Bản" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <s.icon className="w-7 h-7 text-gold mx-auto mb-3" />
                <div className="text-4xl text-white mb-1" style={{ fontWeight: 700 }}>{s.value}</div>
                <div className="text-xs uppercase tracking-widest text-gray-500">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIO ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gold" />
                <span className="text-gold uppercase tracking-[0.2em] text-sm" style={{ fontWeight: 700 }}>Tiểu Sử</span>
              </div>
              <h2 className="text-4xl md:text-5xl mb-8 leading-tight" style={{ fontWeight: 700 }}>
                Hành Trình <span className="text-primary">Tu Học</span>{" "}
                <span className="text-gold">& Giác Ngộ</span>
              </h2>

              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  Thầy Song Vũ — tên thật là Nguyễn Song Vũ, sinh năm 1976 tại Hà Nội. Từ thuở thiếu thời, ông đã có duyên với triết học phương Đông qua bộ sưu tập sách cổ của gia đình, bao gồm Kinh Dịch, Hoàng Đế Nội Kinh và nhiều tài liệu phong thủy quý hiếm.
                </p>
                <p>
                  Năm 2001, ông chính thức thụ giáo từ Đại sư Lý Minh Quang tại Hà Nội — bậc thầy nổi tiếng với hơn 40 năm kinh nghiệm trong Huyền Không và Bát Trạch. Sau đó, ông tiếp tục tu học tại Học viện Phong Thủy Hồng Kông và hệ thống phong thủy truyền thống tại Phúc Kiến, Trung Quốc.
                </p>
                <p>
                  Trở về Việt Nam với kho tàng tri thức đồ sộ, Thầy Song Vũ quyết tâm xây dựng một nền phong thủy khoa học cho người Việt — không mê tín, không phán xét, chỉ có giải pháp thực tiễn và được kiểm chứng bởi thực tế.
                </p>
              </div>

              <div className="mt-10 bg-gold/5 border border-gold/20 p-6 relative">
                <Quote className="w-8 h-8 text-gold/30 absolute top-4 left-4" />
                <p className="text-gold/80 italic leading-relaxed pl-4">
                  "Phong thủy không phải là quyền năng huyền bí. Đó là khoa học về năng lượng — ai học được, ai hiểu được, người đó làm chủ cuộc đời mình."
                </p>
                <p className="text-gray-500 text-xs mt-3 pl-4">— Thầy Song Vũ</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative overflow-hidden shadow-2xl shadow-black/60">
                <img
                  src={caliImg}
                  alt="Thầy Song Vũ nghiên cứu"
                  className="w-full h-[480px] object-cover brightness-75 hover:brightness-90 transition-all duration-700"
                />
                <div className="absolute inset-0 border border-gold/20 pointer-events-none" />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full border border-gold/10 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-full h-full border border-primary/10 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── EXPERTISE ── */}
      <section id="expertise" className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold uppercase tracking-[0.2em] text-sm" style={{ fontWeight: 700 }}>Chuyên Môn</span>
              <div className="h-px w-12 bg-gold" />
            </div>
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 700 }}>
              Lĩnh Vực <span className="text-gold">Tinh Thông</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertise.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-gold/15 bg-gold/3 p-7 hover:border-gold/30 hover:bg-gold/5 transition-all group"
              >
                <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/15 transition-colors">
                  <exp.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>{exp.title}</h3>
                <p className="text-gold/60 text-xs mb-3 uppercase tracking-wider">{exp.sub}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{exp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary uppercase tracking-[0.2em] text-sm" style={{ fontWeight: 700 }}>Hành Trình</span>
              </div>
              <h2 className="text-4xl md:text-5xl mb-12 leading-tight" style={{ fontWeight: 700 }}>
                30 Năm <span className="text-primary">Tích Lũy</span>{" "}
                <span className="text-gold">Tri Thức</span>
              </h2>
              <div className="space-y-0">
                {journey.map((j, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex gap-5 group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-2 border-gold bg-black flex items-center justify-center shrink-0 z-10">
                        <span className="text-gold text-[9px]" style={{ fontWeight: 700 }}>{j.year}</span>
                      </div>
                      {i < journey.length - 1 && (
                        <div className="w-px flex-1 bg-gold/15 my-1" />
                      )}
                    </div>
                    <div className="pb-8">
                      <h4 className="text-white mb-1 group-hover:text-gold transition-colors" style={{ fontWeight: 700 }}>{j.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{j.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:sticky lg:top-28 space-y-6"
            >
              <div className="relative overflow-hidden shadow-2xl">
                <img
                  src={gardenImg}
                  alt="Triết lý Thầy Song Vũ"
                  className="w-full h-72 object-cover brightness-70"
                />
                <div className="absolute inset-0 border border-gold/20" />
              </div>

              {/* Books */}
              <div className="border border-gold/15 bg-gold/3 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="w-5 h-5 text-gold" />
                  <h3 className="text-white" style={{ fontWeight: 700 }}>Sách Đã Xuất Bản</h3>
                </div>
                <div className="space-y-4">
                  {books.map((b, i) => (
                    <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <span className="text-gold/40 text-sm shrink-0 mt-0.5">{b.year}</span>
                        <div>
                          <div className="text-white text-sm" style={{ fontWeight: 600 }}>{b.title}</div>
                          <div className="text-gray-500 text-xs mt-1">{b.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="border border-primary/15 bg-primary/3 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h3 className="text-white" style={{ fontWeight: 700 }}>Chứng Chỉ & Thành Tựu</h3>
                </div>
                {[
                  "Chứng chỉ Phong Thủy Quốc Tế – HK Feng Shui Institute (2005)",
                  "Hội Viên Hội Phong Thủy Châu Á – Pacific (2010)",
                  "Chứng nhận Đại Sư Huyền Không – Phúc Kiến, Trung Quốc (2012)",
                  "Giảng Viên Phong Thủy Chứng Nhận (2018)",
                ].map((cert, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-400 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {cert}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold uppercase tracking-[0.2em] text-sm" style={{ fontWeight: 700 }}>Khách Hàng Nói Gì</span>
              <div className="h-px w-12 bg-gold" />
            </div>
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 700 }}>
              Những <span className="text-gold">Câu Chuyện</span> Thực
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-gold/15 bg-gold/3 p-7 hover:border-gold/25 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-gold/25 mb-3" />
                <p className="text-gray-300 italic leading-relaxed mb-5 text-sm">"{t.text}"</p>
                <div>
                  <div className="text-white text-sm" style={{ fontWeight: 700 }}>{t.name}</div>
                  <div className="text-gold/60 text-xs mt-0.5">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gold rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden"
            >
              <img
                src={ceremonyImg}
                alt="Tư vấn phong thủy"
                className="w-full h-72 object-cover brightness-60"
              />
              <div className="absolute inset-0 border border-gold/20" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gold" />
                <span className="text-gold uppercase tracking-[0.2em] text-sm" style={{ fontWeight: 700 }}>Kết Nối Ngay</span>
              </div>
              <h2 className="text-4xl md:text-5xl mb-6 leading-tight" style={{ fontWeight: 700 }}>
                Sẵn Sàng Gặp Gỡ{" "}
                <span className="text-gold">Thầy Song Vũ?</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Chỉ cần một buổi tư vấn, bạn sẽ hiểu tại sao hàng nghìn gia đình và doanh nghiệp tin tưởng trao gửi không gian sống của mình cho Thầy Song Vũ.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  "Lịch hẹn linh hoạt — trực tiếp, online hoặc qua điện thoại",
                  "Tư vấn bảo mật tuyệt đối, không tiết lộ thông tin khách hàng",
                  "Báo cáo chi tiết sau mỗi buổi tư vấn",
                  "Hỗ trợ theo dõi sau tư vấn không giới hạn",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsBookingOpen(true)}
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full transition-all shadow-xl shadow-primary/20"
                  style={{ fontWeight: 700 }}
                >
                  <Calendar className="w-5 h-5" />
                  Đặt Lịch Ngay
                </motion.button>
                <motion.a
                  href="tel:+84912345678"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 px-8 py-4 rounded-full transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Liên Hệ Trực Tiếp
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
