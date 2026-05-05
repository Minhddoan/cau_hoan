import { useEffect, useState } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Save, Settings, Image as ImageIcon } from 'lucide-react';
import { MultiImagePicker } from '../components/MultiImagePicker';

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
        { key: 'contact_phone',   label: 'Số Điện Thoại (Mỗi số 1 dòng)', type: 'textarea' },
        { key: 'contact_email',   label: 'Email (Mỗi email 1 dòng)',      type: 'textarea' },
        { key: 'contact_address', label: 'Địa Chỉ (Mỗi địa chỉ 1 dòng)',  type: 'textarea' },
      ]
    },
    {
      title: 'Mạng Xã Hội',
      fields: [
        { key: 'facebook_url', label: 'Facebook URL (Mỗi link 1 dòng)', type: 'textarea' },
        { key: 'youtube_url',  label: 'YouTube URL (Mỗi link 1 dòng)',  type: 'textarea' },
        { key: 'zalo_link',    label: 'Link Zalo (Mỗi link 1 dòng)',    type: 'textarea' },
        { key: 'tiktok_url',   label: 'TikTok URL (Mỗi link 1 dòng)',   type: 'textarea' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.25rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sections.map(section => (
            <div className="card" key={section.title} style={{ marginBottom: 0 }}>
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
                    ) : field.type === 'textarea' ? (
                      <textarea className="form-input" value={settings[field.key] || ''} onChange={f(field.key)} rows={3} style={{ resize: 'vertical' }} placeholder="Mỗi giá trị 1 dòng..." />
                    ) : (
                      <input className="form-input" type={field.type} value={settings[field.key] || ''} onChange={f(field.key)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0 0.5rem' }}>
            <ImageIcon size={15} style={{ color: 'var(--gold)' }} />
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>Quản Lý Hình Ảnh Giao Diện</h3>
          </div>
          
          <MultiImagePicker 
            category="logo_website" 
            label="Logo Website" 
            description="Thường dùng 1 ảnh PNG trong suốt" 
          />
          
          <MultiImagePicker 
            category="home_main_slider" 
            label="Banner Chính (Trang Chủ)" 
            description="Tự động thành Slider nếu có > 1 ảnh" 
          />

          <MultiImagePicker 
            category="about_company_gallery" 
            label="Ảnh Công Ty (Giới Thiệu)" 
            description="Hoạt động, văn phòng công ty" 
          />

          <MultiImagePicker 
            category="about_master_slider" 
            label="Ảnh Thầy Song Vũ" 
            description="Các hình ảnh về Thầy Song Vũ" 
          />
        </div>
      </div>
    </div>
  );
}
