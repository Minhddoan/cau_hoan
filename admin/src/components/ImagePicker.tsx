import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  type?: 'products' | 'services' | 'articles' | 'gallery' | 'avatars' | 'banners' | 'others';
}

export function ImagePicker({ value, onChange, label = 'Hình Ảnh', type = 'others' }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState(value);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local ngay lập tức
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Upload lên server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post(`/admin/upload?type=${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.url;
      onChange(url);
      setPreview(url);
      toast.success('Upload ảnh thành công');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload thất bại');
      setPreview(value); // rollback
    } finally {
      setUploading(false);
      // Reset input để có thể upload lại cùng file
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    setPreview('');
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {/* Preview */}
      {preview && (
        <div style={{ position: 'relative', width: 120, marginBottom: '0.5rem' }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
            onError={() => setPreview('')}
          />
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute', top: -6, right: -6,
              background: 'var(--red)', border: 'none', cursor: 'pointer',
              width: 20, height: 20, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={11} color="#fff" />
          </button>
          {uploading && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Loader2 size={20} color="#D4AF37" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}
        </div>
      )}

      {/* URL input + Upload button */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          className="form-input"
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setPreview(e.target.value); }}
          placeholder="https://... hoặc upload file bên cạnh"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          title="Upload ảnh từ máy tính"
          style={{ flexShrink: 0, gap: '0.375rem' }}
        >
          {uploading
            ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            : <Upload size={14} />
          }
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          style={{ display: 'none' }}
          onChange={handleFile}
        />
      </div>
      <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4 }}>
        Hỗ trợ: JPG, PNG, WEBP, GIF, AVIF — tối đa 5MB
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
