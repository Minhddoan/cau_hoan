import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "Hướng nhà tốt cho tuổi Nhâm Tý là gì?",
  "Đặt bàn thờ ở đâu là đúng phong thủy?",
  "Màu sắc phòng ngủ hợp với mệnh Hỏa?",
  "Cây cảnh nào phù hợp cho phòng khách?",
];

const faqAnswers: Record<string, string> = {
  "hướng nhà tốt": "Hướng nhà tốt phụ thuộc vào tuổi và mệnh của gia chủ. Theo Bát Trạch, mỗi người có 4 hướng tốt (Sinh Khí, Thiên Y, Diên Niên, Phục Vị) và 4 hướng xấu. Với tuổi Nhâm Tý (mệnh Thủy), các hướng Bắc, Đông Nam, Đông, Nam thường là tốt. Tuy nhiên, cần kết hợp với hướng tọa của đất và năm Phi Tinh để có kết quả chính xác nhất.",
  "bàn thờ": "Bàn thờ nên đặt ở vị trí trang trọng, cao ráo, thoáng đãng. Không đặt đối diện cửa chính, không đặt ở phòng ngủ hoặc nhà vệ sinh. Vị trí tốt nhất là ở cung Phúc Đức (thường là góc đối diện với cửa vào của phòng khách). Bàn thờ nên quay về hướng tốt theo mệnh gia chủ.",
  "màu sắc": "Với mệnh Hỏa (Bính, Đinh, Mậu, Kỷ sinh năm cuối 6, 7, 8, 9): Màu đỏ, cam, tím là màu vượng khí. Màu vàng, nâu đất là màu trợ lực. Tránh dùng màu đen, xanh đậm vì Thủy khắc Hỏa. Phòng ngủ có thể dùng tông đỏ wine hoặc cam đất ấm áp.",
  "cây cảnh": "Cây phù hợp cho phòng khách theo phong thủy: Cây Kim Tiền (tài lộc), Trúc may mắn (bình an), Kim Ngân (vượng tài), Vạn Niên Thanh (trường thọ). Tránh cây có gai, cây leo không có điểm tựa. Nên đặt cây ở hướng Đông hoặc Đông Nam để kích hoạt khí Mộc tăng vượng.",
};

function findAnswer(question: string): string {
  const q = question.toLowerCase();
  for (const [key, answer] of Object.entries(faqAnswers)) {
    if (q.includes(key)) return answer;
  }
  return "Cảm ơn bạn đã đặt câu hỏi! Để tư vấn chính xác nhất, tôi cần biết thêm thông tin về ngày tháng năm sinh của bạn và diện tích, hướng nhà hiện tại. Bạn có thể chia sẻ thêm để tôi hỗ trợ tốt hơn không? Hoặc bạn có thể đặt lịch tư vấn trực tiếp với Thầy Song Vũ để được giải đáp toàn diện hơn.";
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "Xin chào! Tôi là Trợ Lý Phong Thủy AI của Song Vũ. Tôi có thể giúp bạn giải đáp các câu hỏi về phong thủy nhà ở, xem hướng, chọn màu sắc và vật phẩm phù hợp. Hãy đặt câu hỏi bắt đầu nhé! 🏠✨",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = findAnswer(content);
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 0,
        role: "assistant",
        content:
          "Xin chào! Tôi là Trợ Lý Phong Thủy AI của Song Vũ. Hãy đặt câu hỏi về phong thủy để tôi hỗ trợ bạn! 🏠✨",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <section id="assistant" className="py-32 px-6 md:px-12 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
            <span className="tracking-[0.3em] uppercase text-primary text-sm" style={{ fontWeight: 700 }}>
              Trợ Lý AI
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 text-white" style={{ fontWeight: 700 }}>
            Trợ Lý <span className="text-primary">Phong Thủy AI</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Đặt câu hỏi về phong thủy và nhận ngay lời khuyên từ AI được huấn luyện bởi Thầy Song Vũ
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Info + Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* AI info card */}
            <div className="border border-primary/20 p-6 bg-primary/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-white text-sm" style={{ fontWeight: 700 }}>AI Song Vũ</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-gray-400 text-xs">Trực tuyến 24/7</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                Trợ lý AI được huấn luyện từ kho kiến thức phong thủy của Thầy Song Vũ với hơn 15 năm kinh nghiệm.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Bát Trạch", "Huyền Không", "Tứ Trụ"].map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-1 border border-primary/30 text-primary/80 uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-sm text-gray-400" style={{ fontWeight: 600 }}>Câu hỏi gợi ý</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="w-full text-left p-3 border border-white/8 text-gray-400 hover:border-gold/30 hover:text-gold transition-all duration-200 text-sm leading-snug"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="border border-white/8 bg-black/60 backdrop-blur-sm flex flex-col h-[500px]">
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white text-sm" style={{ fontWeight: 600 }}>Phong Thủy AI – Song Vũ</span>
                </div>
                <button
                  onClick={resetChat}
                  className="text-gray-600 hover:text-gold transition-colors p-1"
                  title="Bắt đầu lại"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === "assistant"
                            ? "bg-primary/20 text-primary"
                            : "bg-gold/20 text-gold"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[80%] p-3.5 text-sm leading-relaxed ${
                          msg.role === "assistant"
                            ? "bg-white/5 border border-white/8 text-gray-300"
                            : "bg-primary/20 border border-primary/30 text-white"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="p-3.5 bg-white/5 border border-white/8 flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/8 p-4 flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Nhập câu hỏi về phong thủy..."
                  className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-sm transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="bg-primary text-white px-4 py-3 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <p className="text-center text-gray-600 text-xs mt-3">
              AI chỉ mang tính tham khảo. Tư vấn chuyên sâu, vui lòng đặt lịch trực tiếp với Thầy Song Vũ.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
