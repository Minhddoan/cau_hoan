import { motion } from "motion/react";
import { useState } from "react";
import { CheckCircle2, Award, Users, Target, Star, ArrowRight, Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router";
import { BookingModal } from "./BookingModal.tsx";

const masterImg = "https://images.unsplash.com/photo-1768478563694-b9b38533f2f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwbWFzdGVyJTIwdGVhY2hlciUyMHRyYWRpdGlvbmFsfGVufDF8fHx8MTc3NTc4OTA1Nnww&ixlib=rb-4.1.0&q=80&w=1080";
const companyImg = "https://images.unsplash.com/photo-1531364380693-8f16a988e6d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW5nJTIwc2h1aSUyMHplbiUyMGludGVyaW9yJTIwbHV4dXJ5JTIwZGFya3xlbnwxfHx8fDE3NTc4OTA1Nnww&ixlib=rb-4.1.0&q=80&w=1080";

export function About() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const stats = [
    { icon: Award, label: "Năm Kinh Nghiệm", value: "15+" },
    { icon: Users, label: "Khách Hàng", value: "2,000+" },
    { icon: Target, label: "Dự Án", value: "500+" },
  ];

  return (
    <>
      {/* Về Công Ty */}
      <section id="about" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 overflow-hidden shadow-2xl shadow-black/60">
                <img
                  src={companyImg}
                  alt="Phong Thủy Song Vũ"
                  className="w-full h-[480px] object-cover brightness-75 hover:brightness-90 transition-all duration-700"
                />
                {/* Gold frame overlay */}
                <div className="absolute inset-0 border border-gold/20 pointer-events-none" />
              </div>
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border border-gold/20 -z-10" />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-primary/10 -z-10" />

              {/* Stats Overlay */}
              <div className="absolute -bottom-8 left-6 right-6 bg-black/95 backdrop-blur-xl border border-gold/20 p-6 z-20 hidden md:flex justify-between items-center shadow-2xl">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center px-4 border-r last:border-0 border-white/10">
                    <stat.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                    <div className="text-2xl text-white" style={{ fontWeight: 700 }}>{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:pl-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gold" />
                <span className="text-gold uppercase tracking-[0.2em] text-sm" style={{ fontWeight: 700 }}>Về Chúng Tôi</span>
              </div>
              <h2 className="text-4xl md:text-5xl mb-8 leading-tight" style={{ fontWeight: 700 }}>
                Sứ Mệnh Mang Lại{" "}
                <span className="text-primary">Thịnh Vượng</span>{" "}
                &{" "}
                <span className="text-gold">Bình An</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Phong Thủy Song Vũ được thành lập từ tâm huyết mong muốn mang trí tuệ cổ xưa của triết lý Á Đông áp dụng vào kiến trúc và không gian sống hiện đại. Chúng tôi tin rằng, một không gian sống hài hòa với năng lượng vũ trụ chính là chìa khóa để khai mở tiềm năng, sức khỏe và tài lộc của mỗi gia chủ.
              </p>

              <ul className="space-y-3 mb-10">
                {[
                  "Chuyên gia phong thủy hàng đầu Việt Nam",
                  "Giải pháp thiết kế chuẩn phong thủy khoa học",
                  "Dịch vụ tư vấn tận tâm và bảo mật tuyệt đối",
                  "Hỗ trợ trọn đời cho mọi dự án",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/75">
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Buttons row */}
              <div className="flex flex-wrap gap-4 items-center">
                <motion.a
                  href="#master"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full transition-all shadow-xl shadow-primary/20 cursor-pointer"
                  style={{ fontWeight: 700 }}
                >
                  Gặp gỡ Thầy Song Vũ
                </motion.a>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/gioi-thieu"
                    className="inline-flex items-center gap-2 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 px-8 py-4 rounded-full transition-all"
                    style={{ fontWeight: 600 }}
                  >
                    Xem nhiều hơn về chúng tôi
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Thầy Song Vũ */}
      <section id="master" className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="text-primary uppercase tracking-[0.2em] text-sm" style={{ fontWeight: 700 }}>Chuyên Gia</span>
              </div>
              <h2 className="text-4xl md:text-5xl mb-4 leading-tight" style={{ fontWeight: 700 }}>
                Thầy <span className="text-gold">Song Vũ</span>
              </h2>
              <p className="text-gold/70 text-lg mb-8 italic">Đại sư Phong Thủy – Kiến trúc Á Đông</p>

              <p className="text-gray-400 leading-relaxed mb-6">
                Với hơn 15 năm tu học và thực hành phong thủy theo hệ thống Bát Trạch – Huyền Không, Thầy Song Vũ đã tư vấn thành công cho hàng nghìn gia đình và doanh nghiệp trên khắp cả nước. Mỗi công trình đều mang dấu ấn cân bằng Âm Dương, thu hút vượng khí và hóa giải những hung sát.
              </p>
              <p className="text-gray-500 leading-relaxed mb-10">
                Thầy cũng là tác giả của nhiều bài viết chuyên sâu về phong thủy hiện đại, kết hợp nhuần nhuyễn giữa triết học cổ điển và khoa học ứng dụng đương đại.
              </p>

              {/* Expertise */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { label: "Bát Trạch", desc: "Phong thủy nhà ở" },
                  { label: "Huyền Không", desc: "Phi tinh cửu cung" },
                  { label: "Tứ Trụ", desc: "Tử vi mệnh số" },
                  { label: "Kỳ Môn", desc: "Độn giáp cổ pháp" },
                ].map((exp, i) => (
                  <div key={i} className="border border-gold/15 p-4 bg-gold/3 hover:border-gold/30 transition-colors">
                    <div className="text-gold text-sm" style={{ fontWeight: 700 }}>{exp.label}</div>
                    <div className="text-gray-500 text-xs mt-1">{exp.desc}</div>
                  </div>
                ))}
              </div>

              {/* Stars */}
              <div className="flex items-center gap-2 text-gold/80">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
                <span className="text-gray-400 text-sm ml-2">4.9/5 từ 2,000+ đánh giá</span>
              </div>

              {/* Buttons for master section */}
              <div className="flex flex-wrap gap-4 mt-10">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsBookingOpen(true)}
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full transition-all shadow-xl shadow-primary/20"
                  style={{ fontWeight: 700 }}
                >
                  <Calendar className="w-5 h-5" />
                  Đặt Lịch Gặp Thầy
                </motion.button>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/thay-song-vu"
                    className="inline-flex items-center gap-2 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 px-8 py-4 rounded-full transition-all"
                    style={{ fontWeight: 600 }}
                  >
                    <BookOpen className="w-4 h-4" />
                    Tìm hiểu thêm về Thầy
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative overflow-hidden shadow-2xl">
                <img
                  src={masterImg}
                  alt="Thầy Song Vũ"
                  className="w-full h-[520px] object-cover object-top brightness-75 hover:brightness-90 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 border border-gold/20 pointer-events-none" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-black/80 backdrop-blur-sm border border-gold/20 p-4">
                    <p className="text-gold/90 italic text-sm leading-relaxed">
                      "Phong thủy không phải là mê tín, mà là nghệ thuật sắp xếp không gian thuận theo quy luật tự nhiên."
                    </p>
                    <p className="text-gray-500 text-xs mt-2">— Thầy Song Vũ</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full border border-gold/15 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* BookingModal rendered at root level of About (outside sections) */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}