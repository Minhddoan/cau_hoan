import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_STYLES: Record<string, string> = {
  pending: 'badge-gold', confirmed: 'badge-green', completed: 'badge-blue', cancelled: 'badge-red'
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', completed: 'Hoàn thành', cancelled: 'Đã huỷ'
};

const TYPE_LABELS: Record<string, string> = {
  master_booking: 'Gặp Thầy',
  consultation_request: 'Yêu cầu tư vấn'
};

const TYPE_STYLES: Record<string, string> = {
  master_booking: 'badge-gold',
  consultation_request: 'badge-blue'
};

export function BookingsPage() {
  const { hasRole } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [editItem, setEditItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]     = useState(false);
  const limit = 20;

  const load = async () => {
    setLoading(true);
    const res = await api.get('/admin/bookings', {
      params: { page, limit, search: search || undefined, status: status || undefined }
    });
    setBookings(res.data.data);
    setTotal(res.data.total);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, search, status]);

  const openEdit = (b: any) => { setEditItem({ ...b }); setShowModal(true); };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/bookings/${editItem.id}`, { status: editItem.status, note: editItem.note });
      toast.success('Cập nhật lịch hẹn thành công');
      setShowModal(false);
      load();
    } catch { toast.error('Lỗi cập nhật'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa lịch hẹn này?')) return;
    await api.delete(`/admin/bookings/${id}`);
    toast.success('Đã xóa');
    load();
  };

  const pages = Math.ceil(total / limit);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Lịch Hẹn Tư Vấn</h1>
          <p className="page-subtitle">Quản lý lịch đặt hẹn của khách ({total} lịch hẹn)</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div className="search-bar">
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            placeholder="Tìm tên, SĐT..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
        <select className="form-select" style={{ width: 'auto', minWidth: 150 }} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map(s => {
          const count = bookings.filter(b => b.status === s).length;
          const styles: Record<string, any> = {
            pending:   { bg: 'rgba(236,201,75,0.1)',  color: '#ECC94B', icon: Clock },
            confirmed: { bg: 'rgba(56,161,105,0.1)', color: '#38A169', icon: CheckCircle2 },
            completed: { bg: 'rgba(49,130,206,0.1)', color: '#3182CE', icon: CheckCircle2 },
            cancelled: { bg: 'rgba(229,62,62,0.1)',  color: '#E53E3E', icon: XCircle },
          };
          const st = styles[s];
          return (
            <div key={s} style={{ background: st.bg, border: `1px solid ${st.color}33`, borderRadius: 8, padding: '0.5rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <st.icon size={13} style={{ color: st.color }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: st.color }}>{STATUS_LABELS[s]}: {count}</span>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                 <th>#</th>
                <th>Khách Hàng</th>
                <th>Loại</th>
                <th>SĐT</th>
                <th>Dịch Vụ</th>
                <th>Ngày Hẹn</th>
                <th>Giờ</th>
                <th>Trạng Thái</th>
                <th>Đặt Lúc</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Không có lịch hẹn nào</td></tr>
              ) : bookings.map(b => (
                <tr key={b.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>#{b.id}</td>
                   <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{b.customer_name}</div>
                    {b.customer_email && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{b.customer_email}</div>}
                  </td>
                  <td>
                    <span className={`badge ${TYPE_STYLES[b.booking_type] || 'badge-gray'}`} style={{ fontSize: '0.6rem' }}>
                      {TYPE_LABELS[b.booking_type] || 'Không rõ'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b.customer_phone}</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.service_type || '—'}</td>
                  <td style={{ fontSize: '0.75rem' }}>
                    {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>{b.preferred_time || '—'}</td>
                  <td><span className={`badge ${STATUS_STYLES[b.status]}`}>{STATUS_LABELS[b.status]}</span></td>
                  <td style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {new Date(b.created_at).toLocaleString('vi-VN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {hasRole('editor') && (
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(b)}><Pencil size={12} /></button>
                      )}
                      {hasRole('admin') && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}><Trash2 size={12} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editItem && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h2 className="modal-title">Cập Nhật Lịch Hẹn #{editItem.id}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{editItem.customer_name}</div>
              <div style={{ color: 'var(--text-muted)' }}>{editItem.customer_phone} · {editItem.service_type}</div>
              {editItem.preferred_date && <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                {new Date(editItem.preferred_date).toLocaleDateString('vi-VN')} lúc {editItem.preferred_time}
              </div>}
            </div>

            <div className="form-group">
              <label className="form-label">Trạng Thái</label>
              <select className="form-select" value={editItem.status} onChange={e => setEditItem((v: any) => ({ ...v, status: e.target.value }))}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ghi Chú</label>
              <textarea className="form-textarea" value={editItem.note || ''} onChange={e => setEditItem((v: any) => ({ ...v, note: e.target.value }))} rows={3} placeholder="Ghi chú nội bộ..." />
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
                {saving ? 'Đang lưu...' : 'Cập Nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
