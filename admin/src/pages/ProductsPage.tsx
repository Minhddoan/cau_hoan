import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Package } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ImagePicker } from '../components/ImagePicker';

const EMPTY_FORM = {
  category_id: '', slug: '', name: '', description: '',
  price: '', original_price: '', image_url: '', badge: '', badge_color: '',
  is_active: true, is_featured: false, sort_order: 0
};

export function ProductsPage() {
  const { hasRole } = useAuth();
  const [products, setProducts]     = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState<any>(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const limit = 15;

  const load = async () => {
    setLoading(true);
    const res = await api.get('/admin/products', { params: { page, limit, search: search || undefined } });
    setProducts(res.data.data);
    setTotal(res.data.total);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, search]);
  useEffect(() => {
    api.get('/product-categories').then(r => setCategories(r.data.data));
  }, []);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit   = (p: any) => {
    setEditItem(p);
    setForm({
      category_id: p.category_id || '', slug: p.slug, name: p.name, description: p.description || '',
      price: p.price, original_price: p.original_price || '', image_url: p.image_url || '',
      badge: p.badge || '', badge_color: p.badge_color || '',
      is_active: p.is_active, is_featured: p.is_featured, sort_order: p.sort_order
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.price) {
      toast.error('Vui lòng điền đủ tên, slug và giá');
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/admin/products/${editItem.id}`, form);
        toast.success('Cập nhật thành công');
      } else {
        await api.post('/admin/products', form);
        toast.success('Tạo sản phẩm thành công');
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
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Đã xóa sản phẩm');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi');
    }
  };

  const pages = Math.ceil(total / limit);
  const f = (k: string) => (e: any) => setForm(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sản Phẩm</h1>
          <p className="page-subtitle">Quản lý vật phẩm phong thủy ({total} sản phẩm)</p>
        </div>
        {hasRole('editor') && (
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={15} /> Thêm Sản Phẩm
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex-between mb-4" style={{ gap: '0.75rem' }}>
        <div className="search-bar">
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { setSearch(''); setPage(1); }}><X size={13} /></button>}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hình</th>
                <th>Tên Sản Phẩm</th>
                <th>Danh Mục</th>
                <th>Giá</th>
                <th>Đánh Giá</th>
                <th>Badge</th>
                <th>Trạng Thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Không có sản phẩm nào</td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="thumb" />
                      : <div className="thumb flex-center" style={{ background: 'var(--bg-hover)' }}><Package size={18} style={{ color: 'var(--text-muted)' }} /></div>
                    }
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{p.slug}</div>
                  </td>
                  <td><span className="badge badge-gray">{p.category_name || '—'}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--gold)' }}>{Number(p.price).toLocaleString('vi-VN')}đ</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>⭐ {p.rating} ({p.review_count})</td>
                  <td>{p.badge ? <span className="badge badge-gold">{p.badge}</span> : '—'}</td>
                  <td>
                    <span className={`badge ${p.is_active ? 'badge-green' : 'badge-red'}`}>
                      {p.is_active ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {hasRole('editor') && (
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}><Pencil size={12} /></button>
                      )}
                      {hasRole('admin') && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.name)}><Trash2 size={12} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editItem ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Tên Sản Phẩm *</label>
                <input className="form-input" value={form.name} onChange={f('name')} placeholder="Tỳ Hưu Vàng 24K..." />
              </div>
              <div className="form-group">
                <label className="form-label">Slug *</label>
                <input className="form-input" value={form.slug} onChange={f('slug')} placeholder="ty-huu-vang" />
              </div>
              <div className="form-group">
                <label className="form-label">Danh Mục</label>
                <select className="form-select" value={form.category_id} onChange={f('category_id')}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Mô Tả</label>
                <textarea className="form-textarea" value={form.description} onChange={f('description')} rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Giá (VNĐ) *</label>
                <input className="form-input" type="number" value={form.price} onChange={f('price')} placeholder="3200000" />
              </div>
              <div className="form-group">
                <label className="form-label">Giá Gốc (optional)</label>
                <input className="form-input" type="number" value={form.original_price} onChange={f('original_price')} placeholder="4000000" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <ImagePicker
                  label="Hình Ảnh Sản Phẩm"
                  value={form.image_url}
                  onChange={url => setForm(v => ({ ...v, image_url: url }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Badge</label>
                <input className="form-input" value={form.badge} onChange={f('badge')} placeholder="Bán Chạy" />
              </div>
              <div className="form-group">
                <label className="form-label">Badge Color</label>
                <input className="form-input" value={form.badge_color} onChange={f('badge_color')} placeholder="bg-red-600" />
              </div>
              <div className="form-group">
                <label className="form-label">Số Thứ Tự</label>
                <input className="form-input" type="number" value={form.sort_order} onChange={f('sort_order')} />
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={form.is_active} onChange={f('is_active')} />
                  Hiển thị
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={f('is_featured')} />
                  Nổi bật
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
