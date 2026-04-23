import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  CheckCircle2,
  Calendar,
  Star,
  Building2,
  Coffee,
  ShoppingBag,
  Landmark,
  FileText,
  Clock,
  Shield,
  Phone,
  Search,
  PenLine,
  HeadphonesIcon,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Users,
  TrendingUp,
  Zap,
  ChevronDown,
} from "lucide-react";
import { BookingModal } from "../components/BookingModal.tsx";

// ─── Images ───────────────────────────────────────────────────────────────────
const heroImg   = "https://images.unsplash.com/photo-1767288533191-cc2c72bad9c9?w=1600";
const officeImg = "https://images.unsplash.com/photo-1756679207077-b20c69378f8c?w=800";
const spaImg    = "https://images.unsplash.com/photo-1538024333176-f25f63f873ee?w=800";
const buildImg  = "https://images.unsplash.com/photo-1704308875463-79b12d868d86?w=800";

// ─── Data ─────────────────────────────────────────────────────────────────────
type TabId = "vanphong" | "thucpham" | "thuongmai" | "dautu";

const tabs = [
  {
    id: "vanphong" as TabId,
    label: "Văn Phòng",
    icon: Building2,
    tagline: "Bố Cục · Nhân Sự · Lãnh Đạo · Tài Vận",
    desc: "Tối ưu hóa không gian văn phòng theo phong thủy giúp tăng hiệu suất làm việc, cải thiện mối quan hệ nội bộ, thu hút nhân tài và kích hoạt vượng khí tài lộc cho toàn bộ doanh nghiệp.",
    image: heroImg,
    packages: [
      {
        name: "Hồ Sơ Văn Phòng Cơ Bản",
        price: "5.000.000",
        duration: "5–7 ngày làm việc",
        features: [
          "Phân tích tọa hướng văn phòng",
          "Bố trí bàn lãnh đạo theo mệnh",
          "Sơ đồ bố trí nhân sự tối ưu",
          "Khu vực tiếp khách & tài lộc",
          "Màu sắc & logo theo phong thủy",
          "Hướng cổng ra vào hợp khí",
        ],
        deliverables: ["Báo cáo PDF 40 trang", "Sơ đồ bố trí văn phòng màu"],
        highlight: false,
      },
      {
        name: "Hồ Sơ Doanh Nghiệp Toàn Diện",
        price: "10.000.000",
        duration: "7–14 ngày làm việc",
        highlight: true,
        badge: "Khuyên Dùng",
        features: [
          "Tất cả từ gói Cơ Bản",
          "Phân tích mệnh số ban lãnh đạo",
          "Chiến lược kinh doanh theo phong thủy",
          "Chọn ngày khai trương / ra mắt sản phẩm",
          "Tư vấn thương hiệu theo Ngũ Hành",
          "Hỗ trợ phong thủy nhân sự chủ chốt",
        ],
        deliverables: [
          "Báo cáo tổng hợp 100 trang",
          "Tư vấn trực tiếp không giới hạn 3 tháng",
          "Khảo sát thực địa 2 lần",
        ],
      },
      {
        name: "Hồ Sơ Chuỗi / Nhượng Quyền",
        price: "Liên hệ",
        priceNote: "Báo giá theo quy mô",
        duration: "Theo thỏa thuận",
        badge: "Enterprise",
        features: [
          "Phong thủy cho nhiều địa điểm cùng lúc",
          "Hồ sơ phong thủy tập đoàn / chuỗi",
          "Tư vấn mở rộng, nhượng quyền",
          "Phong thủy cho sự kiện doanh nghiệp",
          "Đào tạo nội bộ phong thủy cơ bản",
          "Cố vấn phong thủy dài hạn",
        ],
        deliverables: [
          "Bộ hồ sơ theo từng địa điểm",
          "Cố vấn liên tục hàng quý",
          "Báo cáo định kỳ",
        ],
        highlight: false,
      },
    ],
  },
  {
    id: "thucpham" as TabId,
    label: "F&B / Nhà Hàng",
    icon: Coffee,
    tagline: "Nhà Hàng · Quán Café · Khách Sạn · Resort",
    desc: "Phong thủy F&B giúp tối ưu dòng khách, bố trí khu vực ăn uống và bếp theo hướng cát, kích hoạt vượng khí thực phẩm và thu hút nguồn khách dồi dào, tăng doanh thu bền vững.",
    image: officeImg,
    packages: [
      {
        name: "Hồ Sơ Quán Café / Nhỏ",
        price: "4.000.000",
        duration: "3–5 ngày làm việc",
        features: [
          "Phân tích hướng cửa vào",
          "Bố trí quầy thu ngân hợp phong thủy",
          "Vị trí bếp & kho theo hướng cát",
          "Màu sắc thương hiệu theo mệnh chủ",
          "Vật phẩm kích hoạt tài lộc",
        ],
        deliverables: ["Báo cáo PDF 30 trang", "Sơ đồ bố trí nội thất"],
        highlight: false,
      },
      {
        name: "Hồ Sơ Nhà Hàng / Khách Sạn",
        price: "12.000.000",
        duration: "7–14 ngày làm việc",
        highlight: true,
        badge: "Phổ Biến",
        features: [
          "Tất cả từ gói Cơ Bản",
          "Phân tích toàn bộ mặt bằng đa tầng",
          "Hướng bếp chính & bếp phụ",
          "Khu vực VIP & tiếp đón",
          "Tư vấn ánh sáng & âm nhạc",
          "Chọn ngày khai trương & sự kiện",
        ],
        deliverables: [
          "Báo cáo chi tiết 80 trang",
          "Bản đồ phân vùng năng lượng",
          "2 lần khảo sát thực địa",
        ],
      },
      {
        name: "Hồ Sơ Resort / Khu Nghỉ Dưỡng",
        price: "25.000.000",
        priceNote: "Khởi điểm",
        duration: "14–21 ngày",
        badge: "Cao Cấp",
        features: [
          "Khảo sát địa hình & long mạch",
          "Phong thủy tổng thể khu resort",
          "Từng hạng mục: spa, hồ bơi, nhà hàng",
          "Cảnh quan & thiên nhiên nhân tạo",
          "Hòa hợp với thiên nhiên xung quanh",
          "Tư vấn đặt tên theo Ngũ Hành",
        ],
        deliverables: [
          "Bộ hồ sơ đầy đủ theo hạng mục",
          "Đồng hành toàn dự án",
          "Báo cáo định kỳ theo giai đoạn",
        ],
        highlight: false,
      },
    ],
  },
  {
    id: "thuongmai" as TabId,
    label: "Thương Mại",
    icon: ShoppingBag,
    tagline: "Cửa Hàng · Trung Tâm · Showroom · Siêu Thị",
    desc: "Phong thủy thương mại tập trung vào dòng chảy của khách hàng, vị trí trưng bày sản phẩm và năng lượng giao dịch — giúp tăng tỉ lệ chuyển đổi và doanh số bán hàng bền vững.",
    image: spaImg,
    packages: [
      {
        name: "Hồ Sơ Cửa Hàng",
        price: "4.500.000",
        duration: "4–6 ngày làm việc",
        features: [
          "Phân tích hướng cửa chính",
          "Bố trí kệ & quầy trưng bày",
          "Vị trí thu ngân hợp phong thủy",
          "Ánh sáng và màu sắc kích khách",
          "Hóa giải sát khí khu vực",
        ],
        deliverables: ["Báo cáo PDF 35 trang", "Sơ đồ bố trí cửa hàng"],
        highlight: false,
      },
      {
        name: "Hồ Sơ Showroom / Trung Tâm",
        price: "15.000.000",
        duration: "10–14 ngày làm việc",
        highlight: true,
        badge: "Toàn Diện",
        features: [
          "Tất cả từ gói Cơ Bản",
          "Phân tích toàn bộ mặt bằng lớn",
          "Khu vực tiếp khách VIP",
          "Hành lang & lối đi tối ưu dòng khách",
          "Hệ thống biển hiệu theo phong thủy",
          "Chọn ngày mở cửa, ra mắt BST",
        ],
        deliverables: [
          "Báo cáo toàn diện 90 trang",
          "Tư vấn trực tiếp không giới hạn 2 tháng",
          "Khảo sát thực địa 2–3 lần",
        ],
      },
      {
        name: "Hồ Sơ Siêu Thị / TTTM",
        price: "Liên hệ",
        priceNote: "Theo diện tích & quy mô",
        duration: "Theo thỏa thuận",
        badge: "Quy Mô Lớn",
        features: [
          "Phong thủy toàn khu thương mại",
          "Từng gian hàng / khu vực chức năng",
          "Tư vấn cho khách thuê mặt bằng",
          "Hệ thống biển quảng cáo & dẫn đường",
          "Sự kiện khai trương hoành tráng",
          "Đồng hành mở rộng chuỗi",
        ],
        deliverables: [
          "Hồ sơ phân khu đầy đủ",
          "Workshop phong thủy cho ban quản lý",
          "Cố vấn định kỳ hàng quý",
        ],
        highlight: false,
      },
    ],
  },
  {
    id: "dautu" as TabId,
    label: "Đầu Tư / BĐS",
    icon: Landmark,
    tagline: "Đầu Tư · Bất Động Sản · Tài Chính",
    desc: "Phong thủy đầu tư giúp phân tích thời điểm, địa điểm và hướng đi tối ưu cho các quyết định tài chính lớn — giảm rủi ro và tối đa hóa lợi nhuận dài hạn.",
    image: buildImg,
    packages: [
      {
        name: "Phân Tích Đầu Tư Cơ Bản",
        price: "6.000.000",
        duration: "5–7 ngày làm việc",
        features: [
          "Phân tích thời điểm mua/bán BĐS",
          "Đánh giá phong thủy lô đất / căn nhà",
          "Mệnh số nhà đầu tư & vận tài",
          "Hướng đầu tư hợp mệnh năm hiện tại",
          "Cảnh báo rủi ro theo phong thủy",
        ],
        deliverables: ["Báo cáo PDF 40 trang", "Tư vấn trực tiếp 45 phút"],
        highlight: false,
      },
      {
        name: "Hồ Sơ Danh Mục Đầu Tư",
        price: "18.000.000",
        duration: "10–14 ngày làm việc",
        highlight: true,
        badge: "Chuyên Sâu",
        features: [
          "Tất cả từ gói Cơ Bản",
          "Phân tích tối đa 5 BĐS / dự án",
          "Vận hạn tài chính 3–5 năm tới",
          "Chọn ngày ký hợp đồng, giải ngân",
          "Tư vấn phân bổ danh mục theo mệnh",
          "Chiến lược thoát hàng theo phong thủy",
        ],
        deliverables: [
          "Báo cáo tổng hợp 100+ trang",
          "3 buổi tư vấn trực tiếp",
          "Hỗ trợ theo dõi 6 tháng",
        ],
      },
      {
        name: "Cố Vấn Đầu Tư Dài Hạn",
        price: "Liên hệ",
        priceNote: "Gói hàng năm / hàng quý",
        duration: "Dài hạn",
        badge: "VIP",
        features: [
          "Cố vấn phong thủy tài chính liên tục",
          "Cập nhật vận hạn tháng / quý",
          "Phân tích không giới hạn dự án",
          "Ưu tiên lịch tư vấn khẩn cấp",
          "Tham dự họp nhóm đầu tư",
          "Báo cáo phong thủy thị trường định kỳ",
        ],
        deliverables: [
          "Cố vấn độc quyền hàng tháng",
          "Hotline ưu tiên 24/7",
          "Hồ sơ cập nhật theo năm",
        ],
        highlight: false,
      },
    ],
  },
];

