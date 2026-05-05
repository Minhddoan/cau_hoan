import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Star,
  User,
  Home,
  Building2,
  Hammer,
  FileText,
  Clock,
  Shield,
  Search,
  PenLine,
  HandshakeIcon,
  HeadphonesIcon,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Phone,
} from "lucide-react";
import { Footer } from "../components/Footer.tsx";
import { useSettings } from "../context/SettingsContext.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { toast } from "sonner";

/* ── IMAGES ── */
const heroImg =
  "https://images.unsplash.com/photo-1691166968501-2a8021f731ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW5nJTIwc2h1aSUyMGhvbWUlMjBpbnRlcmlvciUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3NzU4MDU1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const astrologyImg =
  "https://images.unsplash.com/photo-1552321043-21830a856e1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3J0dW5lJTIwdGVsbGluZyUyMGFzdHJvbG9neSUyMGNoYXJ0JTIwcGFwZXJ8ZW58MXx8fHwxNzc1ODA1NTg3fDA&ixlib=rb-4.1.0&q=80&w=1080";
const officeImg =
  "https://images.unsplash.com/photo-1753751375630-73dbb5c62306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkYXJrJTIwb2ZmaWNlJTIwd29ya3NwYWNlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NTgwNTU5MHww&ixlib=rb-4.1.0&q=80&w=1080";
const buildingImg =
  "https://images.unsplash.com/photo-1621494518757-f6b0b7c099fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMENoaW5lc2UlMjBhcmNoaXRlY3R1cmUlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzU4MDU1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080";
const blueprintImg =
  "https://images.unsplash.com/photo-1721244653693-1d13e68b66c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBibHVlcHJpbnQlMjBidWlsZGluZyUyMHBsYW58ZW58MXx8fHwxNzc1ODA1NTkwfDA&ixlib=rb-4.1.0&q=80&w=1080";

/* ── DATA ── */
type TabId = "canhan" | "nhao" | "doanhnghiep" | "congtrinh";

interface PackageItem {
  name: string;
  price: string;
  priceNote?: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  deliverables: string[];
  duration: string;
}

interface TabData {
  id: TabId;
  label: string;
  icon: React.ElementType;
  tagline: string;
  desc: string;
  image: string;
  packages: PackageItem[];
}

