import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Shield, UserCheck, UserX, Key } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ROLE_STYLES: Record<string, string> = {
  super_admin: 'badge-gold', admin: 'badge-blue', editor: 'badge-green', viewer: 'badge-gray'
};

const EMPTY_FORM = { email: '', full_name: '', password: '', role_id: '', is_active: true };

export function UsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers]       = useState<any[]>([]);
  const [roles, setRoles]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm]     = useState({ userId: 0, password: '' });

  const load = async () => {
    setLoading(true);
    const [usersRes, rolesRes] = await Promise.all([api.get('/admin/users'), api.get('/admin/roles')]);
    setUsers(usersRes.data.data);
    setRoles(rolesRes.data.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit   = (u: any) => {
    setEditItem(u);
    setForm({ email: u.email, full_name: u.full_name, password: '', role_id: u.role_id, is_active: u.is_active });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.email || !form.role_id) { toast.error('Thiếu email hoặc role'); return; }
    if (!editItem && !form.password) { toast.error('Vui lòng nhập mật khẩu'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/admin/users/${editItem.id}`, { email: form.email, full_name: form.full_name, role_id: form.role_id, is_active: form.is_active });
        toast.success('Cập nhật thành công');
      } else {
        await api.post('/admin/users', form);
        toast.success('Tạo tài khoản thành công');
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (u: any) => {
    if (u.id === me?.id) { toast.error('Không thể vô hiệu hóa chính mình'); return; }
    await api.put(`/admin/users/${u.id}`, { is_active: !u.is_active });
    toast.success(u.is_active ? 'Đã vô hiệu hóa' : 'Đã kích hoạt');
    load();
  };

  const handleResetPw = async () => {
    if (!pwForm.password || pwForm.password.length < 8) { toast.error('Mật khẩu phải ít nhất 8 ký tự'); return; }
    await api.put(`/admin/users/${pwForm.userId}/password`, { new_password: pwForm.password });
    toast.success('Đặt lại mật khẩu thành công');
    setShowPwModal(false);
    setPwForm({ userId: 0, password: '' });
  };

  const f = (k: string) => (e: any) => setForm(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Người Dùng & Phân Quyền</h1>
          <p className="page-subtitle">Quản lý tài khoản và vai trò ({users.length} người dùng)</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> Thêm Người Dùng</button>
      </div>

      {/* Roles info */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Shield size={15} style={{ color: 'var(--gold)' }} />
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700 }}>Phân Cấp Quyền Hạn</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {[
            { name: 'super_admin', display: 'Super Admin', desc: 'Toàn quyền hệ thống, quản lý users', style: 'badge-gold' },
            { name: 'admin',       display: 'Admin',       desc: 'Quản lý nội dung, cài đặt, xóa dữ liệu', style: 'badge-blue' },
            { name: 'editor',      display: 'Editor',      desc: 'Tạo và sửa nội dung', style: 'badge-green' },
            { name: 'viewer',      display: 'Viewer',      desc: 'Chỉ xem, không chỉnh sửa', style: 'badge-gray' },
          ].map(r => (
            <div key={r.name} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '0.625rem' }}>
              <span className={`badge ${r.style}`} style={{ marginBottom: 4 }}>{r.display}</span>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Người Dùng</th>
                <th>Email</th>
                <th>Vai Trò</th>
                <th>Trạng Thái</th>
                <th>Đăng Nhập Cuối</th>
                <th>Ngày Tạo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--gold), #8B6914)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontWeight: 700, color: '#000', flexShrink: 0
                      }}>
                        {u.full_name?.split(' ').slice(-2).map((s: string) => s[0]).join('') || 'U'}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{u.full_name || '—'}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td><span className={`badge ${ROLE_STYLES[u.role_name] || 'badge-gray'}`}>{u.role_display}</span></td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>
                      {u.is_active ? 'Hoạt động' : 'Vô hiệu'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {u.last_login ? new Date(u.last_login).toLocaleString('vi-VN') : 'Chưa đăng nhập'}
                  </td>
                  <td style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {new Date(u.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)} title="Sửa"><Pencil size={12} /></button>
                      <button
                        className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={() => handleToggleActive(u)}
                        disabled={u.id === me?.id}
                        title={u.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        {u.is_active ? <UserX size={12} /> : <UserCheck size={12} />}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setPwForm({ userId: u.id, password: '' }); setShowPwModal(true); }}
                        title="Đặt lại mật khẩu"
                      >
                        <Key size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editItem ? 'Sửa Người Dùng' : 'Thêm Người Dùng'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <div className="form-group">
              <label className="form-label">Họ & Tên</label>
              <input className="form-input" value={form.full_name} onChange={f('full_name')} placeholder="Nguyễn Văn A" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={f('email')} placeholder="user@songvu.com" />
            </div>
            {!editItem && (
              <div className="form-group">
                <label className="form-label">Mật Khẩu *</label>
                <input className="form-input" type="password" value={form.password} onChange={f('password')} placeholder="Ít nhất 8 ký tự" />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Vai Trò *</label>
              <select className="form-select" value={form.role_id} onChange={f('role_id')}>
                <option value="">-- Chọn vai trò --</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.display_name} ({r.name})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                <input type="checkbox" checked={form.is_active} onChange={f('is_active')} />
                Tài khoản hoạt động
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu...' : (editItem ? 'Cập Nhật' : 'Tạo Tài Khoản')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPwModal && (
        <div className="modal-overlay" onClick={() => setShowPwModal(false)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Đặt Lại Mật Khẩu</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPwModal(false)}><X size={18} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Mật Khẩu Mới (≥ 8 ký tự)</label>
              <input className="form-input" type="password" value={pwForm.password} onChange={e => setPwForm(v => ({ ...v, password: e.target.value }))} placeholder="••••••••" />
            </div>
            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowPwModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleResetPw}>Đặt Lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
