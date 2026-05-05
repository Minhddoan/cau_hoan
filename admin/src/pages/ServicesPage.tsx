import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, ConciergeBell } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ImagePicker } from '../components/ImagePicker';

const EMPTY_FORM = {
  slug: '', name: '', description: '', icon_name: 'Home',
  price_from: '', price_to: '', duration: '',
  is_active: true, is_featured: false, sort_order: 0,
  features: '', deliverables: '', image_url: ''
};

export function ServicesPage() {
  const { hasRole } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/services');
      setServices(res.data.data);
    } catch (error) {
      toast.error('Lỗi tải danh sách dịch vụ');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit   = (s: any) => {
    setEditItem(s);
    setForm({
      slug: s.slug,
      name: s.name,
      description: s.description || '',
      icon_name: s.icon_name || 'Home',
      price_from: s.price_from || '',
      price_to: s.price_to || '',
      duration: s.duration || '',
      is_active: s.is_active,
      is_featured: s.is_featured,
      sort_order: s.sort_order || 0,
      features: (s.features || []).join('\n'),
      deliverables: (s.deliverables || []).join('\n'),
      image_url: s.image_url || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      toast.error('Vui lòng điền tên và slug');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features.split('\n').filter(l => l.trim()),
        deliverables: form.deliverables.split('\n').filter(l => l.trim()),
        price_from: form.price_from || null,
        price_to: form.price_to || null
      };

      if (editItem) {
        await api.put(`/admin/services/${editItem.id}`, payload);
        toast.success('Cập nhật thành công');
      } else {
        await api.post('/admin/services', payload);
        toast.success('Tạo dịch vụ thành công');
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi server');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa dịch vụ "${name}"?`)) return;
    try {
      await api.delete(`/admin/services/${id}`);
      toast.success('Đã xóa dịch vụ');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi');
    }
  };

  const f = (k: string) => (e: any) => setForm(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dịch Vụ Tư Vấn</h1>
          <p className="page-subtitle">Quản lý các gói dịch vụ phong thủy ({services.length} dịch vụ)</p>
        </div>
        {hasRole('editor') && (
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={15} /> Thêm Dịch Vụ
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Icon/Ảnh</th>
                <th>Tên Dịch Vụ</th>
                <th>Giá Khoảng</th>
                <th>Thời Lượng</th>
                <th>Trạng Thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Chưa có dịch vụ nào</td></tr>
              ) : services.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="thumb flex-center" style={{ background: 'var(--bg-hover)', width: 40, height: 40, borderRadius: 8 }}>
                        <ConciergeBell size={18} style={{ color: 'var(--gold)' }} />
                      </div>
                      {s.image_url && <span className="text-xs text-gold">Has Image</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{s.name}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.slug}</div>
                  </td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600 }}>
                    {s.price_from ? Number(s.price_from).toLocaleString('vi-VN') : '—'} 
                    {s.price_to ? ` - ${Number(s.price_to).toLocaleString('vi-VN')}` : ''}đ
                  </td>
                  <td>{s.duration || '—'}</td>
                  <td>
                    <span className={`badge ${s.is_active ? 'badge-green' : 'badge-red'}`}>
                      {s.is_active ? 'Kích hoạt' : 'Ẩn'}
                    </span>
                    {s.is_featured && <span className="badge badge-gold" style={{ marginLeft: 4 }}>Nổi bật</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {hasRole('editor') && (
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}><Pencil size={12} /></button>
                      )}
                      {hasRole('admin') && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id, s.name)}><Trash2 size={12} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editItem ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Tên Dịch Vụ *</label>
                <input className="form-input" value={form.name} onChange={f('name')} placeholder="Tư vấn phong thủy nhà ở..." />
              </div>
              <div className="form-group">
                <label className="form-label">Slug *</label>
                <input className="form-input" value={form.slug} onChange={f('slug')} placeholder="phong-thuy-nha-o" />
              </div>
              <div className="form-group">
                <label className="form-label">Tên Icon (Lucide icon name)</label>
                <input className="form-input" value={form.icon_name} onChange={f('icon_name')} placeholder="Home, Map, Compass..." />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Mô Tả Ngắn</label>
                <textarea className="form-textarea" value={form.description} onChange={f('description')} rows={2} />
              </div>
              <div className="form-group">
                <label className="form-label">Giá Từ (VNĐ)</label>
                <input className="form-input" type="number" value={form.price_from} onChange={f('price_from')} />
              </div>
              <div className="form-group">
                <label className="form-label">Giá Đến (VNĐ)</label>
                <input className="form-input" type="number" value={form.price_to} onChange={f('price_to')} />
              </div>
              <div className="form-group">
                <label className="form-label">Thời Lượng</label>
                <input className="form-input" value={form.duration} onChange={f('duration')} placeholder="60 - 90 phút" />
              </div>
              <div className="form-group">
                <label className="form-label">Thứ Tự</label>
                <input className="form-input" type="number" value={form.sort_order} onChange={f('sort_order')} />
              </div>

              <div className="form-group">
                <label className="form-label">Tính Năng (Mỗi dòng một ý)</label>
                <textarea className="form-textarea" value={form.features} onChange={f('features')} rows={4} />
              </div>
              <div className="form-group">
                <label className="form-label">Đầu Ra/Kết Quả (Mỗi dòng một ý)</label>
                <textarea className="form-textarea" value={form.deliverables} onChange={f('deliverables')} rows={4} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <ImagePicker
                  label="Hình Ảnh Đại Diện"
                  value={form.image_url}
                  type="services"
                  onChange={url => setForm(v => ({ ...v, image_url: url }))}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={form.is_active} onChange={f('is_active')} /> Hiển thị
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={f('is_featured')} /> Nổi bật
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu...' : (editItem ? 'Cập Nhật' : 'Tạo Mới')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