const tabs: TabData[] = [
  {
    id: "canhan",
    label: "Cá Nhân",
    icon: User,
    tagline: "Mệnh Số · Sự Nghiệp · Hôn Nhân · Tài Vận",
    desc: "Hồ sơ phong thủy cá nhân luận giải vận mệnh theo Tứ Trụ – Bát Tự, xác định Ngũ Hành bản mệnh, phân tích vận hạn và đưa ra giải pháp cải vận toàn diện cho từng giai đoạn cuộc đời.",
    image: astrologyImg,
    packages: [
      {
        name: "Hồ Sơ Tứ Trụ Cơ Bản",
        price: "1.500.000",
        duration: "3–5 ngày làm việc",
        features: [
          "Phân tích Can Chi ngày sinh đầy đủ",
          "Xác định Ngũ Hành bản mệnh",
          "Màu sắc & hướng hợp mệnh",
          "Hướng nghề nghiệp phù hợp",
          "Cung cát hung trong năm hiện tại",
        ],
        deliverables: ["Báo cáo PDF 20 trang", "Bản tóm tắt trực quan"],
      },
      {
        name: "Hồ Sơ Mệnh Học Toàn Diện",
        price: "3.500.000",
        duration: "5–7 ngày làm việc",
        highlight: true,
        badge: "Phổ biến nhất",
        features: [
          "Tất cả từ gói Cơ Bản",
          "Phân tích vận hạn 5 năm tới",
          "Chiến lược sự nghiệp & tài vận",
          "Tư vấn hôn nhân & tình duyên",
          "Hóa giải hạn vận cụ thể",
          "Chọn năm tốt cho các quyết định lớn",
        ],
        deliverables: [
          "Báo cáo PDF 50 trang chi tiết",
          "Tư vấn trực tiếp 60 phút",
          "Hỗ trợ Q&A 3 tháng",
        ],
      },
      {
        name: "Hồ Sơ VIP Đặc Biệt",
        price: "6.500.000",
        duration: "7–10 ngày làm việc",
        badge: "VIP",
        features: [
          "Tất cả từ gói Toàn Diện",
          "Phân tích vận hạn 10 năm",
          "Tư vấn phong thủy nhà ở phối hợp",
          "Chọn ngày cưới / khai trương / xuất hành",
          "Lựa chọn vật phẩm phong thủy riêng",
          "Tư vấn gia đình (vợ/chồng, con cái)",
        ],
        deliverables: [
          "Báo cáo PDF 80+ trang",
          "2 buổi tư vấn trực tiếp",
          "Hỗ trợ không giới hạn 6 tháng",
        ],
      },
    ],
  },
  {
    id: "nhao",
    label: "Nhà Ở",
    icon: Home,
    tagline: "Bát Trạch · Huyền Không · Loan Đầu",
    desc: "Hồ sơ phong thủy nhà ở phân tích toàn diện khí trường của ngôi nhà, từ tọa hướng, cung phi đến bố trí nội thất — giúp gia đình thuận hòa, sức khỏe dồi dào, tài lộc hanh thông.",
    image: heroImg,
    packages: [
      {
        name: "Hồ Sơ Nhà Bát Trạch",
        price: "2.500.000",
        duration: "3–5 ngày làm việc",
        features: [
          "Phân tích cung phi gia chủ & gia đình",
          "Xác định 8 cung cát hung trong nhà",
          "Bố trí vị trí giường ngủ, bàn làm việc",
          "Hướng bếp & vị trí tài lộc",
          "Màu sắc nội thất theo mệnh",
          "Vật phẩm phong thủy phù hợp",
        ],
        deliverables: ["Báo cáo PDF 30 trang", "Sơ đồ phân cung trực quan"],
      },
      {
        name: "Hồ Sơ Huyền Không Phi Tinh",
        price: "5.000.000",
        duration: "5–7 ngày làm việc",
        highlight: true,
        badge: "Chuyên sâu",
        features: [
          "Tất cả từ gói Bát Trạch",
          "Phân tích Phi Tinh theo tọa hướng nhà",
          "Bản đồ vượng khí / suy khí / hung tinh",
          "Hóa giải hung tinh toàn diện theo năm",
          "Kích hoạt cung vượng tài, quý nhân",
          "Tư vấn sửa chữa / cải tạo nếu cần",
        ],
        deliverables: [
          "Báo cáo PDF 60 trang chi tiết",
          "Bản đồ năng lượng nhà (màu)",
          "Tư vấn trực tiếp tại nhà 90 phút",
        ],
      },
      {
        name: "Hồ Sơ Nhà Toàn Diện",
        price: "8.500.000",
        duration: "7–10 ngày làm việc",
        badge: "Cao cấp",
        features: [
          "Tất cả từ Huyền Không",
          "Khảo sát ngoại cảnh Loan Đầu",
          "Phân tích long mạch, minh đường",
          "Tích hợp mệnh số gia chủ vào hồ sơ",
          "Phối hợp với kiến trúc sư nếu cần",
          "Hỗ trợ chọn ngày dọn nhà, nhập trạch",
        ],
        deliverables: [
          "Báo cáo tổng hợp 100+ trang",
          "2 lần khảo sát thực địa",
          "Hỗ trợ theo dõi 6 tháng",
        ],
      },
    ],
  },
  {
    id: "doanhnghiep",
    label: "Doanh Nghiệp",
    icon: Building2,
    tagline: "Văn Phòng · Cửa Hàng · Nhà Hàng · Doanh Nghiệp",
    desc: "Hồ sơ phong thủy doanh nghiệp giúp tối ưu hóa năng lượng không gian làm việc, bố trí vị trí lãnh đạo và nhân viên theo hướng cát, kích hoạt vượng khí tài lộc cho toàn bộ hoạt động kinh doanh.",
    image: officeImg,
    packages: [
      {
        name: "Hồ Sơ Văn Phòng",
        price: "5.000.000",
        duration: "5–7 ngày làm việc",
        features: [
          "Phân tích tọa hướng văn phòng",
          "Bố trí bàn lãnh đạo theo mệnh",
          "Sơ đồ bố trí nhân sự tối ưu",
          "Khu vực tiếp khách & tài lộc",
          "Hướng cổng ra vào hợp khí",
          "Màu sắc & logo theo phong thủy",
        ],
        deliverables: ["Báo cáo PDF 40 trang", "Sơ đồ bố trí văn phòng"],
      },
      {
        name: "Hồ Sơ Doanh Nghiệp Toàn Diện",
        price: "10.000.000",
        duration: "7–14 ngày làm việc",
        highlight: true,
        badge: "Khuyên dùng",
        features: [
          "Tất cả từ Hồ Sơ Văn Phòng",
          "Phân tích mệnh số ban lãnh đạo",
          "Chiến lược kinh doanh theo phong thủy",
          "Chọn ngày khai trương / ra mắt sản phẩm",
          "Tư vấn thương hiệu theo Ngũ Hành",
          "Phân tích đối thủ theo ngày tháng",
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
          "Đào tạo nội bộ về phong thủy cơ bản",
          "Cố vấn phong thủy dài hạn",
        ],
        deliverables: [
          "Bộ hồ sơ theo từng địa điểm",
          "Cố vấn liên tục hàng quý",
          "Báo cáo định kỳ",
        ],
      },
    ],
  },
  {
    id: "congtrinh",
    label: "Công Trình",
    icon: Hammer,
    tagline: "Thiết Kế · Xây Dựng · Bất Động Sản",
    desc: "Hồ sơ phong thủy công trình xây dựng áp dụng Loan Đầu Pháp và Lý Khí để phân tích địa hình, xác định hướng công trình, bố trí mặt bằng và đảm bảo dòng khí vượng suốt vòng đời dự án.",
    image: blueprintImg,
    packages: [
      {
        name: "Hồ Sơ Thiết Kế Nhà Mới",
        price: "15.000.000",
        duration: "10–14 ngày làm việc",
        features: [
          "Khảo sát địa hình, long mạch thực địa",
          "Phân tích Loan Đầu toàn diện",
          "Xác định hướng cổng, hướng nhà tối ưu",
          "Tư vấn phân khu mặt bằng theo khí",
          "Phối hợp trực tiếp với kiến trúc sư",
          "Tư vấn vật liệu xây dựng theo Ngũ Hành",
        ],
        deliverables: [
          "Báo cáo phong thủy 80 trang",
          "Bản đồ phân vùng năng lượng",
          "2–3 buổi làm việc với kiến trúc sư",
        ],
      },
      {
        name: "Hồ Sơ Dự Án Bất Động Sản",
        price: "30.000.000",
        priceNote: "Khởi điểm",
        duration: "14–30 ngày làm việc",
        highlight: true,
        badge: "Dự án lớn",
        features: [
          "Tất cả từ Hồ Sơ Thiết Kế",
          "Phân tích tổng thể quy hoạch dự án",
          "Phong thủy khu biệt thự, chung cư",
          "Tư vấn đặt tên dự án theo Ngũ Hành",
          "Lộ trình phong thủy cho từng giai đoạn",
          "Hỗ trợ marketing theo phong thủy",
        ],
        deliverables: [
          "Bộ hồ sơ dự án đầy đủ",
          "Khảo sát thực địa không giới hạn",
          "Đồng hành toàn bộ dự án",
        ],
      },
      {
        name: "Hồ Sơ Công Trình Thương Mại",
        price: "Liên hệ",
        priceNote: "Báo giá theo dự án",
        duration: "Theo thỏa thuận",
        badge: "Thương mại",
        features: [
          "Trung tâm thương mại, khách sạn",
          "Khu công nghiệp, logistic",
          "Resort, khu nghỉ dưỡng",
          "Bệnh viện, trường học",
          "Công trình tâm linh",
          "Nhà máy, xưởng sản xuất",
        ],
        deliverables: [
          "Báo giá & phạm vi theo yêu cầu",
          "Đội ngũ chuyên gia phối hợp",
          "Bảo hành tư vấn dài hạn",
        ],
      },
    ],
  },
];

