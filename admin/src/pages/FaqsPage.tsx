import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EMPTY = { category_id: '', question: '', answer: '', sort_order: 0, is_active: true };

export function FaqsPage() {
  const { hasRole } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [cats, setCats]   = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState<any>(null);
  const [form, setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await api.get('/admin/faqs'); setItems(res.data.data);
  };
  useEffect(() => {
    load();
    api.get('/faq-categories').then(r => setCats(r.data.data));
  }, []);

  const open = (item?: any) => {
    setEditItem(item || null);
    setForm(item ? { ...item } : EMPTY);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.question || !form.answer) { toast.error('Thiếu câu hỏi hoặc câu trả lời'); return; }
    setSaving(true);
    try {
      if (editItem) { await api.put(`/admin/faqs/${editItem.id}`, form); toast.success('Cập nhật thành công'); }
      else { await api.post('/admin/faqs', form); toast.success('Thêm FAQ thành công'); }
      setShowModal(false); load();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Lỗi'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('Xóa câu hỏi này?')) return;
    await api.delete(`/admin/faqs/${id}`); toast.success('Đã xóa'); load();
  };

  const f = (k: string) => (e: any) => setForm(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  // Group by category
  const grouped: Record<string, { name: string, items: any[] }> = {};
  items.forEach(item => {
    const key = item.category_id || 'other';
    if (!grouped[key]) grouped[key] = { name: item.category_name || 'Chưa phân loại', items: [] };
    grouped[key].items.push(item);
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hỏi Đáp (FAQ)</h1>
          <p className="page-subtitle">{items.length} câu hỏi & đáp</p>
        </div>
        {hasRole('editor') && <button className="btn btn-primary" onClick={() => open()}><Plus size={15} /> Thêm FAQ</button>}
      </div>

      {Object.values(grouped).map(group => (
        <div className="card" key={group.name} style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--gold)' }}>{group.name}</h3>
          {group.items.map(item => (
            <div key={item.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: 4 }}>Q: {item.question}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.answer}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                <span className={`badge ${item.is_active ? 'badge-green' : 'badge-red'}`}>{item.is_active ? 'Hiện' : 'Ẩn'}</span>
                {hasRole('editor') && <button className="btn btn-secondary btn-sm" onClick={() => open(item)}><Pencil size={12} /></button>}
                {hasRole('admin') && <button className="btn btn-danger btn-sm" onClick={() => del(item.id)}><Trash2 size={12} /></button>}
              </div>
            </div>
          ))}
        </div>
      ))}

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal" style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editItem ? 'Sửa FAQ' : 'Thêm FAQ'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Danh Mục</label>
              <select className="form-select" value={form.category_id} onChange={f('category_id')}>
                <option value="">-- Chọn danh mục --</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Câu Hỏi *</label>
              <textarea className="form-textarea" rows={2} value={form.question} onChange={f('question')} placeholder="Làm thế nào để biết nhà mình có phong thủy tốt?" />
            </div>
            <div className="form-group">
              <label className="form-label">Câu Trả Lời *</label>
              <textarea className="form-textarea" rows={5} value={form.answer} onChange={f('answer')} placeholder="Câu trả lời chi tiết..." />
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="form-group" style={{ width: 120, marginBottom: 0 }}>
                <label className="form-label">Thứ Tự</label>
                <input className="form-input" type="number" value={form.sort_order} onChange={f('sort_order')} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                <input type="checkbox" checked={form.is_active} onChange={f('is_active')} /> Hiển thị
              </label>
            </div>
            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : editItem ? 'Cập Nhật' : 'Thêm FAQ'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
