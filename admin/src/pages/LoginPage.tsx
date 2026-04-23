import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage() {
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('admin@songvu.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');

  if (user) { navigate('/dashboard'); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      toast.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, var(--bg) 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 1rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37, #8B6914)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', fontSize: '1.75rem'
          }}>⛩</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.05em' }}>
            SONG VŨ ADMIN
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Phong Thủy Song Vũ — Hệ Thống Quản Trị
          </p>
        </div>

        <div className="card" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="admin@songvu.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mật Khẩu</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem' }}
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Chỉ dành cho nhân viên được ủy quyền
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          Phong Thủy Song Vũ Admin Panel v1.0
        </div>
      </div>
    </div>
  );
}
