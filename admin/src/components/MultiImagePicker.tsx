import { useRef, useState, useEffect } from 'react';
import { Upload, X, Loader2, Plus, Edit2, Save } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface MediaItem {
  id: number;
  title: string;
  title_accent?: string;
  subtitle?: string;
  badge?: string;
  image_url: string;
  category: string;
  sort_order: number;
}

interface MultiImagePickerProps {
  category: string;
  label: string;
  description?: string;
}

export function MultiImagePicker({ category, label, description }: MultiImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<MediaItem>>({});

  useEffect(() => {
    fetchImages();
  }, [category]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/images/${category}`);
      if (res.data.success) {
        setImages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('category', category);
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const res = await api.post('/admin/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success(`Đã tải lên ${res.data.data.length} ảnh`);
        setImages([...images, ...res.data.data]);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload thất bại');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    try {
      const res = await api.delete(`/admin/images/${id}`);
      if (res.data.success) {
        setImages(images.filter(img => img.id !== id));
        toast.success('Đã xóa ảnh');
      }
    } catch (err) {
      toast.error('Xóa thất bại');
    }
  };

  const startEditing = (img: MediaItem) => {
    setEditingId(img.id);
    setEditForm({
      title: img.title || '',
      title_accent: img.title_accent || '',
      subtitle: img.subtitle || '',
      badge: img.badge || ''
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const res = await api.put(`/admin/images/${editingId}`, editForm);
      if (res.data.success) {
        setImages(images.map(img => img.id === editingId ? res.data.data : img));
        setEditingId(null);
        toast.success('Đã cập nhật thông tin');
      }
    } catch (err) {
      toast.error('Cập nhật thất bại');
    }
  };

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{label}</h3>
          {description && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>{description}</p>}
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Tải ảnh lên
        </button>
        <input 
          ref={inputRef}
          type="file" 
          multiple 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleUpload}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader2 className="animate-spin text-gold" />
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '0.75rem' 
        }}>
          {images.map((img) => (
            <div key={img.id} style={{ 
              position: 'relative', 
              borderRadius: '0.5rem', 
              overflow: 'hidden', 
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={img.image_url.startsWith('http') ? img.image_url : `${(import.meta as any).env.VITE_UPLOADS_URL || 'http://localhost:4000/uploads'}/${img.image_url}`} 
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => startEditing(img)}
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)', border: 'none', cursor: 'pointer',
                      width: 24, height: 24, borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    style={{
                      background: 'rgba(255, 0, 0, 0.8)', border: 'none', cursor: 'pointer',
                      width: 24, height: 24, borderRadius: '4px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>

              {editingId === img.id ? (
                <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <input 
                    className="form-input" 
                    placeholder="Tiêu đề" 
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    value={editForm.title} 
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                  />
                  <input 
                    className="form-input" 
                    placeholder="Accent (đỏ)" 
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    value={editForm.title_accent} 
                    onChange={e => setEditForm({...editForm, title_accent: e.target.value})}
                  />
                  <input 
                    className="form-input" 
                    placeholder="Mô tả phụ" 
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    value={editForm.subtitle} 
                    onChange={e => setEditForm({...editForm, subtitle: e.target.value})}
                  />
                  <input 
                    className="form-input" 
                    placeholder="Badge (ví dụ: HOT)" 
                    style={{ fontSize: '0.7rem', padding: '0.25rem' }}
                    value={editForm.badge} 
                    onChange={e => setEditForm({...editForm, badge: e.target.value})}
                  />
                  <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.7rem', padding: '0.25rem' }} onClick={handleUpdate}>
                    <Save size={10} /> Lưu
                  </button>
                </div>
              ) : (
                <div style={{ padding: '0.5rem', fontSize: '0.7rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--gold)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {img.title || 'Không có tiêu đề'}
                  </div>
                  {img.subtitle && <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{img.subtitle}</div>}
                </div>
              )}
            </div>
          ))}
          {images.length === 0 && (
            <div style={{ 
              gridColumn: '1 / -1', 
              padding: '2rem', 
              textAlign: 'center', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '0.5rem',
              border: '1px dashed var(--border)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem'
            }}>
              Chưa có hình ảnh nào trong danh mục này
            </div>
          )}
        </div>
      )}
      
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
