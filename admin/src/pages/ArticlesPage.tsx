import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Eye } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ImagePicker } from '../components/ImagePicker';

const EMPTY = { category_id: '', title: '', slug: '', excerpt: '', content: '', image_url: '', read_time: '5 phút', is_featured: false, is_published: false, tags: '' };

export function ArticlesPage() {
  const { hasRole } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [cats, setCats]   = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage]   = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState<any>(null);
  const [form, setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const limit = 15;

  const load = async () => {
    setLoading(true);
    const res = await api.get('/admin/articles', { params: { page, limit, search: search || undefined } });
    setItems(res.data.data); setTotal(res.data.total); setLoading(false);
  };
  useEffect(() => { load(); }, [page, search]);
  useEffect(() => { api.get('/article-categories').then(r => setCats(r.data.data)); }, []);

  const open = (item?: any) => {
    setEditItem(item || null);
    setForm(item ? { ...item, tags: (item.tags || []).join(', ') } : EMPTY);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.title || !form.slug) { toast.error('Thiếu tiêu đề và slug'); return; }
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()) : [] };
      if (editItem) { await api.put(`/admin/articles/${editItem.id}`, payload); toast.success('Cập nhật thành công'); }
      else { await api.post('/admin/articles', payload); toast.success('Tạo bài viết thành công'); }
      setShowModal(false); load();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Lỗi'); }
    finally { setSaving(false); }
  };

  const del = async (id: number, name: string) => {
    if (!confirm(`Xóa bài viết "${name}"?`)) return;
    await api.delete(`/admin/articles/${id}`); toast.success('Đã xóa'); load();
  };

  const f = (k: string) => (e: any) => setForm(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const pages = Math.ceil(total / limit);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bài Viết</h1>
          <p className="page-subtitle">Quản lý kiến thức phong thủy ({total} bài viết)</p>
        </div>
        {hasRole('editor') && <button className="btn btn-primary" onClick={() => open()}><Plus size={15} /> Thêm Bài Viết</button>}
      </div>

      <div className="flex-between mb-4">
        <div className="search-bar">
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Tìm bài viết..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Hình</th><th>Tiêu Đề</th><th>Danh Mục</th><th>Lượt Xem</th><th>Trạng Thái</th><th>Ngày Tạo</th><th></th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td>{item.image_url ? <img src={item.image_url} alt="" className="thumb" /> : '—'}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.slug}</div>
                  </td>
                  <td><span className="badge badge-gray">{item.category_name || '—'}</span></td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><Eye size={12} style={{ display: 'inline', marginRight: 3 }} />{item.view_count}</td>
                  <td>
                    <span className={`badge ${item.is_published ? 'badge-green' : 'badge-red'}`}>{item.is_published ? 'Đã đăng' : 'Nháp'}</span>
                    {item.is_featured && <span className="badge badge-gold" style={{ marginLeft: 4 }}>Nổi bật</span>}
                  </td>
                  <td style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {hasRole('editor') && <button className="btn btn-secondary btn-sm" onClick={() => open(item)}><Pencil size={12} /></button>}
                      {hasRole('admin') && <button className="btn btn-danger btn-sm" onClick={() => del(item.id, item.title)}><Trash2 size={12} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && <div className="pagination">{Array.from({ length: pages }, (_, i) => i + 1).map(p => <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>)}</div>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editItem ? 'Sửa Bài Viết' : 'Thêm Bài Viết'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Tiêu Đề *</label>
                <input className="form-input" value={form.title} onChange={f('title')} placeholder="Ngũ Hành trong Phong Thủy..." />
              </div>
              <div className="form-group">
                <label className="form-label">Slug *</label>
                <input className="form-input" value={form.slug} onChange={f('slug')} placeholder="ngu-hanh-trong-phong-thuy" />
              </div>
              <div className="form-group">
                <label className="form-label">Danh Mục</label>
                <select className="form-select" value={form.category_id} onChange={f('category_id')}>
                  <option value="">-- Chọn --</option>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Tóm Tắt</label>
                <textarea className="form-textarea" rows={2} value={form.excerpt} onChange={f('excerpt')} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Nội Dung</label>
                <textarea className="form-textarea" rows={6} value={form.content} onChange={f('content')} placeholder="Nội dung bài viết..." />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <ImagePicker
                  label="Hình Ảnh Bài Viết"
                  value={form.image_url}
                  onChange={url => setForm((v: any) => ({ ...v, image_url: url }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Thời Gian Đọc</label>
                <input className="form-input" value={form.read_time} onChange={f('read_time')} placeholder="8 phút" />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
                <input className="form-input" value={form.tags} onChange={f('tags')} placeholder="Ngũ Hành, Căn Bản, Phong Thủy" />
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', paddingTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={f('is_featured')} /> Nổi bật
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={form.is_published} onChange={f('is_published')} /> Đăng công khai
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : editItem ? 'Cập Nhật' : 'Tạo Bài Viết'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
