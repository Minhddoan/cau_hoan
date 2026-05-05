import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Star,
  Award,
  BookOpen,
  TrendingUp,
  Heart,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Phone,
  Mail,
  X,
  Upload,
  User,
  Loader2,
} from "lucide-react";
import { getJobs, postJobApplication } from "../../lib/api";

// ─── Images ───────────────────────────────────────────────────────────────────
const heroImg   = "https://images.unsplash.com/photo-1680946496238-5272d3c407fc?w=1600";
const teamImg   = "https://images.unsplash.com/photo-1758270703928-6a8597669abc?w=800";
const growthImg = "https://images.unsplash.com/photo-1659080922116-4c32579d410a?w=800";
const dealImg   = "https://images.unsplash.com/photo-1758599543152-a73184816eba?w=800";

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Job {
  id: string;
  title: string;
  dept: string;
  type: "fulltime" | "parttime" | "intern";
  location: string;
  salary: string;
  urgent?: boolean;
  hot?: boolean;
  tags: string[];
  desc: string;
  requirements: string[];
  benefits: string[];
  deadline: string;
}

// Mảng JOBS giờ sẽ được fetch từ API
const DEPT_COLORS: Record<string, string> = {
  "Tư Vấn": "bg-gold/15 text-gold border-gold/30",
  "Marketing": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Kinh Doanh": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Dịch Vụ KH": "bg-green-500/15 text-green-400 border-green-500/30",
};

const TYPE_LABEL: Record<string, string> = {
  fulltime: "Toàn thời gian",
  parttime: "Bán thời gian",
  intern: "Thực tập sinh",
};

type FilterDept = "all" | "Tư Vấn" | "Marketing" | "Kinh Doanh" | "Dịch Vụ KH";
type FilterType = "all" | "fulltime" | "parttime" | "intern";