const steps = [
  { icon: Phone,           num: "01", title: "Tư Vấn Ban Đầu",        sub: "Miễn phí · 15–30 phút",      desc: "Trao đổi qua điện thoại hoặc Zalo để hiểu nhu cầu kinh doanh, chọn loại hồ sơ phù hợp.", color: "text-gold",    border: "border-gold/30",    bg: "bg-gold/5"    },
  { icon: Search,          num: "02", title: "Khảo Sát & Thu Thập",   sub: "Ngày 1–3",                   desc: "Thu thập thông tin: địa chỉ, bản vẽ mặt bằng, ngày thành lập, thông tin lãnh đạo chủ chốt.", color: "text-primary", border: "border-primary/30", bg: "bg-primary/5" },
  { icon: PenLine,         num: "03", title: "Phân Tích & Lập Hồ Sơ", sub: "3–14 ngày làm việc",         desc: "Thầy Song Vũ trực tiếp phân tích và lập hồ sơ dịch vụ chuyên biệt theo loại hình kinh doanh.", color: "text-gold",    border: "border-gold/30",    bg: "bg-gold/5"    },
  { icon: FileText,        num: "04", title: "Bàn Giao & Thuyết Trình",sub: "Trực tiếp / online",          desc: "Nhận hồ sơ chi tiết và buổi thuyết trình toàn bộ kết quả, giải đáp câu hỏi không giới hạn.", color: "text-primary", border: "border-primary/30", bg: "bg-primary/5" },
  { icon: HeadphonesIcon,  num: "05", title: "Hỗ Trợ & Theo Dõi",    sub: "2–6 tháng tùy gói",          desc: "Đồng hành theo dõi, cập nhật hồ sơ theo diễn biến thực tế của doanh nghiệp.", color: "text-gold",    border: "border-gold/30",    bg: "bg-gold/5"    },
];

