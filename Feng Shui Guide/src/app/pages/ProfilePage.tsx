import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { User, Calendar, Package, LogOut, ChevronRight, Save, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../../lib/api";
import { toast } from "sonner";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

type TabType = "profile" | "bookings" | "orders";

export default function ProfilePage() {
  const { user, logout, updateUser, isLoading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "profile";
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    birthday: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : "",
        address: user.address || "",
      });
      loadData();
    }
  }, [user]);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabType;
    if (tab && ["profile", "bookings", "orders"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, ordersRes] = await Promise.all([
        api.get("/my-bookings"),
        api.get("/my-orders")
      ]);
      setBookings(bookingsRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (err) {
      console.error("Error loading profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/auth/me", profileData);
      updateUser(res.data.user);
      toast.success("Cập nhật thông tin thành công");
    } catch (err) {
      toast.error("Lỗi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <User className="w-16 h-16 text-gold/30 mb-4" />
        <h1 className="text-2xl text-white font-bold mb-2">Bạn chưa đăng nhập</h1>
        <p className="text-gray-400 mb-6">Vui lòng đăng nhập để xem thông tin cá nhân</p>
        <a href="/" className="bg-gold text-black px-8 py-3 font-bold rounded-lg hover:bg-gold/90 transition-all">Quay lại Trang chủ</a>
      </div>
    );
  }

  const STATUS_CONFIG: Record<string, any> = {
    pending:   { color: "text-gold", bg: "bg-gold/10", label: "Chờ xử lý", icon: Clock },
    confirmed: { color: "text-blue-400", bg: "bg-blue-400/10", label: "Đã xác nhận", icon: CheckCircle2 },
    completed: { color: "text-green-400", bg: "bg-green-400/10", label: "Hoàn thành", icon: CheckCircle2 },
    cancelled: { color: "text-red-400", bg: "bg-red-400/10", label: "Đã hủy", icon: XCircle },
    shipping:  { color: "text-purple-400", bg: "bg-purple-400/10", label: "Đang giao", icon: Clock },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navigation />
      
      <div className="pt-32 pb-20 container mx-auto px-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-10">
          
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-gold/10 border-2 border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-gold" />
              </div>
              <h2 className="text-xl font-bold truncate">{user?.full_name}</h2>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{user?.role_display || 'Thành viên'}</p>
            </div>

            <nav className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <button 
                onClick={() => handleTabChange("profile")}
                className={`w-full flex items-center gap-4 px-6 py-4 text-sm transition-all ${activeTab === 'profile' ? 'bg-gold/10 text-gold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <User className="w-4 h-4" /> <span>Hồ sơ của tôi</span>
                {activeTab === 'profile' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
              <button 
                onClick={() => handleTabChange("bookings")}
                className={`w-full flex items-center gap-4 px-6 py-4 text-sm transition-all ${activeTab === 'bookings' ? 'bg-gold/10 text-gold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <Calendar className="w-4 h-4" /> <span>Lịch hẹn của tôi</span>
                {activeTab === 'bookings' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
              <button 
                onClick={() => handleTabChange("orders")}
                className={`w-full flex items-center gap-4 px-6 py-4 text-sm transition-all ${activeTab === 'orders' ? 'bg-gold/10 text-gold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <Package className="w-4 h-4" /> <span>Lịch sử mua hàng</span>
                {activeTab === 'orders' && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
              <div className="h-px bg-white/5" />
              <button 
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) logout();
                }}
                className="w-full flex items-center gap-4 px-6 py-4 text-sm text-red-400 hover:bg-red-400/5 transition-all"
              >
                <LogOut className="w-4 h-4" /> <span>Đăng xuất</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="bg-white/5 border border-white/10 rounded-2xl p-8 lg:p-10">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <User className="text-gold" /> Thông Tin Cá Nhân
                  </h3>
                  
                  <form onSubmit={handleUpdateProfile} className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Họ Tên</label>
                      <input 
                        type="text" 
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:border-gold/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Email (Không thể sửa)</label>
                      <input 
                        type="email" 
                        value={user?.email}
                        disabled
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl opacity-50 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Số Điện Thoại</label>
                      <input 
                        type="tel" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:border-gold/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Ngày Sinh</label>
                      <input 
                        type="date" 
                        value={profileData.birthday}
                        onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:border-gold/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Địa Chỉ</label>
                      <input 
                        type="text" 
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:border-gold/50 focus:outline-none transition-all"
                      />
                    </div>
                    
                    <div className="md:col-span-2 pt-4">
                      <button 
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-gold text-black px-8 py-3 font-bold rounded-xl hover:bg-gold/90 transition-all shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        {saving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === "bookings" && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Calendar className="text-gold" /> Lịch Hẹn Của Tôi
                  </h3>

                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-20 text-white/40">Đang tải lịch hẹn...</div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-20 bg-white/2 rounded-2xl border border-dashed border-white/10">
                        <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40">Bạn chưa có lịch hẹn nào</p>
                      </div>
                    ) : bookings.map((b) => {
                      const st = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                      const Icon = st.icon;
                      return (
                        <div key={b.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
                          <div className="space-y-1">
                            <div className="text-xs text-white/40 uppercase tracking-widest">#{b.id} · {new Date(b.created_at).toLocaleDateString('vi-VN')}</div>
                            <div className="text-lg font-bold text-gold">{b.service_type || 'Tư Vấn Phong Thủy'}</div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Calendar className="w-3.5 h-3.5" /> {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString('vi-VN') : '—'}
                              <Clock className="w-3.5 h-3.5 ml-2" /> {b.preferred_time || '—'}
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${st.bg} ${st.color} text-xs font-bold uppercase tracking-widest`}>
                            <Icon className="w-4 h-4" /> {st.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Package className="text-gold" /> Lịch Sử Mua Hàng
                  </h3>

                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-20 text-white/40">Đang tải đơn hàng...</div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-20 bg-white/2 rounded-2xl border border-dashed border-white/10">
                        <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40">Bạn chưa mua sản phẩm nào</p>
                      </div>
                    ) : orders.map((o) => {
                      const st = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending;
                      const Icon = st.icon;
                      return (
                        <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
                          <div className="space-y-1">
                            <div className="text-xs text-white/40 uppercase tracking-widest">Đơn hàng #{o.id} · {new Date(o.created_at).toLocaleDateString('vi-VN')}</div>
                            <div className="text-lg font-bold text-white">Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.total_amount)}</div>
                            <div className="text-sm text-white/60 truncate max-w-md">{o.shipping_address}</div>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${st.bg} ${st.color} text-xs font-bold uppercase tracking-widest`}>
                            <Icon className="w-4 h-4" /> {st.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
