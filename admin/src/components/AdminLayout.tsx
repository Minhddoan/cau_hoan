import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Package, BookOpen, HelpCircle, Calendar,
  Users2, Settings, FileText, Star, LogOut, Bell, ChevronDown,
  Image, ConciergeBell, FileBadge
} from 'lucide-react';

const navItems = [
  {
    group: 'Tổng Quan', items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ]
  },
  {
    group: 'Nội Dung', items: [
      { to: '/products', icon: Package, label: 'Sản Phẩm' },
      { to: '/services', icon: ConciergeBell, label: 'Dịch Vụ' },
      { to: '/articles', icon: BookOpen, label: 'Bài Viết' },
      { to: '/gallery', icon: Image, label: 'Thư Viện' },
      { to: '/faqs', icon: HelpCircle, label: 'Hỏi Đáp' },
      { to: '/testimonials', icon: Star, label: 'Đánh Giá' },
    ]
  },
  {
    group: 'Vận Hành', items: [
      { to: '/bookings', icon: Calendar, label: 'Lịch Hẹn' },
      { to: '/jobs', icon: FileBadge, label: 'Tuyển Dụng' },
    ]
  },
  {
    group: 'Hệ Thống', items: [
      { to: '/users', icon: Users2, label: 'Người Dùng', role: 'super_admin' },
      { to: '/settings', icon: Settings, label: 'Cài Đặt', role: 'admin' },
      { to: '/audit-logs', icon: FileText, label: 'Nhật Ký', role: 'admin' },
    ]
  },
];

export function AdminLayout() {
  const { user, logout, hasRole } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const initials = user.full_name?.split(' ').slice(-2).map(s => s[0]).join('') || 'AD';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <h1>⛩ SONG VŨ</h1>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(group => (
            <div key={group.group}>
              <div className="nav-group-label">{group.group}</div>
              {group.items
                .filter(item => !item.role || hasRole(item.role))
                .map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  >
                    <item.icon className="icon" />
                    {item.label}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.full_name}</div>
            <div className="sidebar-user-role">{user.role_display}</div>
          </div>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
            title="Đăng xuất"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-content">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Phong Thủy Song Vũ — Admin Panel
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bell size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', position: 'relative' }}
              onClick={() => setShowUserMenu(v => !v)}
            >
              <span style={{ color: 'var(--text-muted)' }}>{user.email}</span>
              <span className={`badge badge-${user.role === 'super_admin' ? 'gold' : user.role === 'admin' ? 'blue' : user.role === 'editor' ? 'green' : 'gray'}`}>
                {user.role_display}
              </span>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                  backgroundColor: 'white', border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem', padding: '0.5rem', zIndex: 50,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', minWidth: '120px'
                }}>
                  <div
                    onClick={logout}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}
                  >
                    <LogOut size={16} /> Đăng xuất
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