// ─── Apply Modal ──────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postJobApplication({
        job_id: job.id,
        applicant_name: form.name,
        applicant_phone: form.phone,
        applicant_email: form.email,
        cover_letter: form.note
      });
      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Apply fail:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#0d0d0d] border border-gold/20 p-8 rounded-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <p className="text-gold text-xs uppercase tracking-[0.2em] font-bold mb-1">Ứng Tuyển</p>
              <h3 className="text-white text-xl font-bold leading-tight">{job.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] px-2 py-0.5 border rounded-full font-bold ${DEPT_COLORS[job.dept] ?? "bg-white/10 text-white/60 border-white/20"}`}>
                  {job.dept}
                </span>
                <span className="text-white/30 text-xs">{job.location}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { field: "name",  label: "Họ & Tên",           icon: User,  type: "text",  placeholder: "Nguyễn Văn A",        required: true  },
                { field: "phone", label: "Số Điện Thoại",       icon: Phone, type: "tel",   placeholder: "0912 345 678",        required: true  },
                { field: "email", label: "Email",               icon: Mail,  type: "email", placeholder: "example@email.com",   required: true  },
              ].map(({ field, label, icon: Icon, type, placeholder, required }) => (
                <div key={field}>
                  <label className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input
                      type={type} placeholder={placeholder} required={required}
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      className="w-full bg-white/3 border border-white/10 text-white text-sm pl-10 pr-4 py-3 rounded-xl focus:border-gold/40 focus:outline-none placeholder:text-white/20 transition-colors"
                    />
                  </div>
                </div>
              ))}

              <div>
                <label className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1.5 block">Giới Thiệu Bản Thân</label>
                <textarea
                  rows={3} placeholder="Chia sẻ ngắn về kinh nghiệm và lý do bạn muốn ứng tuyển..."
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  className="w-full bg-white/3 border border-white/10 text-white text-sm px-4 py-3 rounded-xl focus:border-gold/40 focus:outline-none placeholder:text-white/20 transition-colors resize-none"
                />
              </div>

              {/* CV upload hint */}
              <div className="border border-dashed border-white/10 rounded-xl p-4 text-center hover:border-gold/30 transition-colors cursor-pointer group">
                <Upload className="w-5 h-5 text-white/25 group-hover:text-gold/60 mx-auto mb-2 transition-colors" />
                <p className="text-white/30 text-xs">Đính kèm CV (PDF, DOC) — hoặc gửi qua email bên dưới</p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gold text-black py-3.5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Gửi Đơn Ứng Tuyển
              </button>
              <p className="text-white/20 text-[10px] text-center">Hoặc gửi CV trực tiếp qua email: <span className="text-gold/60">tuyendung@phongthuysongvu.com</span></p>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Đã Nhận Đơn!</h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto mb-6">
              Cảm ơn bạn đã ứng tuyển. Chúng tôi sẽ liên hệ lại trong vòng <span className="text-gold">3–5 ngày làm việc</span>.
            </p>
            <button onClick={onClose}
              className="px-8 py-3 border border-white/20 text-white/70 text-xs uppercase tracking-widest font-bold hover:border-gold/30 hover:text-white transition-all rounded-xl"
            >
              Đóng
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`border transition-all duration-300 ${expanded ? "border-gold/30 bg-gold/3" : "border-white/8 bg-white/2 hover:border-white/20"}`}
    >
      {/* Header */}
      <div className="p-6 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] px-2.5 py-1 border rounded-full font-bold ${DEPT_COLORS[job.dept] ?? "bg-white/10 text-white/60 border-white/20"}`}>
                {job.dept}
              </span>
              <span className="text-[10px] px-2.5 py-1 border border-white/10 text-white/40 rounded-full">
                {TYPE_LABEL[job.type]}
              </span>
              {job.hot && (
                <span className="text-[10px] px-2.5 py-1 bg-red-600/20 border border-red-600/40 text-red-400 rounded-full font-bold animate-pulse">
                  🔥 Hot
                </span>
              )}
              {job.urgent && (
                <span className="text-[10px] px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full font-bold">
                  ⚡ Tuyển Gấp
                </span>
              )}
            </div>
            <h3 className="text-white font-bold text-lg leading-snug mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{job.salary}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Hạn: {job.deadline}</span>
            </div>
          </div>
          <div className="shrink-0 mt-1">
            {expanded
              ? <ChevronUp className="w-5 h-5 text-gold/60" />
              : <ChevronDown className="w-5 h-5 text-white/30" />
            }
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/4 text-white/35 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {/* Expanded */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/5">
              <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-5">
                  <div>
                    <p className="text-gold/70 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Mô Tả Công Việc</p>
                    <p className="text-white/50 text-sm leading-relaxed">{job.desc}</p>
                  </div>
                  <div>
                    <p className="text-gold/70 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Yêu Cầu</p>
                    <ul className="space-y-1.5">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/50 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-gold/50 shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Right */}
                <div className="space-y-5">
                  <div>
                    <p className="text-gold/70 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Quyền Lợi</p>
                    <ul className="space-y-1.5">
                      {job.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-white/50 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0 mt-1.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onApply(job); }}
                    className="w-full bg-gold text-black py-3 font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Ứng Tuyển Ngay
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const PERKS = [
  { icon: Award,     title: "Học Từ Chuyên Gia",      desc: "Được đào tạo trực tiếp bởi Thầy Song Vũ – 30 năm kinh nghiệm phong thủy" },
  { icon: TrendingUp,title: "Lộ Trình Rõ Ràng",        desc: "Hệ thống thăng tiến minh bạch, review lương 2 lần/năm theo hiệu suất thực tế" },
  { icon: Shield,    title: "Ổn Định & Bền Vững",      desc: "Công ty hoạt động 15+ năm, khách hàng trung thành, doanh thu tăng trưởng đều" },
  { icon: Heart,     title: "Môi Trường Tích Cực",     desc: "Đội ngũ nhỏ, gắn kết, cởi mở — không đấu đá nội bộ, làm việc vì mục tiêu chung" },
  { icon: Sparkles,  title: "Ý Nghĩa Công Việc",       desc: "Mỗi ngày bạn giúp hàng trăm người cải thiện cuộc sống qua phong thủy thực tế" },
  { icon: BookOpen,  title: "Học Phong Thủy Miễn Phí", desc: "Toàn bộ nhân viên được học kiến thức phong thủy chính thức từ Thầy Song Vũ" },
];