const steps = [
  {
    icon: Phone,
    num: "01",
    title: "Tư Vấn Ban Đầu",
    sub: "Miễn phí · 15–30 phút",
    desc: "Trao đổi qua điện thoại hoặc Zalo để hiểu nhu cầu, lựa chọn loại hồ sơ phù hợp và xác nhận thông tin cần thiết.",
    color: "text-gold",
    border: "border-gold/30",
    bg: "bg-gold/5",
  },
  {
    icon: Search,
    num: "02",
    title: "Thu Thập Thông Tin",
    sub: "Ngày 1–2",
    desc: "Gửi bảng thông tin chi tiết: ngày sinh, địa chỉ, bản vẽ mặt bằng (nếu có), mục tiêu cụ thể bạn muốn đạt được.",
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/5",
  },
  {
    icon: PenLine,
    num: "03",
    title: "Phân Tích & Lập Hồ Sơ",
    sub: "3–10 ngày làm việc",
    desc: "Thầy Song Vũ trực tiếp phân tích và soạn thảo hồ sơ theo từng phương pháp phong thủy chuyên sâu áp dụng cho trường hợp của bạn.",
    color: "text-gold",
    border: "border-gold/30",
    bg: "bg-gold/5",
  },
  {
    icon: FileText,
    num: "04",
    title: "Bàn Giao & Tư Vấn",
    sub: "Trực tiếp hoặc online",
    desc: "Nhận báo cáo hồ sơ chi tiết và có buổi tư vấn giải thích toàn bộ nội dung, hỏi đáp trực tiếp không giới hạn.",
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/5",
  },
  {
    icon: HeadphonesIcon,
    num: "05",
    title: "Hỗ Trợ Sau Bàn Giao",
    sub: "3–12 tháng tùy gói",
    desc: "Hỗ trợ theo dõi, kiểm tra tiến độ và cập nhật hồ sơ theo diễn biến thực tế, đảm bảo bạn luôn đi đúng hướng.",
    color: "text-gold",
    border: "border-gold/30",
    bg: "bg-gold/5",
  },
];

