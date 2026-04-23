import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Flame, Zap } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const EMPTY = {
  slug: '', title: '', department: '', job_type: 'fulltime', location: 'Hà Nội',
  salary_range: '', description: '', requirements: '', benefits: '', tags: '',
  is_hot: false, is_urgent: false, is_active: true, deadline: ''
};

const JOB_TYPE_LABELS: Record<string, string> = { fulltime: 'Full-time', parttime: 'Part-time', intern: 'Thực tập' };

export function JobsPage() {
  const { hasRole } = useAuth();
  const [jobs, setJobs]     = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState<any>(null);
  const [form, setForm]   = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await api.get('/admin/jobs'); setJobs(res.data.data);
  };
  useEffect(() => { load(); }, []);

  const open = (item?: any) => {
    setEditItem(item || null);
    setForm(item ? {
      ...item,
      requirements: (item.requirements || []).join('\n'),
      benefits: (item.benefits || []).join('\n'),
      tags: (item.tags || []).join(', '),
      deadline: item.deadline ? item.deadline.split('T')[0] : ''
    } : EMPTY);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.title || !form.slug) { toast.error('Thiếu tiêu đề và slug'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements ? form.requirements.split('\n').filter(Boolean) : [],
        benefits: form.benefits ? form.benefits.split('\n').filter(Boolean) : [],
        tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()) : [],
      };
      if (editItem) { await api.put(`/admin/jobs/${editItem.id}`, payload); toast.success('Cập nhật thành công'); }
      else { await api.post('/admin/jobs', payload); toast.success('Đăng vị trí thành công'); }
      setShowModal(false); load();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Lỗi'); }
    finally { setSaving(false); }
  };

  const del = async (id: number, title: string) => {
    if (!confirm(`Xóa vị trí "${title}"?`)) return;
    await api.delete(`/admin/jobs/${id}`); toast.success('Đã xóa'); load();
  };

  const f = (k: string) => (e: any) => setForm((v: any) => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tuyển Dụng</h1>
          <p className="page-subtitle">{jobs.length} vị trí tuyển dụng</p>
        </div>
        {hasRole('editor') && <button className="btn btn-primary" onClick={() => open()}><Plus size={15} /> Đăng Vị Trí</button>}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Vị Trí</th><th>Phòng Ban</th><th>Loại</th><th>Mức Lương</th><th>Deadline</th><th>Ứng Tuyển</th><th>Trạng Thái</th><th></th></tr></thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      {job.is_hot && <Flame size={13} style={{ color: '#E53E3E' }} />}
                      {job.is_urgent && <Zap size={13} style={{ color: '#ECC94B' }} />}
                      {job.title}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>📍 {job.location}</div>
                  </td>
                  <td style={{ fontSize: '0.75rem' }}>{job.department}</td>
                  <td><span className="badge badge-blue">{JOB_TYPE_LABELS[job.job_type]}</span></td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>{job.salary_range}</td>
                  <td style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td>
                    <span className="badge badge-purple">{job.application_count || 0} đơn</span>
                  </td>
                  <td><span className={`badge ${job.is_active ? 'badge-green' : 'badge-red'}`}>{job.is_active ? 'Đang tuyển' : 'Đã đóng'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {hasRole('editor') && <button className="btn btn-secondary btn-sm" onClick={() => open(job)}><Pencil size={12} /></button>}
                      {hasRole('admin') && <button className="btn btn-danger btn-sm" onClick={() => del(job.id, job.title)}><Trash2 size={12} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editItem ? 'Sửa Vị Trí' : 'Đăng Vị Trí Tuyển Dụng'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Tiêu Đề Vị Trí *</label>
                <input className="form-input" value={form.title} onChange={f('title')} placeholder="Chuyên Viên Tư Vấn Phong Thủy" />
              </div>
              <div className="form-group">
                <label className="form-label">Slug *</label>
                <input className="form-input" value={form.slug} onChange={f('slug')} placeholder="tu-van-phong-thuy" />
              </div>
              <div className="form-group">
                <label className="form-label">Phòng Ban</label>
                <input className="form-input" value={form.department} onChange={f('department')} placeholder="Tư Vấn" />
              </div>
              <div className="form-group">
                <label className="form-label">Loại</label>
                <select className="form-select" value={form.job_type} onChange={f('job_type')}>
                  <option value="fulltime">Full-time</option>
                  <option value="parttime">Part-time</option>
                  <option value="intern">Thực tập</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Địa Điểm</label>
                <input className="form-input" value={form.location} onChange={f('location')} />
              </div>
              <div className="form-group">
                <label className="form-label">Mức Lương</label>
                <input className="form-input" value={form.salary_range} onChange={f('salary_range')} placeholder="15 – 30 triệu/tháng" />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" type="date" value={form.deadline} onChange={f('deadline')} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Mô Tả Công Việc</label>
                <textarea className="form-textarea" rows={3} value={form.description} onChange={f('description')} />
              </div>
              <div className="form-group">
                <label className="form-label">Yêu Cầu (mỗi dòng 1 mục)</label>
                <textarea className="form-textarea" rows={4} value={form.requirements} onChange={f('requirements')} placeholder="Kinh nghiệm 2+ năm&#10;Tốt nghiệp đại học..." />
              </div>
              <div className="form-group">
                <label className="form-label">Quyền Lợi (mỗi dòng 1 mục)</label>
                <textarea className="form-textarea" rows={4} value={form.benefits} onChange={f('benefits')} placeholder="Lương + hoa hồng&#10;BHXH đầy đủ..." />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Tags</label>
                <input className="form-input" value={form.tags} onChange={f('tags')} placeholder="Phong thủy, Tư vấn, Senior" />
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem' }}>
                {[
                  { k: 'is_hot', label: '🔥 Hot' },
                  { k: 'is_urgent', label: '⚡ Urgent' },
                  { k: 'is_active', label: '✅ Đang tuyển' }
                ].map(({ k, label }) => (
                  <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <input type="checkbox" checked={form[k]} onChange={f(k)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : editItem ? 'Cập Nhật' : 'Đăng Tuyển'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
