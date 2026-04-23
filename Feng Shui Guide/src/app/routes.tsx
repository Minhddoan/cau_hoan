import { createBrowserRouter } from "react-router";
import { Outlet } from "react-router";
import { Navigation } from "./components/Navigation.tsx";
import { Home } from "./pages/Home.tsx";
import { CompanyPage } from "./pages/CompanyPage.tsx";
import { MasterPage } from "./pages/MasterPage.tsx";
import { FengShuiProfilePage } from "./pages/FengShuiProfilePage.tsx";
import { ServiceProfilePage } from "./pages/ServiceProfilePage.tsx";
import { AuspiciousDatePage } from "./pages/AuspiciousDatePage.tsx";
import { ProductDetailPage } from "./pages/ProductDetailPage.tsx";
import { ProductsPage } from "./pages/ProductsPage.tsx";
import { KnowledgePage } from "./pages/KnowledgePage.tsx";
import { QandAPage } from "./pages/QandAPage.tsx";
import { RecruitmentPage } from "./pages/RecruitmentPage.tsx";

function RootLayout() {
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-gold selection:text-black">
      <Navigation />
      <Outlet />
      <footer className="bg-black border-t border-gold/10 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="22" cy="22" r="21" stroke="#D4AF37" strokeWidth="1.5" />
                  <path d="M22 8L34 18V36H10V18L22 8Z" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
                  <circle cx="22" cy="21" r="3" fill="#D4AF37" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] tracking-[0.35em] uppercase text-gold/70 font-medium">Phong Thủy</span>
                  <span className="text-lg tracking-[0.15em] uppercase text-gold font-bold">Song Vũ</span>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed font-light">
                Chuyên gia tư vấn phong thủy hiện đại, kết hợp tinh hoa Á Đông và kiến thức khoa học, mang lại sự thịnh vượng và bình an cho mọi khách hàng.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest mb-6">Liên kết nhanh</h4>
              <ul className="space-y-4">
                {["Trang chủ", "Giới thiệu", "Dịch vụ", "Vật phẩm", "Kiến thức"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/40 hover:text-gold text-sm transition-colors uppercase tracking-wider">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest mb-6">Dịch vụ</h4>
              <ul className="space-y-4">
                {["Phong thủy nhà ở", "Phong thủy kinh doanh", "Xem ngày tốt", "Đặt tên bé", "Cải vận"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/40 hover:text-gold text-sm transition-colors uppercase tracking-wider">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest mb-6">Liên hệ</h4>
              <ul className="space-y-4 text-white/40 text-sm">
                <li>123 Đường Láng, Đống Đa, Hà Nội</li>
                <li>090 123 4567</li>
                <li>lienhe@phongthuysongvu.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">© 2026 Phong Thủy Song Vũ. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="text-white/20 text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:text-gold transition-colors">Chính sách bảo mật</span>
              <span className="text-white/20 text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:text-gold transition-colors">Điều khoản dịch vụ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "gioi-thieu", Component: CompanyPage },
      { path: "thay-song-vu", Component: MasterPage },
      { path: "ho-so-phong-thuy", Component: FengShuiProfilePage },
      { path: "ho-so-dich-vu", Component: ServiceProfilePage },
      { path: "xem-ngay", Component: AuspiciousDatePage },
      { path: "vat-pham", Component: ProductsPage },
      { path: "san-pham/:id", Component: ProductDetailPage },
      { path: "kien-thuc", Component: KnowledgePage },
      { path: "hoi-dap", Component: QandAPage },
      { path: "tuyen-dung", Component: RecruitmentPage },
    ],
  },
]);