const faqs = [
  {
    q: "Hồ sơ phong thủy khác tư vấn phong thủy thông thường như thế nào?",
    a: "Tư vấn thông thường chỉ cho lời khuyên ngắn trong một buổi gặp. Hồ sơ phong thủy là tài liệu hệ thống, được nghiên cứu và soạn thảo kỹ lưỡng — bao gồm phân tích đầy đủ, bản đồ năng lượng, giải pháp chi tiết và theo dõi dài hạn. Đây là tài sản phong thủy bạn có thể sử dụng nhiều năm.",
  },
  {
    q: "Tôi cần cung cấp những thông tin gì để lập hồ sơ?",
    a: "Tùy loại hồ sơ. Hồ sơ cá nhân cần ngày giờ sinh đầy đủ. Hồ sơ nhà ở cần địa chỉ, năm xây dựng, bản vẽ mặt bằng và ngày sinh gia chủ. Hồ sơ doanh nghiệp cần thêm ngày thành lập, ngành nghề và thông tin lãnh đạo chủ chốt.",
  },
  {
    q: "Hồ sơ có được bảo mật không?",
    a: "Tuyệt đối bảo mật. Toàn bộ thông tin khách hàng được mã hóa và không bao giờ chia sẻ với bên thứ ba. Đây là cam kết hàng đầu của Phong Thủy Song Vũ trong suốt 15 năm hoạt động.",
  },
  {
    q: "Tôi có thể nhận hồ sơ theo hình thức nào?",
    a: "Hồ sơ được bàn giao dưới dạng PDF chất lượng cao qua email. Gói cao cấp bao gồm thêm file in ấn chuyên nghiệp đóng bìa cứng. Buổi tư vấn có thể diễn ra trực tiếp tại văn phòng, tại nhà khách hàng hoặc qua Zoom/Google Meet.",
  },
  {
    q: "Nếu chưa có bản vẽ nhà thì có lập được hồ sơ không?",
    a: "Vẫn có thể! Bạn có thể vẽ sơ đồ đơn giản bằng tay hoặc đo đạc cơ bản. Đội ngũ Song Vũ sẽ hỗ trợ hướng dẫn thu thập thông tin nhanh nhất. Nếu cần thiết, chúng tôi có thể cử người đến khảo sát thực địa.",
  },
  {
    q: "Thời gian hoàn thành hồ sơ là bao lâu?",
    a: "Từ 3 đến 14 ngày làm việc tùy theo loại và gói hồ sơ. Hồ sơ cá nhân cơ bản hoàn thành trong 3–5 ngày. Hồ sơ công trình lớn có thể mất 14–30 ngày do cần khảo sát thực địa và phối hợp nhiều chuyên gia.",
  },
];