const whyItems = [
  { icon: Award,     title: "30+ Năm Kinh Nghiệm",   desc: "Thầy Song Vũ đích thân thực hiện từng hồ sơ, không qua trung gian." },
  { icon: TrendingUp,title: "Chứng Minh Bằng Kết Quả",desc: "1,000+ doanh nghiệp đã cải thiện doanh thu và môi trường làm việc." },
  { icon: Shield,    title: "Bảo Mật Tuyệt Đối",     desc: "Thông tin kinh doanh khách hàng được bảo mật hoàn toàn, không tiết lộ." },
  { icon: Zap,       title: "Giải Pháp Thực Tế",     desc: "Không lý thuyết suông — mọi khuyến nghị đều khả thi và triển khai được." },
  { icon: Users,     title: "Tiếp Cận Đa Chiều",     desc: "Tích hợp Bát Trạch, Huyền Không, Loan Đầu và Tứ Trụ trong một hồ sơ." },
  { icon: Sparkles,  title: "Đồng Hành Dài Hạn",     desc: "Không chỉ bàn giao xong — chúng tôi theo dõi và cập nhật cùng bạn." },
];

const faqs = [
  { q: "Hồ sơ dịch vụ dành cho những loại hình doanh nghiệp nào?", a: "Hồ sơ dịch vụ Song Vũ phù hợp với mọi loại hình: văn phòng công ty, nhà hàng – cafe – khách sạn, trung tâm thương mại, showroom, cơ sở sản xuất, bệnh viện, trường học, resort và các dự án bất động sản thương mại. Mỗi loại hình được lập hồ sơ theo phương pháp phong thủy chuyên biệt." },
  { q: "Cần cung cấp tài liệu gì để lập hồ sơ dịch vụ?", a: "Thông tin cần thiết gồm: địa chỉ và năm mở cửa kinh doanh, bản vẽ mặt bằng (CAD hoặc ảnh), ngày sinh và thông tin lãnh đạo chủ chốt, ngành nghề kinh doanh cụ thể, mục tiêu kỳ vọng (tăng doanh thu, cải thiện nội bộ, thu hút khách hàng...)." },
  { q: "Phong thủy doanh nghiệp có thực sự tác động đến doanh thu không?", a: "Theo kinh nghiệm 30+ năm của Thầy Song Vũ, phong thủy tối ưu giúp cải thiện dòng khách, giảm tỉ lệ nghỉ việc của nhân sự, tăng tỉ lệ chốt hợp đồng và tạo môi trường làm việc năng động. Đây là những yếu tố gián tiếp nhưng quan trọng đối với kết quả kinh doanh." },
  { q: "Có thể tư vấn phong thủy cho doanh nghiệp đang hoạt động không?", a: "Hoàn toàn có thể và rất hiệu quả. Phong thủy cải tạo (retrofit) tập trung vào điều chỉnh bố cục không gian, thêm vật phẩm hóa giải và tái định vị các khu vực quan trọng mà không cần sửa chữa lớn. Nhiều khách hàng nhận thấy kết quả cải thiện trong vòng 30–60 ngày sau khi áp dụng." },
  { q: "Hồ sơ dịch vụ có đi kèm đề xuất nội thất cụ thể không?", a: "Hồ sơ bao gồm hướng dẫn chi tiết về: màu sắc chủ đạo, vật liệu phù hợp, vị trí cây cảnh, tranh ảnh, ánh sáng và vật phẩm phong thủy. Với gói cao cấp, chúng tôi có thể phối hợp trực tiếp với kiến trúc sư nội thất để đảm bảo tính khả thi." },
];

