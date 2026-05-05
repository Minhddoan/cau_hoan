import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ImagePicker } from '../components/ImagePicker';

const EMPTY_FORM = {
  title: '', description: '', image_url: '', category: 'Kiến Trúc',
  is_active: true, sort_order: 0
};

export function GalleryPage() {
  const { hasRole } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/gallery');
      setItems(res.data.data || []);
    } catch (error) {
      toast.error('Lỗi tải danh sách thư viện ảnh');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      image_url: item.image_url || '',
      category: item.category || 'Kiến Trúc',
      is_active: item.is_active,
      sort_order: item.sort_order || 0
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.image_url) {
      toast.error('Vui lòng upload hoặc điền link hình ảnh');
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/admin/gallery/${editItem.id}`, form);
        toast.success('Cập nhật ảnh thành công');
      } else {
        await api.post('/admin/gallery', form);
        toast.success('Thêm ảnh thành công');
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi server');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Bạn có chắc muốn xóa ảnh này khỏi thư viện?`)) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      toast.success('Đã xóa ảnh');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi xóa ảnh');
    }
  };

  const f = (k: string) => (e: any) => setForm(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  // Xây dựng list category động từ dữ liệu hiện có, cộng thêm vài cái mặc định
  const existingCategories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));
  const categories = Array.from(new Set(['Kiến Trúc', 'Nội Thất', 'Vật Phẩm', ...existingCategories]));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Thư Viện Ảnh</h1>
          <p className="page-subtitle">Quản lý hình ảnh trên toàn hệ thống ({items.length} ảnh)</p>
        </div>
        {hasRole('editor') && (
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={15} /> Thêm Ảnh
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Preview</th>
                <th>Tiêu Đề</th>
                <th>Phân Loại</th>
                <th>Mô Tả</th>
                <th>Thứ Tự</th>
                <th>Trạng Thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Thư viện đang trống</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.image_url ? (
                      <img src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/uploads/${item.image_url}`} alt={item.title} className="thumb" style={{ width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                    ) : (
                      <div className="thumb flex-center" style={{ width: '80px', height: '60px', background: 'var(--bg-hover)' }}><ImageIcon size={18} style={{ color: 'var(--text-muted)' }} /></div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.title || '—'}</td>
                  <td><span className="badge badge-gray">{item.category || '—'}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.description || '—'}
                  </td>
                  <td>{item.sort_order}</td>
                  <td>
                    <span className={`badge ${item.is_active ? 'badge-green' : 'badge-red'}`}>
                      {item.is_active ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {hasRole('editor') && (
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}><Pencil size={12} /></button>
                      )}
                      {hasRole('admin') && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}><Trash2 size={12} /></button>
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
          <div className="modal" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editItem ? 'Sửa Thư Viện Ảnh' : 'Thêm Ảnh Mới'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <div className="grid-1" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <ImagePicker
                  label="Hình Ảnh (Bắt buộc) *"
                  value={form.image_url}
                  type="gallery"
                  onChange={url => setForm(v => ({ ...v, image_url: url }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tiêu Đề (Optional)</label>
                <input className="form-input" value={form.title} onChange={f('title')} placeholder="Nhà gỗ Cổ Đại..." />
              </div>

              <div className="form-group">
                <label className="form-label">Phân Loại</label>
                <input 
                   className="form-input" 
                   value={form.category} 
                   onChange={f('category')} 
                   placeholder="Nhập loại ảnh (vd: Kiến Trúc, Nội Thất...)" 
                   list="category-suggestions"
                />
                <datalist id="category-suggestions">
                   {categories.map(cat => <option key={cat} value={cat} />)}
                </datalist>
              </div>

              <div className="form-group">
                <label className="form-label">Mô Tả (Optional)</label>
                <textarea className="form-textarea" value={form.description} onChange={f('description')} rows={2} />
              </div>

              <div className="grid-2">
                 <div className="form-group">
                   <label className="form-label">Thứ Tự Số</label>
                   <input className="form-input" type="number" value={form.sort_order} onChange={f('sort_order')} />
                 </div>
                 <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1.5rem' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                     <input type="checkbox" checked={form.is_active} onChange={f('is_active')} />
                     Hiển thị
                   </label>
                 </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu...' : (editItem ? 'Cập Nhật' : 'Thêm Ảnh')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