export function RecruitmentPage() {
  const [jobsList, setJobsList] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState<FilterDept>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [applyJob, setApplyJob]     = useState<Job | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await getJobs();
        if (res.success) {
          setJobsList(res.data.map((j: any) => ({
            ...j,
            dept: j.department,
            type: j.job_type,
            salary: j.salary_range,
            hot: j.is_hot,
            urgent: j.is_urgent,
            deadline: j.deadline ? new Date(j.deadline).toLocaleDateString('vi-VN') : 'Liên tục'
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const filtered = jobsList.filter(j =>
    (filterDept === "all" || j.dept === filterDept) &&
    (filterType === "all" || j.type === filterType)
  );

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── HERO ── */}
      <section className="relative min-h-[72vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Tuyển Dụng" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        </div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dot" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#D4AF37" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot)" />
          </svg>
        </div>

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute top-40 right-8 lg:right-20 border border-gold/25 bg-black/60 backdrop-blur-md px-5 py-3 hidden md:block"
        >
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-0.5">Đang Tuyển</p>
          <p className="text-white text-2xl font-extrabold">{jobsList.length} Vị Trí</p>
          <p className="text-white/40 text-[10px]">Cập nhật {new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}</p>
        </motion.div>

        <div className="relative container mx-auto px-6 pb-20 pt-36">
          <nav className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-widest mb-8">
            <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/gioi-thieu" className="hover:text-gold transition-colors">Giới Thiệu</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">Tuyển Dụng</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold">Gia Nhập Đội Ngũ</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none uppercase tracking-wider mb-5">
              Cùng Kiến Tạo<br />
              <span className="text-gold">Tương Lai Vượng</span>
            </h1>
            <p className="text-white/55 text-lg max-w-xl mb-10 leading-relaxed font-light">
              Phong Thủy Song Vũ tìm kiếm những người tài năng, nhiệt huyết và yêu thích phong thủy
              để cùng xây dựng đội ngũ tư vấn hàng đầu Việt Nam.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-3 bg-gold text-black px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold/90 transition-all shadow-lg shadow-gold/20"
              >
                <Briefcase className="w-4 h-4" /> Xem Vị Trí Tuyển
              </button>
              <a href="mailto:tuyendung@phongthuysongvu.com"
                className="inline-flex items-center gap-3 border border-white/20 text-white/70 px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] hover:border-gold/30 hover:text-white transition-all"
              >
                <Mail className="w-4 h-4" /> Gửi CV Trực Tiếp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY JOIN ── */}
      <section className="py-20 bg-black border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold/50" />
              <span className="text-gold/80 uppercase tracking-[0.2em] text-xs font-bold">Vì Sao Gia Nhập</span>
              <div className="h-px w-12 bg-gold/50" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              Làm Việc Tại <span className="text-gold">Song Vũ</span>
            </h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto font-light">Không chỉ là công việc — là hành trình phát triển bản thân trong một lĩnh vực đầy ý nghĩa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((perk, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="border border-gold/10 bg-gold/3 p-6 hover:border-gold/25 hover:bg-gold/5 transition-all group"
              >
                <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <perk.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-white font-bold mb-2">{perk.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CULTURE IMAGES ── */}
      <section className="py-20 bg-black border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { img: teamImg,   label: "Đào tạo chuyên sâu từ Thầy Song Vũ",     tag: "Học Tập" },
              { img: growthImg, label: "Môi trường phát triển không giới hạn",    tag: "Phát Triển" },
              { img: dealImg,   label: "Hợp tác & đối tác bền vững lâu dài",     tag: "Đối Tác" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden group"
              >
                <img src={item.img} alt={item.label}
                  className="w-full aspect-[4/3] object-cover brightness-50 group-hover:brightness-65 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] text-gold/80 uppercase tracking-widest font-bold border border-gold/30 px-2 py-0.5 mb-2 inline-block">{item.tag}</span>
                  <p className="text-white font-bold text-sm leading-snug">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB LISTINGS ── */}
      <section className="py-24 bg-black" id="jobs">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-red-500/50" />
              <span className="text-red-400/80 uppercase tracking-[0.2em] text-xs font-bold">Vị Trí Đang Mở</span>
              <div className="h-px w-12 bg-red-500/50" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Cơ Hội <span className="text-red-400">Dành Cho Bạn</span></h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {/* Dept filter */}
            {(["all", "Tư Vấn", "Marketing", "Kinh Doanh", "Dịch Vụ KH"] as FilterDept[]).map(d => (
              <button key={d} onClick={() => setFilterDept(d)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border transition-all
                  ${filterDept === d
                    ? "bg-gold text-black border-gold"
                    : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
              >
                {d === "all" ? "Tất Cả Phòng" : d}
              </button>
            ))}
            <div className="w-px bg-white/10 mx-1" />
            {(["all", "fulltime", "intern"] as FilterType[]).map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border transition-all
                  ${filterType === t
                    ? "bg-white/10 text-white border-white/30"
                    : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
              >
                {t === "all" ? "Mọi Loại" : TYPE_LABEL[t]}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-white/30 text-xs text-center mb-8 uppercase tracking-widest">
            Hiển thị <span className="text-gold font-bold">{filtered.length}</span> / {jobsList.length} vị trí
          </p>

          {/* Job cards */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
              </div>
            ) : (
              <AnimatePresence mode="sync">
                {filtered.length > 0 ? filtered.map(job => (
                  <JobCard key={job.id} job={job} onApply={setApplyJob} />
                )) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="border border-white/8 p-12 text-center"
                  >
                    <Users className="w-10 h-10 text-white/15 mx-auto mb-3" />
                    <p className="text-white/40">Không có vị trí phù hợp với bộ lọc này.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold">Quy Trình <span className="text-gold">Tuyển Dụng</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { num: "01", icon: Send,          title: "Gửi Hồ Sơ",          sub: "Online / Email",          desc: "Điền form ứng tuyển trực tiếp trên website hoặc gửi CV qua email tuyendung@phongthuysongvu.com" },
              { num: "02", icon: Phone,          title: "Phỏng Vấn Sơ Bộ",    sub: "15–20 phút · Online",     desc: "Cuộc gọi ngắn với HR để trao đổi về kinh nghiệm, kỳ vọng và định hướng của bạn" },
              { num: "03", icon: Users,          title: "Phỏng Vấn Chuyên Sâu",sub: "45–60 phút · Trực tiếp", desc: "Gặp trực tiếp với Thầy Song Vũ và trưởng bộ phận để đánh giá năng lực chuyên môn" },
              { num: "04", icon: CheckCircle2,   title: "Nhận Offer & Onboard", sub: "3–5 ngày làm việc",       desc: "Nhận thư mời làm việc và bắt đầu chương trình onboarding 30 ngày đầu tiên" },
            ].map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="border border-gold/15 bg-gold/3 p-6 text-center relative"
              >
                <div className="text-gold/50 text-xs font-bold uppercase tracking-widest mb-3">{step.num}</div>
                <div className="w-12 h-12 border border-gold/25 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-white font-bold mb-1 text-sm">{step.title}</h4>
                <p className="text-gold/50 text-[10px] mb-3">{step.sub}</p>
                <p className="text-white/35 text-xs leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <ArrowRight className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/20 hidden md:block z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden border border-gold/20 p-12 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/4 top-0 w-64 h-40 bg-gold/8 rounded-full blur-[80px]" />
              <div className="absolute right-1/4 bottom-0 w-64 h-40 bg-red-700/8 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <Zap className="w-8 h-8 text-gold/50 mx-auto mb-4" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-widest">
                Chưa Thấy Vị Trí <span className="text-gold">Phù Hợp?</span>
              </h3>
              <p className="text-white/40 mb-8 max-w-lg mx-auto font-light">
                Gửi hồ sơ tự do cho chúng tôi. Nếu bạn có tài năng và đam mê phong thủy, Song Vũ luôn chào đón bạn.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:tuyendung@phongthuysongvu.com"
                  className="inline-flex items-center gap-3 bg-gold text-black px-10 py-4 font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold/90 transition-all shadow-lg shadow-gold/20"
                >
                  <Mail className="w-4 h-4" /> Gửi Hồ Sơ Tự Do
                </a>
                <Link to="/gioi-thieu">
                  <button className="px-10 py-4 border border-white/20 text-white/70 text-xs uppercase tracking-[0.2em] font-bold hover:border-gold/30 hover:text-white transition-all">
                    Tìm Hiểu Về Chúng Tôi
                  </button>
                </Link>
              </div>
              <p className="text-white/20 text-xs mt-6">
                Email: tuyendung@phongthuysongvu.com · Hotline: 0912 345 678
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyJob && (
          <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