const testimonials = [
  { name: "Nguyễn Minh Tuấn", role: "CEO – Chuỗi 5 nhà hàng Sakura", text: "Sau khi áp dụng hồ sơ phong thủy Song Vũ, 3/5 nhà hàng của tôi tăng trưởng doanh thu hơn 40% trong năm đầu tiên.", stars: 5 },
  { name: "Trần Thị Hương",   role: "Giám đốc – Khách sạn The Lotus", text: "Công suất phòng tăng từ 65% lên 88% sau khi tái bố trí theo hồ sơ. Nhân viên cũng làm việc vui vẻ hơn rõ rệt.", stars: 5 },
  { name: "Lê Văn Phúc",      role: "Chủ đầu tư – Dự án Sunshine Villa", text: "Hồ sơ phong thủy giúp tôi tự tin hơn rất nhiều trong quyết định đầu tư. Dự án bán hết 95% trong 6 tháng.", stars: 5 },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function ServiceProfilePage() {
  const [activeTab, setActiveTab]     = useState<TabId>("vanphong");
  const [openFaq, setOpenFaq]         = useState<number | null>(null);
  const [isBookingOpen, setBooking]   = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Hồ Sơ Dịch Vụ" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%">
            <defs><pattern id="hex" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D4AF37" strokeWidth="0.5"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#hex)" />
          </svg>
        </div>

        <div className="relative container mx-auto px-6 pb-20 pt-36">
          <nav className="flex items-center gap-2 text-xs text-white/30 uppercase tracking-widest mb-8">
            <Link to="/" className="hover:text-gold transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/#services" className="hover:text-gold transition-colors">Dịch Vụ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">Hồ Sơ Dịch Vụ</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold">Dịch Vụ Doanh Nghiệp</span>
            </div>
            <h1 className="text-5xl md:text-7xl mb-5 font-extrabold leading-tight uppercase tracking-wider">
              Hồ Sơ <span className="text-gold">Dịch Vụ</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mb-10 leading-relaxed font-light">
              Giải pháp phong thủy toàn diện cho doanh nghiệp — từ văn phòng, nhà hàng, thương mại
              đến đầu tư bất động sản quy mô lớn.
            </p>
            <div className="flex flex-wrap gap-10">
              {[["1.000+","Doanh Nghiệp"],["98%","Hài Lòng"],["4","Lĩnh Vực"],["30+","Năm KN"]].map(([v,l],i)=>(
                <div key={i} className="text-center">
                  <div className="text-gold text-2xl font-bold">{v}</div>
                  <div className="text-white/30 text-[10px] uppercase tracking-wider mt-1">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section className="py-20 bg-black border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold/50" />
              <span className="text-gold/80 uppercase tracking-[0.2em] text-xs font-bold">Tại Sao Chọn Chúng Tôi</span>
              <div className="h-px w-12 bg-gold/50" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Phong Thủy <span className="text-gold">Thực Chiến</span></h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto font-light">Không lý thuyết — mọi hồ sơ đều được tối ưu cho kết quả kinh doanh đo lường được.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyItems.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="border border-gold/10 bg-gold/3 p-6 hover:border-gold/25 hover:bg-gold/6 transition-all group"
              >
                <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/15 transition-colors">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-white mb-2 font-bold">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="py-24 bg-black" id="packages">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-red-500/50" />
              <span className="text-red-400/80 uppercase tracking-[0.2em] text-xs font-bold">Gói Dịch Vụ</span>
              <div className="h-px w-12 bg-red-500/50" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Chọn Lĩnh Vực <span className="text-red-400">Phù Hợp</span></h2>
          </div>

          {/* Tab nav */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 border text-sm transition-all duration-200 font-bold
                  ${activeTab === tab.id
                    ? "bg-gold text-black border-gold shadow-lg shadow-gold/20"
                    : "border-gold/20 text-white/60 hover:border-gold/40 hover:text-white"
                  }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
            >
              {/* Tab header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 items-center">
                <div>
                  <p className="text-gold/60 text-xs uppercase tracking-widest mb-3">{currentTab.tagline}</p>
                  <h3 className="text-3xl md:text-4xl text-white mb-4 font-bold leading-tight">
                    Phong Thủy <span className="text-gold">{currentTab.label}</span>
                  </h3>
                  <p className="text-white/50 leading-relaxed font-light">{currentTab.desc}</p>
                  <button
                    onClick={() => setBooking(true)}
                    className="mt-8 inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 transition-all shadow-lg shadow-red-600/20 font-bold text-sm uppercase tracking-widest"
                  >
                    <Calendar className="w-4 h-4" /> Tư Vấn Miễn Phí
                  </button>
                </div>
                <div className="relative overflow-hidden rounded-xl">
                  <img src={currentTab.image} alt={currentTab.label}
                    className="w-full h-64 object-cover brightness-60 hover:brightness-75 transition-all duration-700" />
                  <div className="absolute inset-0 border border-gold/20 rounded-xl" />
                </div>
              </div>

              {/* Packages grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentTab.packages.map((pkg, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex flex-col border p-7 transition-all duration-300 hover:-translate-y-1
                      ${pkg.highlight ? "border-gold bg-gold/5 shadow-xl shadow-gold/10" : "border-white/8 bg-white/2 hover:border-gold/30"}`}
                  >
                    {"badge" in pkg && pkg.badge && (
                      <div className={`absolute -top-3 left-6 px-4 py-1 text-[10px] uppercase tracking-wider font-bold
                        ${pkg.highlight ? "bg-gold text-black" : "bg-red-600 text-white"}`}>
                        {pkg.badge}
                      </div>
                    )}
                    <h4 className="text-white font-bold text-lg mb-2 leading-tight">{pkg.name}</h4>
                    <div className="mb-1">
                      <span className={`text-2xl font-extrabold ${pkg.highlight ? "text-gold" : "text-white"}`}>
                        {pkg.price !== "Liên hệ" ? `${pkg.price}đ` : "Liên hệ"}
                      </span>
                      {"priceNote" in pkg && pkg.priceNote && (
                        <span className="text-white/30 text-xs ml-2">{pkg.priceNote}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-white/30 text-xs mb-5">
                      <Clock className="w-3 h-3" /> {pkg.duration}
                    </div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {pkg.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-white/55 text-sm">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.highlight ? "text-gold" : "text-white/30"}`} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-white/8 pt-4 space-y-1">
                      <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-2">Bàn giao</p>
                      {pkg.deliverables.map((d, di) => (
                        <p key={di} className="text-white/45 text-xs flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gold/60 shrink-0" />{d}
                        </p>
                      ))}
                    </div>

                    <button onClick={() => setBooking(true)}
                      className={`mt-6 w-full py-3 text-xs uppercase tracking-widest font-bold transition-all
                        ${pkg.highlight
                          ? "bg-gold text-black hover:bg-gold/90 shadow-lg shadow-gold/20"
                          : "border border-white/20 text-white/70 hover:border-gold/40 hover:text-white"
                        }`}
                    >
                      Đăng Ký Gói Này
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold/50" />
              <span className="text-gold/80 uppercase tracking-[0.2em] text-xs font-bold">Quy Trình</span>
              <div className="h-px w-12 bg-gold/50" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">5 Bước <span className="text-gold">Lập Hồ Sơ</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative border ${step.border} ${step.bg} p-6 text-center`}
              >
                <div className={`text-xs uppercase tracking-widest ${step.color} font-bold mb-3`}>{step.num}</div>
                <div className={`w-10 h-10 border ${step.border} flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{step.title}</h4>
                <p className={`text-xs ${step.color} mb-3 opacity-70`}>{step.sub}</p>
                <p className="text-white/35 text-xs leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/30 hidden md:block z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Khách Hàng <span className="text-gold">Nói Gì</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="border border-white/8 p-6 bg-white/2 hover:border-gold/20 transition-all"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-white/55 leading-relaxed text-sm font-light mb-5">"{t.text}"</p>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-gold/60 text-xs mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Câu Hỏi <span className="text-gold">Thường Gặp</span></h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i}
                className={`border rounded-xl overflow-hidden transition-all duration-300
                  ${openFaq === i ? "border-gold/30 bg-gold/5" : "border-white/8 bg-white/2 hover:border-white/20"}`}
              >
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-white font-semibold text-sm leading-snug">{faq.q}</span>
                  <div className={`shrink-0 transition-colors ${openFaq === i ? "text-gold" : "text-white/30"}`}>
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
                        <div className="h-px bg-gold/10 mb-4" />
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

      {/* ── CTA ── */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden border border-gold/20 p-12 text-center bg-gradient-to-r from-gold/5 via-transparent to-red-900/5">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/4 top-0 w-64 h-32 bg-gold/10 rounded-full blur-[60px]" />
              <div className="absolute right-1/4 bottom-0 w-64 h-32 bg-red-700/10 rounded-full blur-[60px]" />
            </div>
            <div className="relative z-10">
              <p className="text-gold text-xs uppercase tracking-[0.3em] font-bold mb-3">Bắt Đầu Ngay Hôm Nay</p>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-widest">
                Sẵn Sàng <span className="text-gold">Kiến Tạo Vượng Khí</span>?
              </h3>
              <p className="text-white/40 mb-8 max-w-xl mx-auto font-light">
                Đặt lịch tư vấn miễn phí 30 phút với Thầy Song Vũ để tìm hiểu gói dịch vụ phù hợp nhất cho doanh nghiệp của bạn.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => setBooking(true)}
                  className="px-10 py-4 bg-gold text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold/90 transition-all shadow-lg shadow-gold/20"
                >
                  Đặt Lịch Tư Vấn Miễn Phí
                </button>
                <Link to="/ho-so-phong-thuy">
                  <button className="px-10 py-4 border border-white/20 text-white/70 text-xs uppercase tracking-[0.2em] font-bold hover:border-gold/30 hover:text-white transition-all">
                    Xem Hồ Sơ Phong Thủy
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setBooking(false)} />
    </div>
  );
}
