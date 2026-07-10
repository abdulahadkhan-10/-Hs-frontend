import React, { useState, useEffect } from 'react';
import { School, Mail, Lock, ArrowRight, AlertTriangle, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';

interface LoginProps {
  onLoginSuccess: (username: string, role: string) => void;
}

export default function SchoolLogin({ onLoginSuccess }: LoginProps) {
  const dispatch = useDispatch();
  const [login, { isLoading, error, data }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data) {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      onLoginSuccess(data.user.profile?.schoolName || data.user.email.split('@')[0], 'school');
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

        .sch-login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #fafaf8;
        }

        /* LEFT */
        .sch-login-left {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 3rem 2rem; background: #fff; position: relative;
        }

        .sch-back {
          position: absolute; top: 1.5rem; left: 1.5rem;
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #64748b;
          cursor: pointer; background: none; border: none;
          padding: 6px 10px; border-radius: 6px;
          transition: background 0.15s, color 0.15s; text-decoration: none;
        }
        .sch-back:hover { background: #f1f5f9; color: #1a3566; }

        .sch-card { width: 100%; max-width: 420px; }

        .sch-brand {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; margin-bottom: 2rem;
        }
        .sch-brand-mark {
          width: 48px; height: 48px; border-radius: 12px;
          background: #1a3566; display: flex; align-items: center;
          justify-content: center; margin-bottom: 4px;
        }
        .sch-brand-name { font-size: 22px; font-weight: 700; color: #111; letter-spacing: 0.06em; }
        .sch-brand-sub  { font-size: 12px; color: #64748b; letter-spacing: 0.04em; }

        .sch-heading { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 4px; text-align: center; }
        .sch-sub { font-size: 13.5px; color: #64748b; text-align: center; margin-bottom: 1.75rem; }

        .sch-error {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 8px;
          font-size: 13px; color: #b91c1c; margin-bottom: 1rem;
        }

        .sch-form { display: flex; flex-direction: column; gap: 1rem; }
        .sch-field { display: flex; flex-direction: column; gap: 6px; }
        .sch-label-row { display: flex; align-items: center; justify-content: space-between; }
        .sch-label { font-size: 13px; font-weight: 500; color: #374151; }
        .sch-forgot { font-size: 12px; color: #1a3566; text-decoration: none; font-weight: 500; }
        .sch-forgot:hover { text-decoration: underline; }

        .sch-input-wrap { position: relative; display: flex; align-items: center; }
        .sch-input-icon { position: absolute; left: 12px; color: #94a3b8; pointer-events: none; }
        .sch-input {
          width: 100%; padding: 11px 40px 11px 38px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-size: 14px; color: #111; background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s; outline: none; font-family: inherit;
        }
        .sch-input:focus { border-color: #1a3566; box-shadow: 0 0 0 3px rgba(26,53,102,0.08); }
        .sch-input::placeholder { color: #94a3b8; }
        .sch-input:disabled { background: #f8fafc; cursor: not-allowed; }

        .sch-eye-btn {
          position: absolute; right: 10px; background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center; padding: 4px; transition: color 0.15s;
        }
        .sch-eye-btn:hover { color: #475569; }

        .sch-submit-btn {
          width: 100%; padding: 12px;
          background: #1a3566; color: #fff; border: none; border-radius: 9px;
          font-size: 14.5px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: inherit; transition: background 0.15s, transform 0.1s; margin-top: 4px;
        }
        .sch-submit-btn:hover:not(:disabled) { background: #122450; transform: translateY(-1px); }
        .sch-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @keyframes sch-spin { to { transform: rotate(360deg); } }
        .sch-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%; animation: sch-spin 0.7s linear infinite;
        }

        .sch-register-link {
          text-align: center; margin-top: 1.5rem; font-size: 13.5px; color: #64748b;
        }
        .sch-register-link a {
          color: #1a3566; font-weight: 600; text-decoration: none; margin-left: 4px;
        }
        .sch-register-link a:hover { text-decoration: underline; }

        /* RIGHT */
        .sch-login-right {
          flex: 1; background: linear-gradient(145deg, #1a3566 0%, #0d1f45 60%, #0a1530 100%);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: 3rem 2.5rem; position: relative; overflow: hidden;
        }
        @media (max-width: 768px) { .sch-login-right { display: none; } }

        .sch-right-blob-1 {
          position: absolute; width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(100,140,220,0.12) 0%, transparent 70%);
          top: -80px; right: -80px; pointer-events: none;
        }
        .sch-right-blob-2 {
          position: absolute; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(212,201,154,0.08) 0%, transparent 70%);
          bottom: -60px; left: -60px; pointer-events: none;
        }

        .sch-right-content { position: relative; z-index: 1; max-width: 420px; text-align: center; }

        .sch-right-img-wrap {
          border-radius: 16px; overflow: hidden; margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.07);
        }
        .sch-right-img { width: 100%; height: 260px; object-fit: cover; display: block; }

        .sch-right-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 5px 14px; font-size: 11px;
          color: #93b4e8; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1.25rem;
        }

        .sch-right-quote {
          font-size: 16px; color: #dce8f8; line-height: 1.75; font-style: italic; margin-bottom: 1.25rem;
        }
        .sch-right-quote::before { content: '\\201C'; font-size: 22px; color: #d4c99a; margin-right: 2px; }
        .sch-right-quote::after  { content: '\\201D'; font-size: 22px; color: #d4c99a; margin-left: 2px; }

        .sch-right-attr { font-size: 12px; color: #6a8ac8; }
        .sch-right-attr strong { color: #b0c8e8; font-weight: 600; }

      `}</style>

      <div className="sch-login-page">
        {/* LEFT */}
        <div className="sch-login-left">
          <button className="sch-back" onClick={goBack}>
            <ChevronLeft size={16} /> Back to home
          </button>

          <div className="sch-card">
            <div className="sch-brand">
              <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'contain', marginBottom: '8px' }} />
              <span className="sch-brand-name">ILMEE</span>
              <span className="sch-brand-sub">LSA Portal</span>
            </div>

            <h2 className="sch-heading">School Login</h2>
            <p className="sch-sub">Access your school dashboard and manage tuitions</p>

            {error && (
              <div className="sch-error">
                <AlertTriangle size={15} />
                <span>{(error as any)?.data?.error || 'Invalid credentials. Please try again.'}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="sch-form">
              <div className="sch-field">
                <label className="sch-label">Email address</label>
                <div className="sch-input-wrap">
                  <Mail size={15} className="sch-input-icon" />
                  <input
                    type="email"
                    className="sch-input"
                    placeholder="admin@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="sch-field">
                <div className="sch-label-row">
                  <label className="sch-label">Password</label>
                  <a
                    href="/forgot-password"
                    className="sch-forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, '', '/forgot-password');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="sch-input-wrap">
                  <Lock size={15} className="sch-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="sch-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="sch-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="sch-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><div className="sch-spinner" /> Signing in…</>
                ) : (
                  <>Sign in <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <div className="sch-register-link">
              Don't have a school account? 
              <a href="/register-school" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/register-school'); window.dispatchEvent(new PopStateEvent('popstate')); }}>
                Register here
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sch-login-right">
          <div className="sch-right-blob-1" />
          <div className="sch-right-blob-2" />
          <div className="sch-right-content">
            <div className="sch-right-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=700"
                alt="School Admin"
                className="sch-right-img"
              />
            </div>

            <div className="sch-right-badge">
              <School size={11} /> School Administration
            </div>

            <p className="sch-right-quote">
              Manage teachers, track student progress, and monitor all safeguarding aspects seamlessly.
            </p>
            <p className="sch-right-attr">
              <strong>ILMEE LSA Portal</strong> · For Institutions
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
