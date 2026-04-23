import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EMPTY = { customer_name: '', customer_role: '', content: '', rating: 5, avatar_url: '', is_active: true, sort_order: 0 };

export function TestimonialsPage() {
  const { hasRole } = useAuth();
  const [items, setItems]   = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState<any>(null);
  const [form, setForm]   = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    // Use public endpoint (shows all active)
    const res = await api.get('/testimonials'); setItems(res.data.data);
  };
  useEffect(() => { load(); }, []);

  const open = (item?: any) => {
    setEditItem(item || null);
    setForm(item ? { ...item } : EMPTY);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.customer_name || !form.content) { toast.error('Thiếu tên và nội dung'); return; }
    setSaving(true);
    try {
      if (editItem) { await api.put(`/admin/testimonials/${editItem.id}`, form); toast.success('Cập nhật thành công'); }
      else { await api.post('/admin/testimonials', form); toast.success('Thêm đánh giá thành công'); }
      setShowModal(false); load();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Lỗi'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('Xóa đánh giá này?')) return;
    await api.delete(`/admin/testimonials/${id}`); toast.success('Đã xóa'); load();
  };

  const f = (k: string) => (e: any) => setForm((v: any) => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Đánh Giá Khách Hàng</h1>
          <p className="page-subtitle">{items.length} đánh giá</p>
        </div>
        {hasRole('editor') && <button className="btn btn-primary" onClick={() => open()}><Plus size={15} /> Thêm Đánh Giá</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {items.map(item => (
          <div className="card" key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.customer_name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.customer_role}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                {hasRole('editor') && <button className="btn btn-secondary btn-sm" onClick={() => open(item)}><Pencil size={11} /></button>}
                {hasRole('admin') && <button className="btn btn-danger btn-sm" onClick={() => del(item.id)}><Trash2 size={11} /></button>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={12} style={{ color: i < item.rating ? '#D4AF37' : 'rgba(255,255,255,0.1)', fill: i < item.rating ? '#D4AF37' : 'transparent' }} />
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.content}</p>
            <span className={`badge ${item.is_active ? 'badge-green' : 'badge-red'}`} style={{ marginTop: '0.625rem' }}>
              {item.is_active ? 'Đang hiển thị' : 'Ẩn'}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editItem ? 'Sửa Đánh Giá' : 'Thêm Đánh Giá'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="form-group"><label className="form-label">Tên Khách *</label><input className="form-input" value={form.customer_name} onChange={f('customer_name')} /></div>
            <div className="form-group"><label className="form-label">Vai Trò/Chức Vụ</label><input className="form-input" value={form.customer_role} onChange={f('customer_role')} placeholder="Giám đốc / Gia chủ..." /></div>
            <div className="form-group"><label className="form-label">Nội Dung *</label><textarea className="form-textarea" rows={4} value={form.content} onChange={f('content')} /></div>
            <div className="form-group">
              <label className="form-label">Đánh Giá (1-5 sao)</label>
              <select className="form-select" value={form.rating} onChange={f('rating')}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} sao</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">URL Avatar</label><input className="form-input" value={form.avatar_url} onChange={f('avatar_url')} placeholder="https://..." /></div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <input type="checkbox" checked={form.is_active} onChange={f('is_active')} /> Hiển thị trên website
            </label>
            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : editItem ? 'Cập Nhật' : 'Thêm'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