const whyChoose = [
  {
    icon: Award,
    title: "30+ Năm Kinh Nghiệm",
    desc: "Thầy Song Vũ trực tiếp thực hiện mọi hồ sơ — không qua trung gian, không giao phó cho nhân viên cấp thấp.",
  },
  {
    icon: FileText,
    title: "Hồ Sơ Hệ Thống",
    desc: "Mỗi hồ sơ là tài liệu nghiên cứu kỹ lưỡng, trình bày khoa học, dễ hiểu — không phán xét mơ hồ.",
  },
  {
    icon: Shield,
    title: "Bảo Mật Tuyệt Đối",
    desc: "Thông tin khách hàng được bảo mật 100%. Không bao giờ tiết lộ hay sử dụng cho mục đích marketing.",
  },
  {
    icon: Clock,
    title: "Hỗ Trợ Dài Hạn",
    desc: "Không chỉ bàn giao xong là xong. Chúng tôi đồng hành cùng bạn trong suốt thời gian áp dụng hồ sơ.",
  },
  {
    icon: Star,
    title: "2,000+ Khách Hàng",
    desc: "Hơn 2,000 hồ sơ đã được lập, với tỉ lệ hài lòng 98% và hơn 60% khách hàng quay lại lần 2.",
  },
  {
    icon: Sparkles,
    title: "Kết Hợp Nhiều Pháp",
    desc: "Hồ sơ tích hợp Bát Tự, Bát Trạch, Huyền Không, Loan Đầu — không gò bó trong một phương pháp duy nhất.",
  },
];

