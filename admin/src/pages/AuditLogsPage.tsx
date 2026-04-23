import { useEffect, useState } from 'react';
import api from '../lib/api';

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'badge-green', UPDATE: 'badge-blue', DELETE: 'badge-red', LOGIN: 'badge-gold', LOGOUT: 'badge-gray'
};

export function AuditLogsPage() {
  const [logs, setLogs]     = useState<any[]>([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [resource, setResource] = useState('');
  const limit = 50;

  const load = async () => {
    setLoading(true);
    const res = await api.get('/admin/audit-logs', {
      params: { page, limit, action: action || undefined, resource_type: resource || undefined }
    });
    setLogs(res.data.data);
    setTotal(res.data.total);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, action, resource]);

  const pages = Math.ceil(total / limit);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Nhật Ký Hoạt Động</h1>
          <p className="page-subtitle">Theo dõi mọi thao tác trong hệ thống ({total} bản ghi)</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <select className="form-select" style={{ width: 'auto' }} value={action} onChange={e => { setAction(e.target.value); setPage(1); }}>
          <option value="">Tất cả hành động</option>
          {['CREATE','UPDATE','DELETE','LOGIN','LOGOUT'].map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={resource} onChange={e => { setResource(e.target.value); setPage(1); }}>
          <option value="">Tất cả loại dữ liệu</option>
          {['product','article','faq','testimonial','booking','job','user','settings'].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Người Dùng</th>
                <th>Hành Động</th>
                <th>Loại Dữ Liệu</th>
                <th>Tên</th>
                <th>IP</th>
                <th>Thời Gian</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Không có bản ghi</td></tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.75rem' }}>
                    <div style={{ fontWeight: 600 }}>{log.full_name || '—'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{log.user_email}</div>
                  </td>
                  <td><span className={`badge ${ACTION_COLORS[log.action] || 'badge-gray'}`}>{log.action}</span></td>
                  <td style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{log.resource_type || '—'}</td>
                  <td style={{ fontSize: '0.72rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.resource_name || '—'}
                  </td>
                  <td style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{log.ip_address || '—'}</td>
                  <td style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {new Date(log.created_at).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: Math.min(pages, 10) }, (_, i) => i + 1).map(p => (
              <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
