import { createBrowserRouter } from "react-router";
import { Outlet } from "react-router";
import { Navigation } from "./components/Navigation.tsx";
import { BookingModal } from "./components/BookingModal.tsx";
import { useSettings } from "./context/SettingsContext.tsx";
import { LoginModal } from "./components/LoginModal.tsx";
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
import ProfilePage from "./pages/ProfilePage";

function RootLayout() {
  const { isBookingOpen, setBookingOpen, isLoginOpen, setLoginOpen } = useSettings();
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-gold selection:text-black">
      <Navigation />
      <Outlet />
      <BookingModal isOpen={isBookingOpen} onClose={() => setBookingOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
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
      { path: "profile", Component: ProfilePage },
    ],
  },
]);