/* ── COMPONENT ── */
export function FengShuiProfilePage() {
  const { setBookingOpen, setLoginOpen } = useSettings();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("canhan");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleBookingClick = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt lịch tư vấn.", {
        action: { label: "Đăng nhập ngay", onClick: () => setLoginOpen(true) }
      });
      return;
    }
    setBookingOpen(true);
  };

  const currentTab = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HERO ── */}
      <section className="relative min-h-[65vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Hồ Sơ Phong Thủy"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Back link */}
        <div className="absolute top-28 left-6 z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Về trang chủ
          </Link>
        </div>

        <div className="relative container mx-auto px-6 pb-20 pt-32">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/35 mb-6 flex-wrap">
            <Link to="/" className="hover:text-gold transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/#services" className="hover:text-gold transition-colors">
              Dịch Vụ
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gold">Hồ Sơ Phong Thủy</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span
                className="text-primary uppercase tracking-[0.2em] text-sm"
                style={{ fontWeight: 700 }}
              >
                Dịch Vụ Chuyên Nghiệp
              </span>
            </div>
            <h1
              className="text-5xl md:text-7xl mb-4 leading-tight"
              style={{ fontWeight: 700 }}
            >
              Hồ Sơ <span className="text-gold">Phong Thủy</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Giải pháp phong thủy toàn diện — từ mệnh số cá nhân đến không gian nhà ở,
              văn phòng và công trình xây dựng quy mô lớn.
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-8">
              {[
                { v: "500+", l: "Hồ Sơ Đã Lập" },
                { v: "98%", l: "Hài Lòng" },
                { v: "4", l: "Loại Hồ Sơ" },
                { v: "30+", l: "Năm Kinh Nghiệm" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-gold text-2xl" style={{ fontWeight: 700 }}>
                    {s.v}
                  </div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INTRO BENEFITS ── */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] bg-gold rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold" />
              <span
                className="text-gold uppercase tracking-[0.2em] text-sm"
                style={{ fontWeight: 700 }}
              >
                Vì Sao Cần Hồ Sơ Phong Thủy
              </span>
              <div className="h-px w-12 bg-gold" />
            </div>
            <h2 className="text-3xl md:text-5xl" style={{ fontWeight: 700 }}>
              Không Chỉ Là Lời Khuyên —{" "}
              <span className="text-gold">Là Tài Sản Lâu Dài</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
              Hồ sơ phong thủy là tài liệu hệ thống, được nghiên cứu kỹ lưỡng và trình bày
              khoa học — giúp bạn hiểu sâu, áp dụng đúng và theo dõi dài hạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="border border-gold/15 bg-gold/3 p-6 hover:border-gold/30 hover:bg-gold/6 transition-all group"
              >
                <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/15 transition-colors">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES (TABS) ── */}
      <section className="py-24 bg-background relative overflow-hidden" id="packages">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span
                className="text-primary uppercase tracking-[0.2em] text-sm"
                style={{ fontWeight: 700 }}
              >
                Các Loại Hồ Sơ
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl" style={{ fontWeight: 700 }}>
              Chọn Loại Hồ Sơ{" "}
              <span className="text-primary">Phù Hợp</span>
            </h2>
          </div>

          {/* Tab nav */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 transition-all duration-200 border text-sm ${activeTab === tab.id
                    ? "bg-gold text-black border-gold shadow-lg shadow-gold/20"
                    : "border-gold/20 text-white/70 hover:border-gold/50 hover:text-white bg-transparent"
                  }`}
                style={{ fontWeight: activeTab === tab.id ? 700 : 500 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {/* Tab header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 items-center">
                <div>
                  <p className="text-gold/70 text-sm uppercase tracking-widest mb-3">
                    {currentTab.tagline}
                  </p>
                  <h3
                    className="text-3xl md:text-4xl text-white mb-5 leading-tight"
                    style={{ fontWeight: 700 }}
                  >
                    Hồ Sơ{" "}
                    <span className="text-gold">{currentTab.label}</span>
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{currentTab.desc}</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBookingClick}
                    className="mt-8 inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full transition-all shadow-lg shadow-primary/20"
                    style={{ fontWeight: 700 }}
                  >
                    <Calendar className="w-5 h-5" />
                    Tư Vấn Miễn Phí
                  </motion.button>
                </div>
                <div className="relative overflow-hidden">
                  <img
                    src={currentTab.image}
                    alt={currentTab.label}
                    className="w-full h-64 object-cover brightness-70 hover:brightness-80 transition-all duration-500"
                  />
                  <div className="absolute inset-0 border border-gold/20" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
                </div>
              </div>

              {/* Packages grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentTab.packages.map((pkg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className={`relative flex flex-col border p-7 transition-all duration-300 hover:-translate-y-1 ${pkg.highlight
                        ? "border-gold bg-gold/5 shadow-xl shadow-gold/10"
                        : "border-white/8 bg-white/2 hover:border-gold/30"
                      }`}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <div
                        className={`absolute -top-3 left-6 px-4 py-1 text-xs uppercase tracking-wider ${pkg.highlight
                            ? "bg-gold text-black"
                            : "bg-primary text-white"
                          }`}
                        style={{ fontWeight: 700 }}
                      >
                        {pkg.badge}
                      </div>
                    )}

                    {/* Name */}
                    <h4
                      className="text-white mb-1 text-lg leading-tight"
                      style={{ fontWeight: 700 }}
                    >
                      {pkg.name}
                    </h4>

                    {/* Price */}
                    <div className="mb-5 pb-5 border-b border-white/8">
                      {pkg.priceNote ? (
                        <div>
                          <span
                            className="text-3xl text-gold"
                            style={{ fontWeight: 700 }}
                          >
                            {pkg.price}
                          </span>
                          <p className="text-gray-500 text-xs mt-1">{pkg.priceNote}</p>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span
                            className="text-3xl text-gold"
                            style={{ fontWeight: 700 }}
                          >
                            {pkg.price}
                          </span>
                          <span className="text-gray-500 text-sm">đ</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3.5 h-3.5 text-gold/50" />
                        <span className="text-gray-500 text-xs">{pkg.duration}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2.5 mb-6 flex-1">
                      <p
                        className="text-white/60 text-xs uppercase tracking-wider mb-3"
                        style={{ fontWeight: 600 }}
                      >
                        Nội dung phân tích
                      </p>
                      {pkg.features.map((f, j) => (
                        <div key={j} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.highlight ? "text-gold" : "text-primary"
                              }`}
                          />
                          <span className="text-gray-300">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Deliverables */}
                    <div className="border-t border-white/8 pt-5 mb-6">
                      <p
                        className="text-white/60 text-xs uppercase tracking-wider mb-3"
                        style={{ fontWeight: 600 }}
                      >
                        Bàn giao
                      </p>
                      {pkg.deliverables.map((d, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-gray-500 mb-1.5">
                          <div className="w-1 h-1 rounded-full bg-gold/50 shrink-0 mt-1.5" />
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBookingClick}
                      className={`w-full py-3.5 text-sm transition-all ${pkg.highlight
                          ? "bg-gold text-black hover:bg-gold/90"
                          : "border border-gold/30 text-gold hover:bg-gold/5 hover:border-gold"
                        }`}
                      style={{ fontWeight: 700 }}
                    >
                      {pkg.price === "Liên hệ" ? "Liên Hệ Báo Giá" : "Đặt Lịch Ngay"}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-4 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold" />
              <span
                className="text-gold uppercase tracking-[0.2em] text-sm"
                style={{ fontWeight: 700 }}
              >
                Quy Trình
              </span>
              <div className="h-px w-12 bg-gold" />
            </div>
            <h2 className="text-3xl md:text-5xl" style={{ fontWeight: 700 }}>
              5 Bước <span className="text-gold">Từ Thông Tin</span>{" "}
              Đến <span className="text-primary">Giải Pháp</span>
            </h2>
          </div>

          {/* Steps — horizontal on desktop, vertical on mobile */}
          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Number + Icon */}
                  <div
                    className={`w-[72px] h-[72px] flex flex-col items-center justify-center border-2 ${step.border} ${step.bg} mb-5 relative z-10 bg-black`}
                  >
                    <span
                      className={`text-[9px] tracking-widest ${step.color} opacity-60`}
                      style={{ fontWeight: 700 }}
                    >
                      {step.num}
                    </span>
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>

                  <h4 className="text-white mb-1" style={{ fontWeight: 700 }}>
                    {step.title}
                  </h4>
                  <p
                    className={`text-xs mb-3 uppercase tracking-wider ${step.color} opacity-70`}
                  >
                    {step.sub}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span
                className="text-primary uppercase tracking-[0.2em] text-sm"
                style={{ fontWeight: 700 }}
              >
                Tổng Quan
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl" style={{ fontWeight: 700 }}>
              So Sánh <span className="text-primary">Các Loại</span> Hồ Sơ
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="border-b border-gold/20">
                  <th className="text-left py-4 px-5 text-gold/60 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    Tiêu chí
                  </th>
                  {tabs.map((t) => (
                    <th
                      key={t.id}
                      className="py-4 px-5 text-center text-xs uppercase tracking-wider"
                      style={{ fontWeight: 700 }}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <t.icon
                          className={`w-5 h-5 ${activeTab === t.id ? "text-gold" : "text-white/50"
                            }`}
                        />
                        <span
                          className={
                            activeTab === t.id ? "text-gold" : "text-white/50"
                          }
                        >
                          {t.label}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Đối tượng",
                    vals: ["Cá nhân", "Gia đình", "Doanh nghiệp", "Chủ đầu tư"],
                  },
                  {
                    label: "Phương pháp chính",
                    vals: ["Tứ Trụ – Bát Tự", "Bát Trạch + Huyền Không", "Phi Tinh + Loan Đầu", "Loan Đầu + Địa Lý"],
                  },
                  {
                    label: "Giá từ",
                    vals: ["1.500.000 đ", "2.500.000 đ", "5.000.000 đ", "15.000.000 đ"],
                  },
                  {
                    label: "Thời gian",
                    vals: ["3–7 ngày", "3–10 ngày", "7–14 ngày", "10–30+ ngày"],
                  },
                  {
                    label: "Khảo sát thực địa",
                    vals: ["Không cần", "Tùy gói", "Tùy gói", "Bắt buộc"],
                  },
                  {
                    label: "Hỗ trợ sau bàn giao",
                    vals: ["3–6 tháng", "3–6 tháng", "3–6 tháng", "Theo dự án"],
                  },
                ].map((row, ri) => (
                  <tr
                    key={ri}
                    className={`border-b border-white/5 ${ri % 2 === 0 ? "bg-white/1" : ""}`}
                  >
                    <td className="py-4 px-5 text-gray-400 text-sm">{row.label}</td>
                    {row.vals.map((v, vi) => (
                      <td
                        key={vi}
                        className={`py-4 px-5 text-center text-sm ${tabs[vi].id === activeTab
                            ? "text-gold"
                            : "text-gray-500"
                          }`}
                        style={{ fontWeight: tabs[vi].id === activeTab ? 600 : 400 }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-gold" />
              <span
                className="text-gold uppercase tracking-[0.2em] text-sm"
                style={{ fontWeight: 700 }}
              >
                Câu Hỏi Thường Gặp
              </span>
              <div className="h-px w-12 bg-gold" />
            </div>
            <h2 className="text-3xl md:text-5xl" style={{ fontWeight: 700 }}>
              Giải Đáp <span className="text-gold">Thắc Mắc</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`border transition-all duration-300 ${openFaq === i
                    ? "border-gold/40 bg-gold/5"
                    : "border-white/8 bg-white/2 hover:border-gold/20"
                  }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={`text-sm leading-relaxed transition-colors ${openFaq === i ? "text-gold" : "text-white"
                      }`}
                    style={{ fontWeight: openFaq === i ? 700 : 500 }}
                  >
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gold shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gold/40 shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gold/10 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gold rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <img
                src={buildingImg}
                alt="Phong Thủy Song Vũ"
                className="w-full h-80 object-cover brightness-60"
              />
              <div className="absolute inset-0 border border-gold/20" />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 bg-black/90 border border-gold/30 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <div>
                    <div className="text-white text-xs" style={{ fontWeight: 700 }}>
                      4.9 / 5.0
                    </div>
                    <div className="text-gray-500 text-[10px]">từ 500+ hồ sơ</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-gold" />
                <span
                  className="text-gold uppercase tracking-[0.2em] text-sm"
                  style={{ fontWeight: 700 }}
                >
                  Bắt Đầu Ngay
                </span>
              </div>
              <h2
                className="text-4xl md:text-5xl mb-6 leading-tight"
                style={{ fontWeight: 700 }}
              >
                Sẵn Sàng Lập{" "}
                <span className="text-gold">Hồ Sơ Phong Thủy?</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Buổi tư vấn ban đầu hoàn toàn miễn phí. Chúng tôi sẽ giúp bạn xác định
                loại hồ sơ phù hợp nhất với nhu cầu và ngân sách của bạn.
              </p>

              <ul className="space-y-3 mb-10">
                {[
                  "Tư vấn ban đầu 15–30 phút hoàn toàn miễn phí",
                  "Cam kết bảo mật tuyệt đối thông tin khách hàng",
                  "Hồ sơ trình bày chuyên nghiệp, dễ hiểu, dễ áp dụng",
                  "Hỗ trợ theo dõi và cập nhật sau bàn giao",
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
                  onClick={handleBookingClick}
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full transition-all shadow-xl shadow-primary/20"
                  style={{ fontWeight: 700 }}
                >
                  <Calendar className="w-5 h-5" />
                  Đặt Lịch Tư Vấn Miễn Phí
                </motion.button>
                <motion.a
                  href="tel:+84912345678"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 border border-gold/40 hover:border-gold text-gold hover:bg-gold/5 px-8 py-4 rounded-full transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Liên Hệ Ngay
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
