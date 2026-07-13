import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, ArrowRight, AlertTriangle, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';

interface LoginProps {
  onLoginSuccess: (username: string, role: string) => void;
}

export default function TeacherLogin({ onLoginSuccess }: LoginProps) {
  const dispatch = useDispatch();
  const [login, { isLoading, error, data }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({ user: data.user }));
      onLoginSuccess(data.user.profile?.name || data.user.email.split('@')[0], 'teacher');
    }
  }, [data, onLoginSuccess, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
    } catch (err: any) {
      // Errors handled by RTK Query state
    }
  };

  const goBack = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .tch-login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #fafaf8;
        }

        /* LEFT */
        .tch-login-left {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 3rem 2rem; background: #fff; position: relative;
        }

        .tch-back {
          position: absolute; top: 1.5rem; left: 1.5rem;
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #64748b;
          cursor: pointer; background: none; border: none;
          padding: 6px 10px; border-radius: 6px;
          transition: background 0.15s, color 0.15s; text-decoration: none;
        }
        .tch-back:hover { background: #f1f5f9; color: #c06d48; }

        .tch-card { width: 100%; max-width: 420px; }

        .tch-brand {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; margin-bottom: 2rem;
        }
        .tch-brand-mark {
          width: 48px; height: 48px; border-radius: 12px;
          background: #c06d48; display: flex; align-items: center;
          justify-content: center; margin-bottom: 4px;
        }
        .tch-brand-name { font-size: 22px; font-weight: 700; color: #111; letter-spacing: 0.06em; }
        .tch-brand-sub  { font-size: 12px; color: #64748b; letter-spacing: 0.04em; }

        .tch-heading { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 4px; text-align: center; }
        .tch-sub { font-size: 13.5px; color: #64748b; text-align: center; margin-bottom: 1.75rem; }

        .tch-error {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 8px;
          font-size: 13px; color: #b91c1c; margin-bottom: 1rem;
        }

        .tch-form { display: flex; flex-direction: column; gap: 1rem; }
        .tch-field { display: flex; flex-direction: column; gap: 6px; }
        .tch-label-row { display: flex; align-items: center; justify-content: space-between; }
        .tch-label { font-size: 13px; font-weight: 500; color: #374151; }
        .tch-forgot { font-size: 12px; color: #c06d48; text-decoration: none; font-weight: 500; }
        .tch-forgot:hover { text-decoration: underline; }

        .tch-input-wrap { position: relative; display: flex; align-items: center; }
        .tch-input-icon { position: absolute; left: 12px; color: #94a3b8; pointer-events: none; }
        .tch-input {
          width: 100%; padding: 11px 40px 11px 38px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-size: 14px; color: #111; background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s; outline: none; font-family: inherit;
        }
        .tch-input:focus { border-color: #c06d48; box-shadow: 0 0 0 3px rgba(192,109,72,0.08); }
        .tch-input::placeholder { color: #94a3b8; }
        .tch-input:disabled { background: #f8fafc; cursor: not-allowed; }

        .tch-eye-btn {
          position: absolute; right: 10px; background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center; padding: 4px; transition: color 0.15s;
        }
        .tch-eye-btn:hover { color: #475569; }

        .tch-submit-btn {
          width: 100%; padding: 12px;
          background: #c06d48; color: #fff; border: none; border-radius: 9px;
          font-size: 14.5px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: inherit; transition: background 0.15s, transform 0.1s; margin-top: 4px;
        }
        .tch-submit-btn:hover:not(:disabled) { background: #a65b39; transform: translateY(-1px); }
        .tch-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @keyframes tch-spin { to { transform: rotate(360deg); } }
        .tch-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%; animation: tch-spin 0.7s linear infinite;
        }

        /* RIGHT */
        .tch-login-right {
          flex: 1; background: linear-gradient(145deg, #c06d48 0%, #a65b39 60%, #8c4a2c 100%);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: 3rem 2.5rem; position: relative; overflow: hidden;
        }
        @media (max-width: 768px) { .tch-login-right { display: none; } }

        .tch-right-blob-1 {
          position: absolute; width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          top: -80px; right: -80px; pointer-events: none;
        }
        .tch-right-blob-2 {
          position: absolute; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          bottom: -60px; left: -60px; pointer-events: none;
        }

        .tch-right-content { position: relative; z-index: 1; max-width: 420px; text-align: center; }

        .tch-right-img-wrap {
          border-radius: 16px; overflow: hidden; margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15);
        }
        .tch-right-img { width: 100%; height: 260px; object-fit: cover; display: block; }

        .tch-right-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px; padding: 5px 14px; font-size: 11px;
          color: #fff; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1.25rem;
        }

        .tch-right-quote {
          font-size: 16px; color: #fdf5f2; line-height: 1.75; font-style: italic; margin-bottom: 1.25rem;
        }
        .tch-right-quote::before { content: '\\201C'; font-size: 22px; color: #ffebd2; margin-right: 2px; }
        .tch-right-quote::after  { content: '\\201D'; font-size: 22px; color: #ffebd2; margin-left: 2px; }

        .tch-right-attr { font-size: 12px; color: #ffd8c4; }
        .tch-right-attr strong { color: #fff; font-weight: 600; }

      `}</style>

      <div className="tch-login-page">
        {/* LEFT */}
        <div className="tch-login-left">
          <button className="tch-back" onClick={goBack}>
            <ChevronLeft size={16} /> Back to home
          </button>

          <div className="tch-card">
            <div className="tch-brand">
              <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'contain', marginBottom: '8px' }} />
              <span className="tch-brand-sub">LSA Portal</span>
            </div>

            <h2 className="tch-heading">Teacher Login</h2>
            <p className="tch-sub">Access your classes, sessions, and students</p>

            {error && (
              <div className="tch-error">
                <AlertTriangle size={15} />
                <span>{(error as any)?.data?.error || 'Invalid credentials. Please try again.'}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="tch-form">
              <div className="tch-field">
                <label className="tch-label">Email address</label>
                <div className="tch-input-wrap">
                  <Mail size={15} className="tch-input-icon" />
                  <input
                    type="email"
                    className="tch-input"
                    placeholder="teacher@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="tch-field">
                <div className="tch-label-row">
                  <label className="tch-label">Password</label>
                  <a
                    href="/forgot-password"
                    className="tch-forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, '', '/forgot-password');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="tch-input-wrap">
                  <Lock size={15} className="tch-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="tch-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="tch-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="tch-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><div className="tch-spinner" /> Signing in…</>
                ) : (
                  <>Sign in <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="tch-login-right">
          <div className="tch-right-blob-1" />
          <div className="tch-right-blob-2" />
          <div className="tch-right-content">
            <div className="tch-right-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&q=80&w=700"
                alt="Teacher"
                className="tch-right-img"
              />
            </div>

            <div className="tch-right-badge">
              <User size={11} /> Educator Portal
            </div>

            <p className="tch-right-quote">
              The LSA platform makes tracking student progress and setting assignments effortless.
            </p>
            <p className="tch-right-attr">
              <strong>Sarah Jenkins</strong> · Mathematics Tutor
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
