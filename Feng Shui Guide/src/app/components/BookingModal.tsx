import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, Calendar, Clock, User, Phone, Mail, ChevronDown, CheckCircle2, Sparkles } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  "Tư Vấn Phong Thủy Nhà Ở",
  "Tư Vấn Phong Thủy Văn Phòng / Doanh Nghiệp",
  "Xem Ngày Tốt (Khai Trương, Cưới Hỏi...)",
  "Tứ Trụ – Luận Mệnh Cá Nhân",
  "Huyền Không Phi Tinh",
  "Tư Vấn Vật Phẩm Phong Thủy",
];

const timeSlots = [
  "08:00 – 09:00",
  "09:00 – 10:00",
  "10:00 – 11:00",
  "14:00 – 15:00",
  "15:00 – 16:00",
  "16:00 – 17:00",
];

const consultTypes = [
  { id: "inperson", label: "Trực Tiếp", icon: "🏠" },
  { id: "online", label: "Online (Zalo/Zoom)", icon: "💻" },
  { id: "phone", label: "Qua Điện Thoại", icon: "📞" },
];

type Step = 1 | 2 | 3;

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    consultType: "inperson",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "", service: "", date: "", time: "", consultType: "inperson", note: "" });
    }, 400);
  };

  const step1Valid = form.service && form.consultType;
  const step2Valid = form.date && form.time;
  const step3Valid = form.name && form.phone;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg bg-[#0d0d0d] border border-gold/20 shadow-2xl shadow-black overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold top line */}
            <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-gold text-xs uppercase tracking-[0.2em]" style={{ fontWeight: 700 }}>
                    Đặt Lịch Tư Vấn
                  </span>
                </div>
                <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>
                  Gặp Thầy <span className="text-gold">Song Vũ</span>
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-gold hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            {!submitted && (
              <div className="px-8 pt-5 pb-1">
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all shrink-0 ${
                          step > s
                            ? "bg-gold text-black"
                            : step === s
                            ? "bg-primary text-white border border-primary"
                            : "bg-white/5 text-white/30 border border-white/10"
                        }`}
                        style={{ fontWeight: 700 }}
                      >
                        {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-wider hidden sm:block ${
                          step >= s ? "text-white/60" : "text-white/20"
                        }`}
                      >
                        {s === 1 ? "Dịch vụ" : s === 2 ? "Thời gian" : "Thông tin"}
                      </span>
                      {s < 3 && (
                        <div className={`flex-1 h-px ${step > s ? "bg-gold/50" : "bg-white/10"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
              {submitted ? (
                /* Success */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-gold" />
                  </div>
                  <h3 className="text-2xl text-white mb-3" style={{ fontWeight: 700 }}>
                    Đặt Lịch Thành Công!
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-2">
                    Cảm ơn <span className="text-gold">{form.name}</span>! Phong Thủy Song Vũ đã nhận được yêu cầu của bạn.
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Chúng tôi sẽ liên hệ xác nhận trong vòng <span className="text-white/70">2 giờ</span> qua số{" "}
                    <span className="text-white/70">{form.phone}</span>.
                  </p>
                  <div className="bg-gold/5 border border-gold/20 p-4 text-left space-y-2 text-sm mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Dịch vụ:</span>
                      <span className="text-white/80 text-right max-w-[60%]">{form.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày:</span>
                      <span className="text-white/80">{form.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Giờ:</span>
                      <span className="text-white/80">{form.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hình thức:</span>
                      <span className="text-white/80">{consultTypes.find(c => c.id === form.consultType)?.label}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full py-3.5 bg-gold hover:bg-gold/90 text-black rounded-full transition-all"
                    style={{ fontWeight: 700 }}
                  >
                    Đóng
                  </button>
                </motion.div>
              ) : step === 1 ? (
                /* Step 1: Dịch vụ */
                <div className="space-y-5">
                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-3">
                      Chọn dịch vụ tư vấn <span className="text-primary">*</span>
                    </label>
                    <div className="space-y-2">
                      {services.map((svc) => (
                        <button
                          key={svc}
                          onClick={() => update("service", svc)}
                          className={`w-full text-left px-4 py-3 border text-sm transition-all flex items-center gap-3 ${
                            form.service === svc
                              ? "border-gold/60 bg-gold/8 text-gold"
                              : "border-white/8 bg-white/2 text-white/60 hover:border-white/20 hover:text-white/80"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                              form.service === svc ? "border-gold" : "border-white/20"
                            }`}
                          >
                            {form.service === svc && <div className="w-2 h-2 rounded-full bg-gold" />}
                          </div>
                          {svc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-3">
                      Hình thức tư vấn <span className="text-primary">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {consultTypes.map((ct) => (
                        <button
                          key={ct.id}
                          onClick={() => update("consultType", ct.id)}
                          className={`p-3 border text-center text-xs transition-all ${
                            form.consultType === ct.id
                              ? "border-gold/60 bg-gold/8 text-gold"
                              : "border-white/8 bg-white/2 text-white/50 hover:border-white/20"
                          }`}
                        >
                          <div className="text-lg mb-1">{ct.icon}</div>
                          {ct.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : step === 2 ? (
                /* Step 2: Thời gian */
                <div className="space-y-5">
                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Chọn ngày <span className="text-primary">*</span></span>
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => update("date", e.target.value)}
                      className="w-full bg-white/3 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-3">
                      <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Chọn giờ <span className="text-primary">*</span></span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => update("time", slot)}
                          className={`py-2.5 text-xs border transition-all ${
                            form.time === slot
                              ? "border-gold/60 bg-gold/8 text-gold"
                              : "border-white/8 bg-white/2 text-white/50 hover:border-white/20 hover:text-white/70"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/15 p-4 text-xs text-gray-400 leading-relaxed">
                    <span className="text-primary" style={{ fontWeight: 600 }}>Lưu ý:</span> Thầy Song Vũ nhận tối đa 3 buổi tư vấn mỗi ngày. Vui lòng đặt sớm để có khung giờ phù hợp.
                  </div>
                </div>
              ) : (
                /* Step 3: Thông tin cá nhân */
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> Họ và tên <span className="text-primary">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="w-full bg-white/3 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Số điện thoại <span className="text-primary">*</span></span>
                    </label>
                    <input
                      type="tel"
                      placeholder="0912 345 678"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="w-full bg-white/3 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email (không bắt buộc)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full bg-white/3 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                      Ghi chú thêm
                    </label>
                    <textarea
                      placeholder="Mô tả ngắn về vấn đề bạn muốn tư vấn..."
                      value={form.note}
                      onChange={(e) => update("note", e.target.value)}
                      rows={3}
                      className="w-full bg-white/3 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm focus:outline-none focus:border-gold/40 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!submitted && (
              <div className="px-8 pb-7 pt-2 flex gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep((s) => (s - 1) as Step)}
                    className="flex-1 py-3.5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    ← Quay lại
                  </button>
                )}
                <button
                  onClick={() => {
                    if (step < 3) setStep((s) => (s + 1) as Step);
                    else handleSubmit();
                  }}
                  disabled={
                    (step === 1 && !step1Valid) ||
                    (step === 2 && !step2Valid) ||
                    (step === 3 && !step3Valid)
                  }
                  className="flex-1 py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all text-sm rounded-sm"
                  style={{ fontWeight: 700 }}
                >
                  {step < 3 ? "Tiếp tục →" : "✦ Xác Nhận Đặt Lịch"}
                </button>
              </div>
            )}

            {/* Bottom gold line */}
            <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
