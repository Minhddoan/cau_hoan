import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Package, BookOpen, HelpCircle, Calendar,
  Briefcase, Users2, Clock, CheckCircle2, TrendingUp, Activity
} from 'lucide-react';
import api from '../lib/api';

const STATUS_COLORS: Record<string, string> = {
  pending: '#ECC94B', confirmed: '#38A169', completed: '#3182CE', cancelled: '#E53E3E'
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã huỷ'
};
const ACTION_ICONS: Record<string, string> = {
  CREATE: '✨', UPDATE: '✏️', DELETE: '🗑', LOGIN: '🔐', LOGOUT: '👋'
};

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData]     = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setData(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex-center" style={{ height: 300 }}>
      <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={18} className="text-gold" />
        Đang tải dữ liệu...
      </div>
    </div>
  );

  const stats = data?.stats;

  const statCards = [
    { label: 'Sản Phẩm',      value: stats?.products,          icon: Package,     color: '#D4AF37', bg: 'rgba(212,175,55,0.1)',   to: '/products' },
    { label: 'Bài Viết',      value: stats?.articles,          icon: BookOpen,    color: '#3182CE', bg: 'rgba(49,130,206,0.1)',   to: '/articles' },
    { label: 'Lịch Hẹn',      value: stats?.bookings,          icon: Calendar,    color: '#38A169', bg: 'rgba(56,161,105,0.1)',   to: '/bookings' },
    { label: 'Chờ Xác Nhận',  value: stats?.bookingsPending,   icon: Clock,       color: '#ECC94B', bg: 'rgba(236,201,75,0.1)',   to: '/bookings' },
    { label: 'Hôm Nay',       value: stats?.bookingsToday,     icon: TrendingUp,  color: '#E53E3E', bg: 'rgba(229,62,62,0.1)',   to: '/bookings' },
    { label: 'Tháng Này',     value: stats?.bookingsThisMonth, icon: CheckCircle2,color: '#805AD5', bg: 'rgba(128,90,213,0.1)',   to: '/bookings' },
    { label: 'Tuyển Dụng',    value: stats?.jobs,              icon: Briefcase,   color: '#DD6B20', bg: 'rgba(221,107,32,0.1)',   to: '/jobs' },
    { label: 'Đơn Ứng Tuyển', value: stats?.newApplications,  icon: Users2,      color: '#D53F8C', bg: 'rgba(213,63,140,0.1)',   to: '/jobs' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Tổng quan hoạt động hệ thống Phong Thủy Song Vũ</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {statCards.map((s, i) => (
          <div className="stat-card" key={i} onClick={() => navigate(s.to)}>
            <div className="icon-wrap" style={{ background: s.bg }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <div className="value" style={{ color: s.color }}>{s.value ?? '—'}</div>
              <div className="label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Chart: bookings by month */}
        <div className="card">
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            📈 Lịch Hẹn 6 Tháng Gần Đây
          </h3>
          {data?.charts?.bookingsByMonth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.charts.bookingsByMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#141418', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#D4AF37' }}
                />
                <Bar dataKey="count" name="Lịch hẹn" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Chưa có dữ liệu
            </div>
          )}
        </div>

        {/* Chart: bookings by status */}
        <div className="card">
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            📊 Trạng Thái Lịch Hẹn
          </h3>
          {data?.charts?.bookingsByStatus?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.charts.bookingsByStatus} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="status" type="category"
                  tickFormatter={v => STATUS_LABELS[v] || v}
                  tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} width={90}
                />
                <Tooltip
                  contentStyle={{ background: '#141418', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  formatter={(val, name, entry) => [val, STATUS_LABELS[entry.payload.status] || entry.payload.status]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.charts.bookingsByStatus.map((entry: any, i: number) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.status] || '#666'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Chưa có dữ liệu
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
          🕐 Hoạt Động Gần Đây
        </h3>
        {data?.recentActivity?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.recentActivity.map((log: any) => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.5rem', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '1rem', marginTop: 1 }}>{ACTION_ICONS[log.action] || '📝'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--gold)' }}>{log.full_name || log.user_email}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>
                      {log.action} {log.resource_type}{log.resource_name ? ` "${log.resource_name.substring(0,30)}"` : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 1 }}>
                    {new Date(log.created_at).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chưa có hoạt động nào</p>
        )}
      </div>
    </div>
  );
}
