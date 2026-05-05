import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  CheckCircle2,
  Calendar,
  Heart,
  Building2,
  Home,
  Hammer,
  Plane,
  FileSignature,
  Baby,
  Sparkles,
  Clock,
  Star,
  Phone,
  ChevronLeft,
  Plus,
  Minus,
  ArrowRight,
  Info,
  Sun,
  Moon,
  Loader2
} from "lucide-react";
import { useSettings } from "../context/SettingsContext.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { toast } from "sonner";
import { getServices } from "../../lib/api";

const heroImg    = "https://images.unsplash.com/photo-1597559660288-29a2e2518036?w=1600";
const weddingImg = "https://images.unsplash.com/photo-1761668572818-e03a4f8fc716?w=800";
const buildImg   = "https://images.unsplash.com/photo-1704308875463-79b12d868d86?w=800";

const EVENT_TYPES = [
  { id: "cuoi",       label: "Cưới Hỏi",        icon: Heart,         color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20",   desc: "Xem ngày tốt cho lễ đính hôn, lễ cưới, lễ hỏi, rước dâu" },
  { id: "khaitruong", label: "Khai Trương",      icon: Building2,     color: "text-gold",       bg: "bg-gold/10",       border: "border-gold/20",      desc: "Ngày hoàng đạo khai trương cửa hàng, văn phòng, doanh nghiệp" },
  { id: "nhaptrang",  label: "Nhập Trạch",       icon: Home,          color: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-400/20", desc: "Chọn ngày tốt để dọn vào nhà mới, nhập trạch an cư" },
  { id: "dongho",     label: "Động Thổ",         icon: Hammer,        color: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20", desc: "Xem ngày khởi công xây dựng, sửa chữa nhà cửa, cải tạo" },
  { id: "xuathanh",   label: "Xuất Hành",        icon: Plane,         color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20",  desc: "Ngày tốt cho xuất hành, đi xa, ký hợp đồng ngoại giao" },
  { id: "kyhd",       label: "Ký Hợp Đồng",     icon: FileSignature, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20",desc: "Chọn ngày thuận lợi để ký kết hợp đồng, thỏa thuận quan trọng" },
  { id: "dattenbe",   label: "Đặt Tên / Đặt Cữ",icon: Baby,          color: "text-pink-400",   bg: "bg-pink-400/10",   border: "border-pink-400/20",  desc: "Xem ngày tốt để đặt tên con, làm lễ đặt cữ, đầy tháng" },
  { id: "khac",       label: "Việc Khác",        icon: Sparkles,      color: "text-white/60",   bg: "bg-white/5",       border: "border-white/10",     desc: "Các sự kiện quan trọng khác: nhậm chức, thi cử, chữa bệnh..." },
];

const HOW_IT_WORKS = [
  { step: "01", icon: Phone,     title: "Gửi Yêu Cầu",      desc: "Liên hệ qua Zalo / Website cung cấp loại sự kiện, tuổi (ngày/tháng/năm sinh) và thời gian dự kiến muốn tổ chức.",       color: "text-gold",    border: "border-gold/30"    },
  { step: "02", icon: Calendar,  title: "Phân Tích Mệnh",    desc: "Thầy Song Vũ phân tích Tứ Trụ, Bát Tự, Can Chi của bạn để xác định các yếu tố cần tránh và ngày hướng tốt.",             color: "text-red-400", border: "border-red-400/30" },
  { step: "03", icon: Sun,       title: "Tra Lịch & Lọc",    desc: "Đối chiếu với Vạn Niên Lịch, Hiệp Kỷ Lịch, Hoàng Đạo Lục Hợp và Nhị Thập Bát Tú để lọc ra ngày tốt nhất.",            color: "text-gold",    border: "border-gold/30"    },
  { step: "04", icon: Star,      title: "Nhận Kết Quả",      desc: "Bạn nhận được báo cáo chi tiết với các ngày tốt được sắp xếp ưu tiên, kèm giờ hoàng đạo và nghi lễ cần chuẩn bị.",       color: "text-red-400", border: "border-red-400/30" },
];

const MONTH_SAMPLE = [
  { day: 1,  lunar: "M4/5",  rating: "normal", star: "" },
  { day: 2,  lunar: "M4/6",  rating: "good",   star: "✦" },
  { day: 3,  lunar: "M4/7",  rating: "bad",    star: "" },
  { day: 4,  lunar: "M4/8",  rating: "normal", star: "" },
  { day: 5,  lunar: "M4/9",  rating: "normal", star: "" },
  { day: 6,  lunar: "M4/10", rating: "great",  star: "★" },
  { day: 7,  lunar: "M4/11", rating: "normal", star: "" },
  { day: 8,  lunar: "M4/12", rating: "bad",    star: "" },
  { day: 9,  lunar: "M4/13", rating: "good",   star: "✦" },
  { day: 10, lunar: "M4/14", rating: "normal", star: "" },
  { day: 11, lunar: "M4/15", rating: "great",  star: "★" },
  { day: 12, lunar: "M4/16", rating: "normal", star: "" },
  { day: 13, lunar: "M4/17", rating: "bad",    star: "" },
  { day: 14, lunar: "M4/18", rating: "normal", star: "" },
  { day: 15, lunar: "M4/19", rating: "normal", star: "" },
  { day: 16, lunar: "M4/20", rating: "good",   star: "✦" },
  { day: 17, lunar: "M4/21", rating: "normal", star: "" },
  { day: 18, lunar: "M4/22", rating: "bad",    star: "" },
  { day: 19, lunar: "M4/23", rating: "great",  star: "★" },
  { day: 20, lunar: "M4/24", rating: "normal", star: "" },
  { day: 21, lunar: "M4/25", rating: "normal", star: "" },
  { day: 22, lunar: "M4/26", rating: "good",   star: "✦" },
  { day: 23, lunar: "M4/27", rating: "normal", star: "" },
  { day: 24, lunar: "M4/28", rating: "bad",    star: "" },
  { day: 25, lunar: "M4/29", rating: "normal", star: "" },
  { day: 26, lunar: "M5/1",  rating: "great",  star: "★" },
  { day: 27, lunar: "M5/2",  rating: "normal", star: "" },
  { day: 28, lunar: "M5/3",  rating: "bad",    star: "" },
  { day: 29, lunar: "M5/4",  rating: "good",   star: "✦" },
  { day: 30, lunar: "M5/5",  rating: "normal", star: "" },
];

const ratingStyle = {
  great:  { bg: "bg-gold/15",       border: "border-gold/40",       text: "text-gold",       label: "Đại Cát" },
  good:   { bg: "bg-green-400/10",  border: "border-green-400/30",  text: "text-green-400",  label: "Cát"     },
  normal: { bg: "bg-white/3",       border: "border-white/5",       text: "text-white/50",   label: ""        },
  bad:    { bg: "bg-red-900/10",    border: "border-red-900/30",    text: "text-red-400/60", label: "Hung"    },
};

const FAQS = [
  { q: "Xem ngày có cần biết giờ sinh không?",                   a: "Để xem ngày chính xác, cần cung cấp đầy đủ ngày tháng năm sinh (dương lịch hoặc âm lịch). Nếu biết giờ sinh thì càng tốt vì giờ sinh ảnh hưởng đến Tứ Trụ. Trường hợp không có giờ sinh, chúng tôi vẫn có thể xem dựa trên 3 trụ còn lại với độ chính xác cao." },
  { q: "Có thể xem ngày khẩn cấp trong 24 giờ không?",           a: "Có. Gói Xem Ngày Khẩn Cấp (phụ phí 50%) cho phép nhận kết quả trong 24 giờ làm việc. Liên hệ trực tiếp qua hotline hoặc Zalo để được hỗ trợ ưu tiên. Tuy nhiên với những sự kiện quan trọng như cưới hỏi hay khai trương, nên đặt lịch trước ít nhất 1–2 tháng để có nhiều lựa chọn ngày tốt hơn." },
  { q: "Xem ngày theo âm lịch hay dương lịch?",                  a: "Kết quả sẽ cung cấp cả hai lịch để tiện theo dõi. Phong thủy truyền thống tính theo âm lịch và Can Chi nhưng kết quả luôn được chuyển đổi sang dương lịch đầy đủ, kèm giờ hoàng đạo theo giờ địa phương để bạn dễ áp dụng thực tế." },
  { q: "Hai người (cô dâu – chú rể) có cùng xem chung một ngày không?", a: "Đây là tình huống phổ biến trong xem ngày cưới. Chúng tôi sẽ phân tích mệnh của cả hai người, tìm ngày không xung với ai trong cặp đôi, ưu tiên ngày lục hợp hoặc tam hợp với mệnh của cả hai. Nếu khó tìm ngày hoàn hảo, sẽ chọn ngày tốt nhất theo mệnh người chủ lễ." },
  { q: "Kết quả xem ngày có bảo đảm không?",                     a: "Phong thủy không thể bảo đảm 100% kết quả vì còn phụ thuộc vào nỗ lực cá nhân và nhiều yếu tố khác. Tuy nhiên, chọn ngày đúng giúp khởi đầu thuận lợi, giảm cản trở và tăng năng lượng tích cực cho sự kiện. Cam kết mọi kết quả đều dựa trên phương pháp học thuật chính thống, không phán đoán cảm tính." },
];

export function AuspiciousDatePage() {
  const { setBookingOpen, setLoginOpen } = useSettings();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedDay, setSelectedDay]     = useState<number | null>(null);
  const [calMonth, setCalMonth]           = useState(5);
  const [openFaq, setOpenFaq]             = useState<number | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [activePackageId, setActivePackageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBookingClick = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt lịch xem ngày tốt.", {
        action: { label: "Đăng nhập ngay", onClick: () => setLoginOpen(true) }
      });
      return;
    }
    setBookingOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await getServices();
        if (res.success) {
          setPackages(res.data);
          if (res.data.length > 0) setActivePackageId(res.data[0].id);
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
    <div className="min-h-screen bg-black text-white">
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Xem Ngày" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-transparent" />
        </div>

        <div className="absolute top-24 right-16 w-64 h-64 border border-gold/10 rounded-full pointer-events-none" />
        <div className="absolute top-28 right-20 w-52 h-52 border border-gold/8 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-24 -translate-y-1/2 text-gold/5 text-[180px] select-none hidden xl:block leading-none">
          ☯
        </div>

        <div className="relative container mx-auto px-6 pb-20 pt-36">
          <nav className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-widest mb-8">
            <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/#services" className="hover:text-gold transition-colors">Dịch Vụ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">Xem Ngày</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-red-500" />
              <span className="text-red-400 uppercase tracking-[0.2em] text-xs font-bold">Chọn Ngày Hoàng Đạo</span>
            </div>
            <h1 className="text-5xl md:text-7xl mb-5 font-extrabold leading-none uppercase tracking-wider">
              Xem <span className="text-gold">Ngày Tốt</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mb-10 leading-relaxed font-light">
              Chọn đúng ngày, đúng giờ — khởi đầu thuận lợi cho mọi sự kiện quan trọng trong cuộc đời.
              Kết hợp Vạn Niên Lịch, Tứ Trụ và Hoàng Đạo Lục Hợp.
            </p>

            <div className="flex flex-wrap gap-10 mb-10">
              {[["5.000+","Ngày Đã Xem"],["8","Loại Sự Kiện"],["98%","Hài Lòng"],["24h","Giao Khẩn"]].map(([v,l],i)=>(
                <div key={i} className="text-center">
                  <div className="text-gold text-2xl font-extrabold">{v}</div>
                  <div className="text-white/30 text-[10px] uppercase tracking-wider mt-1">{l}</div>
                </div>
              ))}
            </div>

            <button onClick={handleBookingClick}
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-10 py-4 transition-all shadow-lg shadow-red-600/20 font-bold text-sm uppercase tracking-widest"
            >
              <Calendar className="w-5 h-5" /> Đặt Lịch Xem Ngày
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-black border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold/50" />
              <span className="text-gold/80 uppercase tracking-[0.2em] text-xs font-bold">Loại Sự Kiện</span>
              <div className="h-px w-12 bg-gold/50" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Chúng Tôi Xem Ngày <span className="text-gold">Cho Gì?</span></h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {EVENT_TYPES.map((ev) => (
              <motion.button
                key={ev.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedEvent(selectedEvent === ev.id ? null : ev.id)}
                className={`text-left p-5 border rounded-2xl transition-all duration-300
                  ${selectedEvent === ev.id
                    ? `${ev.bg} ${ev.border} shadow-lg`
                    : "border-white/5 bg-white/2 hover:border-white/15"
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl ${ev.bg} flex items-center justify-center mb-3`}>
                  <ev.icon className={`w-5 h-5 ${ev.color}`} />
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{ev.label}</h4>
                <AnimatePresence>
                  {selectedEvent === ev.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`text-xs leading-relaxed overflow-hidden ${ev.color} opacity-80 mt-2`}
                    >
                      {ev.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
                {selectedEvent !== ev.id && (
                  <p className="text-white/30 text-xs line-clamp-2 leading-relaxed mt-2">{ev.desc}</p>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-gold/50" />
                <span className="text-gold/80 uppercase tracking-[0.2em] text-xs font-bold">Minh Họa</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5">
                Lịch Cát Hung <span className="text-gold">Cá Nhân Hóa</span>
              </h2>
              <p className="text-white/50 leading-relaxed font-light mb-8">
                Mỗi hồ sơ xem ngày được phân tích riêng theo ngày giờ sinh của bạn, không phải lịch chung chung.
                Màu sắc trên lịch phản ánh mức độ cát hung của từng ngày với mệnh của bạn.
              </p>

              <div className="space-y-3">
                {[
                  { ...ratingStyle.great, label: "Đại Cát – Rất tốt để thực hiện", icon: "★" },
                  { ...ratingStyle.good,  label: "Cát – Tốt, nên thực hiện",       icon: "✦" },
                  { ...ratingStyle.normal,label: "Bình thường – Có thể thực hiện", icon: "·" },
                  { ...ratingStyle.bad,   label: "Hung – Nên tránh ngày này",      icon: "✕" },
                ].map((leg, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg border ${leg.border} ${leg.bg} flex items-center justify-center ${leg.text} text-sm`}>
                      {leg.icon}
                    </div>
                    <span className="text-white/55 text-sm">{leg.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-white/3 border-b border-white/8">
                  <button onClick={() => setCalMonth(m => Math.max(1, m - 1))} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-gold transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="text-center">
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Tháng {calMonth} – 2026</p>
                    <p className="text-gold/50 text-xs">Ví dụ minh họa</p>
                  </div>
                  <button onClick={() => setCalMonth(m => Math.min(12, m + 1))} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-gold transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 border-b border-white/5">
                  {["CN","T2","T3","T4","T5","T6","T7"].map(d => (
                    <div key={d} className="py-2 text-center text-white/30 text-[10px] uppercase tracking-wider">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-px bg-white/5">
                  {MONTH_SAMPLE.map((day) => {
                    const style = ratingStyle[day.rating as keyof typeof ratingStyle];
                    const isSelected = selectedDay === day.day;
                    return (
                      <button
                        key={day.day}
                        onClick={() => setSelectedDay(isSelected ? null : day.day)}
                        className={`relative p-2 text-center transition-all duration-200 ${style.bg}
                          ${isSelected ? "ring-2 ring-gold/60 z-10" : "hover:brightness-125"}
                          ${day.rating === "bad" ? "opacity-50" : ""}`}
                      >
                        <div className={`text-sm font-bold ${style.text}`}>{day.day}</div>
                        <div className="text-[8px] text-white/25 leading-none">{day.lunar}</div>
                        {day.star && (
                          <div className={`text-[10px] ${style.text} leading-none`}>{day.star}</div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedDay !== null && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      {(() => {
                        const day = MONTH_SAMPLE.find(d => d.day === selectedDay)!;
                        const style = ratingStyle[day.rating as keyof typeof ratingStyle];
                        return (
                          <div className={`p-4 border-t border-white/8 ${style.bg}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-bold text-sm">{selectedDay} tháng {calMonth}, 2026</span>
                              <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 border ${style.border} ${style.text}`}>
                                {style.label || "Bình Thường"}
                              </span>
                            </div>
                            <p className="text-white/40 text-xs">
                              {day.rating === "great" && "Ngày Hoàng Đạo – Thiên Đức, Ngọc Đường. Rất tốt để khai trương, nhập trạch, ký kết."}
                              {day.rating === "good"  && "Ngày Cát – Lục Hợp, Thiên Ân. Tốt để thực hiện việc quan trọng."}
                              {day.rating === "normal"&& "Ngày bình thường – Không có yếu tố đặc biệt. Có thể thực hiện."}
                              {day.rating === "bad"   && "Ngày Xích Khẩu, Hoàng Sa – Nên tránh các việc lớn."}
                            </p>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-black border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-red-500/50" />
              <span className="text-red-400/80 uppercase tracking-[0.2em] text-xs font-bold">Bảng Giá</span>
              <div className="h-px w-12 bg-red-500/50" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Gói Dịch Vụ <span className="text-red-400">Xem Ngày</span></h2>
            <p className="text-white/40 mt-3 font-light max-w-lg mx-auto">Từ nhu cầu đơn giản đến kế hoạch năm toàn diện</p>
          </div>

          {loading ? (
             <div className="flex justify-center">
               <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {packages.map((pkg, i) => {
                const isHighlight = i === 1; // Highlight the middle one usually
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    onClick={() => setActivePackageId(pkg.id)}
                    className={`relative flex flex-col border p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1
                      ${isHighlight ? "border-gold bg-gold/5 shadow-2xl shadow-gold/10" 
                        : activePackageId === pkg.id ? "border-white/25 bg-white/5" 
                        : "border-white/8 bg-white/2 hover:border-white/20"}`}
                  >
                    {isHighlight && (
                      <div className="absolute -top-3 left-6 px-4 py-1 text-[10px] uppercase tracking-wider font-bold bg-gold text-black">
                        Phổ Biến
                      </div>
                    )}
                    
                    <h4 className="text-white font-bold text-lg mb-2">{pkg.name}</h4>
                    <div className="mb-1">
                      <span className={`text-2xl font-extrabold ${isHighlight ? "text-gold" : "text-white"}`}>
                        {Number(pkg.price_from).toLocaleString("vi-VN")}đ
                        {pkg.price_to && ` - ${Number(pkg.price_to).toLocaleString("vi-VN")}đ`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/30 text-xs mb-5 uppercase tracking-widest">
                      <Clock className="w-3 h-3" /> {pkg.duration || 'Liên hệ'}
                    </div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {(pkg.features || []).map((f: string, fi: number) => (
                        <li key={fi} className="flex items-start gap-2 text-white/55 text-sm">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isHighlight ? "text-gold" : "text-white/25"}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-white/8 pt-4 space-y-1 mb-6">
                      {(pkg.deliverables || []).map((d: string, di: number) => (
                        <p key={di} className="text-white/40 text-xs flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gold/50 shrink-0" />{d}
                        </p>
                      ))}
                    </div>

                    <button onClick={(e) => { e.stopPropagation(); handleBookingClick(); }}
                      className={`w-full py-3 text-xs uppercase tracking-widest font-bold transition-all
                        ${isHighlight ? "bg-gold text-black hover:bg-gold/90 shadow-lg shadow-gold/20" : "border border-white/20 text-white/70 hover:border-gold/40 hover:text-white"}`}
                    >
                      Đặt Gói Này
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-black border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">Quy Trình <span className="text-gold">4 Bước</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative border ${step.border} p-6 text-center bg-white/2`}
              >
                <div className={`text-xs font-bold uppercase tracking-widest ${step.color} mb-3`}>{step.step}</div>
                <div className={`w-12 h-12 border ${step.border} flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h4 className="text-white font-bold mb-2">{step.title}</h4>
                <p className="text-white/35 text-xs leading-relaxed">{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/25 hidden md:block z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black border-b border-white/5">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Câu Hỏi <span className="text-gold">Thường Gặp</span></h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i}
                className={`border rounded-xl overflow-hidden transition-all duration-300
                  ${openFaq === i ? "border-red-500/30 bg-red-900/5" : "border-white/8 bg-white/2 hover:border-white/20"}`}
              >
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-white font-semibold text-sm leading-snug">{faq.q}</span>
                  <div className={`shrink-0 transition-colors ${openFaq === i ? "text-red-400" : "text-white/30"}`}>
                    {openFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className="h-px bg-red-500/10 mb-4" />
                        <p className="text-white/50 leading-relaxed text-sm font-light">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
