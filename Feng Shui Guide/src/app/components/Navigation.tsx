import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X, User, ShoppingCart, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { LoginModal } from "./LoginModal.tsx";
import { ShoppingCart as Cart } from "./ShoppingCart.tsx";
import { useCart } from "../context/CartContext.tsx";

interface MenuItem {
  label: string;
  href: string;
  children?: { label: string; href: string; route?: string }[];
  highlighted?: boolean;
  route?: string;
}

const menuItems: MenuItem[] = [
  { label: "Trang chủ", href: "#home", route: "/" },
  {
    label: "Giới Thiệu",
    href: "#about",
    children: [
      { label: "Về Công Ty",   href: "#about",  route: "/gioi-thieu"  },
      { label: "Thầy Song Vũ", href: "#master", route: "/thay-song-vu" },
      { label: "Tuyển Dụng",   href: "#about",  route: "/tuyen-dung"  },
    ],
  },
  {
    label: "Dịch Vụ",
    href: "#services",
    children: [
      { label: "Hồ Sơ Phong Thủy", href: "#services", route: "/ho-so-phong-thuy" },
      { label: "Hồ Sơ Dịch Vụ",    href: "#services", route: "/ho-so-dich-vu"    },
      { label: "Xem Ngày",          href: "#services", route: "/xem-ngay"          },
    ],
  },
  {
    label: "Vật Phẩm",
    href: "#products",
    children: [
      { label: "Linh Vật", href: "#products" },
      { label: "Trầm Hương", href: "#products", route: "/san-pham/tram-huong-vip" },
      { label: "Trang Sức", href: "#products" },
    ],
  },
  {
    label: "Góc Phong Thủy",
    href: "#knowledge",
    children: [
      { label: "Kiến Thức", href: "#knowledge", route: "/kien-thuc" },
      { label: "Tra Cứu / Hỏi Đáp", href: "#qanda", route: "/hoi-dap" },
    ],
  },
  { label: "Trợ Lý AI", href: "#assistant", highlighted: true },
  { label: "Liên Hệ", href: "#contact" },
];

function LogoSVG() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="21" stroke="#D4AF37" strokeWidth="1.5" />
        <path d="M22 8L34 18V36H10V18L22 8Z" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
        <path d="M16 36V25H28V36" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
        <circle cx="22" cy="21" r="3" fill="#D4AF37" />
        <path d="M22 8V5M8 22H5M39 22H36M22 39V42" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" />
        <path d="M11 11L9 9M35 11L37 9M11 33L9 35M35 33L37 35" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-[9px] tracking-[0.35em] uppercase text-gold/70 font-medium">Phong Thủy</span>
        <span
          className="text-xl tracking-[0.15em] uppercase"
          style={{ color: "#D4AF37", fontWeight: 700, letterSpacing: "0.15em" }}
        >
          Song Vũ
        </span>
      </div>
    </Link>
  );
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle nav link click: on home page scroll to anchor; on sub-pages navigate home first
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    route?: string
  ) => {
    // If item has a dedicated route (not home), navigate there
    if (route && route !== "/") {
      e.preventDefault();
      navigate(route);
      return;
    }
    // On home page, let default anchor scroll work
    if (isHome) return;
    // On sub-pages, navigate home then scroll to section
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 350);
  };

  const navClasses = isScrolled
    ? "bg-black/90 backdrop-blur-md shadow-xl shadow-black/50 py-3"
    : "bg-gradient-to-b from-black/80 to-transparent py-5";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClasses}`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <LogoSVG />

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={item.route && item.route !== "/" ? item.route : item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.route)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm tracking-wide transition-all duration-200 relative
                      ${
                        item.highlighted
                          ? "text-black bg-gold rounded-full px-5 hover:bg-gold/90 shadow-lg shadow-gold/30"
                          : "text-white/85 hover:text-gold"
                      }`}
                    style={{ fontWeight: item.highlighted ? 700 : 500 }}
                  >
                    {item.label}
                    {item.children && !item.highlighted && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    )}
                  </a>

                  {/* Underline for non-highlighted */}
                  {!item.highlighted && (
                    <div className="absolute bottom-0 left-3 right-3 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-black/95 border border-gold/20 rounded-xl shadow-2xl shadow-black overflow-hidden backdrop-blur-xl"
                      >
                        <div className="p-2">
                          {item.children.map((child) => (
                            <a
                              key={child.label}
                              href={child.route || child.href}
                              onClick={(e) => handleNavClick(e, child.href, child.route)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/75 hover:text-gold hover:bg-gold/5 rounded-lg transition-all duration-150"
                            >
                              <span className="w-1 h-1 rounded-full bg-gold/50 shrink-0" />
                              {child.label}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLoginOpen(true)}
                className="p-2.5 text-white/80 hover:text-gold hover:bg-white/5 rounded-full transition-all"
                aria-label="Tài khoản"
              >
                <User strokeWidth={1.5} className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 text-white/80 hover:text-gold hover:bg-white/5 rounded-full transition-all relative"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart strokeWidth={1.5} className="w-5 h-5" />
                {totalItems > 0 && (
                  <span
                    className="absolute top-1 right-1 bg-gold text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ fontWeight: 800 }}
                  >
                    {totalItems}
                  </span>
                )}
              </motion.button>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 text-white ml-1"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-0 w-full h-screen bg-black z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gold/10">
                <LogoSVG />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-gold p-2 transition-colors"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.label} className="border-b border-white/5 pb-1">
                    <a
                      href={item.route && item.route !== "/" ? item.route : item.href}
                      onClick={(e) => {
                        handleNavClick(e, item.href, item.route);
                        if (!item.children) setIsOpen(false);
                      }}
                      className={`block py-4 text-lg ${item.highlighted ? "text-gold" : "text-white"}`}
                      style={{ fontWeight: item.highlighted ? 700 : 500 }}
                    >
                      {item.label}
                    </a>
                    {item.children && (
                      <div className="pl-4 pb-3 space-y-2">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.route || child.href}
                            onClick={(e) => {
                              handleNavClick(e, child.href, child.route);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-2 text-white/50 hover:text-gold py-1.5 transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-gold/40" />
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-white border border-white/10"
                >
                  <User className="w-5 h-5" /> Đăng nhập
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-gold/10 rounded-xl text-gold border border-gold/30 relative"
                >
                  <ShoppingCart className="w-5 h-5" /> Giỏ hàng
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}