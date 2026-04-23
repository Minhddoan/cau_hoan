import { useEffect, useState } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Save, Settings } from 'lucide-react';

export function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(res => {
      const flat: Record<string, string> = {};
      res.data.data.forEach((s: any) => { flat[s.key] = s.value || ''; });
      setSettings(flat);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Đã lưu cài đặt');
    } catch { toast.error('Lỗi lưu cài đặt'); }
    finally { setSaving(false); }
  };

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setSettings(v => ({ ...v, [k]: e.target.value }));

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Đang tải...</div>;

  const sections = [
    {
      title: 'Thông Tin Chung',
      fields: [
        { key: 'site_name',    label: 'Tên Website',   type: 'text' },
        { key: 'site_tagline', label: 'Tagline',        type: 'text' },
      ]
    },
    {
      title: 'Liên Hệ',
      fields: [
        { key: 'contact_phone',   label: 'Số Điện Thoại', type: 'text' },
        { key: 'contact_email',   label: 'Email',          type: 'email' },
        { key: 'contact_address', label: 'Địa Chỉ',        type: 'text' },
      ]
    },
    {
      title: 'Mạng Xã Hội',
      fields: [
        { key: 'facebook_url', label: 'Facebook URL', type: 'text' },
        { key: 'youtube_url',  label: 'YouTube URL',  type: 'text' },
        { key: 'zalo_link',    label: 'Link Zalo',    type: 'text' },
      ]
    },
    {
      title: 'Tính Năng',
      fields: [
        { key: 'booking_enabled', label: 'Bật đặt lịch online', type: 'select', options: ['true','false'] },
        { key: 'ai_chat_enabled', label: 'Bật Trợ Lý AI',       type: 'select', options: ['true','false'] },
      ]
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cài Đặt Website</h1>
          <p className="page-subtitle">Thông tin chung và cấu hình hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={15} /> {saving ? 'Đang lưu...' : 'Lưu Cài Đặt'}
        </button>
      </div>

      {sections.map(section => (
        <div className="card" key={section.title} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Settings size={15} style={{ color: 'var(--gold)' }} />
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{section.title}</h3>
          </div>
          <div className="grid-2">
            {section.fields.map(field => (
              <div className="form-group" key={field.key}>
                <label className="form-label">{field.label}</label>
                {field.type === 'select' ? (
                  <select className="form-select" value={settings[field.key] || ''} onChange={f(field.key)}>
                    {field.options?.map(o => <option key={o} value={o}>{o === 'true' ? 'Bật' : 'Tắt'}</option>)}
                  </select>
                ) : (
                  <input className="form-input" type={field.type} value={settings[field.key] || ''} onChange={f(field.key)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
