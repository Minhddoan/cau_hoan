// src/controllers/chatController.js
// Endpoint giả lập cho Trợ lý AI Phong Thủy

const faqAnswers = {
  "hướng nhà tốt": "Hướng nhà tốt phụ thuộc vào tuổi và mệnh của gia chủ. Theo Bát Trạch, mỗi người có 4 hướng tốt (Sinh Khí, Thiên Y, Diên Niên, Phục Vị) và 4 hướng xấu. Bạn tuổi gì để tôi tư vấn chi tiết hơn?",
  "bàn thờ": "Bàn thờ nên đặt ở vị trí trang trọng, cao ráo, thoáng đãng. Không đặt đối diện cửa chính, không đặt ở phòng ngủ hoặc nhà vệ sinh. Vị trí tốt nhất là ở cung Phúc Đức.",
  "màu sắc": "Màu sắc tương sinh với bản mệnh sẽ mang lại may mắn. Ví dụ mệnh Hỏa hợp màu xanh lá (Mộc), đỏ, hồng. Tránh màu đen, xanh dương (Thủy).",
  "cây cảnh": "Cây Kim Tiền (tài lộc), Trúc may mắn (bình an), Kim Ngân (vượng tài) rất hợp để phòng khách. Tránh cây có gai nhọn mang sát khí."
};

function findAnswer(question) {
  const q = question.toLowerCase();
  for (const [key, answer] of Object.entries(faqAnswers)) {
    if (q.includes(key)) return answer;
  }
  return "Cảm ơn bạn đã trò chuyện! Trợ lý AI đang được nâng cấp để kết nối với trung tâm tri thức phong thủy của Thầy Song Vũ. Vui lòng để lại thông tin hẹn lịch tư vấn trực tiếp!";
}

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Thiếu nội dung câu hỏi" });
    }

    // Ở môi trường Production thực tế, có thể dùng axios gọi sang OpenAI/Gemini:
    // const response = await axios.post("https://api.openai.com/v1/chat/completions", ...)
    
    // Hiện tại dùng logic rule-based:
    const answer = findAnswer(message);

    // Giả lập độ trễ AI suy nghĩ
    setTimeout(() => {
      res.json({ success: true, answer: answer });
    }, 1000);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { chatWithAI };
