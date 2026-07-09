import React, { useState } from 'react';
import { GraduationCap, User, Lock, ArrowRight, AlertTriangle, Eye, EyeOff, ChevronLeft } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string, role: string) => void;
}

export default function StudentLogin({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (username.trim() && password.length >= 4) {
        onLoginSuccess(username, 'student');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }, 800);
  };

  const goBack = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .stu-login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #fafaf8;
        }

        /* LEFT */
        .stu-login-left {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 3rem 2rem; background: #fff; position: relative;
        }

        .stu-back {
          position: absolute; top: 1.5rem; left: 1.5rem;
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #64748b;
          cursor: pointer; background: none; border: none;
          padding: 6px 10px; border-radius: 6px;
          transition: background 0.15s, color 0.15s; text-decoration: none;
        }
        .stu-back:hover { background: #f1f5f9; color: #0284c7; }

        .stu-card { width: 100%; max-width: 420px; }

        .stu-brand {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; margin-bottom: 2rem;
        }
        .stu-brand-mark {
          width: 48px; height: 48px; border-radius: 12px;
          background: #0284c7; display: flex; align-items: center;
          justify-content: center; margin-bottom: 4px;
        }
        .stu-brand-name { font-size: 22px; font-weight: 700; color: #111; letter-spacing: 0.06em; }
        .stu-brand-sub  { font-size: 12px; color: #64748b; letter-spacing: 0.04em; }

        .stu-heading { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 4px; text-align: center; }
        .stu-sub { font-size: 13.5px; color: #64748b; text-align: center; margin-bottom: 1.75rem; }

        .stu-error {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 8px;
          font-size: 13px; color: #b91c1c; margin-bottom: 1rem;
        }

        .stu-form { display: flex; flex-direction: column; gap: 1rem; }
        .stu-field { display: flex; flex-direction: column; gap: 6px; }
        .stu-label-row { display: flex; align-items: center; justify-content: space-between; }
        .stu-label { font-size: 13px; font-weight: 500; color: #374151; }
        .stu-forgot { font-size: 12px; color: #0284c7; text-decoration: none; font-weight: 500; }
        .stu-forgot:hover { text-decoration: underline; }

        .stu-input-wrap { position: relative; display: flex; align-items: center; }
        .stu-input-icon { position: absolute; left: 12px; color: #94a3b8; pointer-events: none; }
        .stu-input {
          width: 100%; padding: 11px 40px 11px 38px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-size: 14px; color: #111; background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s; outline: none; font-family: inherit;
        }
        .stu-input:focus { border-color: #0284c7; box-shadow: 0 0 0 3px rgba(2,132,199,0.08); }
        .stu-input::placeholder { color: #94a3b8; }
        .stu-input:disabled { background: #f8fafc; cursor: not-allowed; }

        .stu-eye-btn {
          position: absolute; right: 10px; background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center; padding: 4px; transition: color 0.15s;
        }
        .stu-eye-btn:hover { color: #475569; }

        .stu-submit-btn {
          width: 100%; padding: 12px;
          background: #0284c7; color: #fff; border: none; border-radius: 9px;
          font-size: 14.5px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: inherit; transition: background 0.15s, transform 0.1s; margin-top: 4px;
        }
        .stu-submit-btn:hover:not(:disabled) { background: #0369a1; transform: translateY(-1px); }
        .stu-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @keyframes stu-spin { to { transform: rotate(360deg); } }
        .stu-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%; animation: stu-spin 0.7s linear infinite;
        }

        /* RIGHT */
        .stu-login-right {
          flex: 1; background: linear-gradient(145deg, #0284c7 0%, #0369a1 60%, #075985 100%);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: 3rem 2.5rem; position: relative; overflow: hidden;
        }
        @media (max-width: 768px) { .stu-login-right { display: none; } }

        .stu-right-blob-1 {
          position: absolute; width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          top: -80px; right: -80px; pointer-events: none;
        }
        .stu-right-blob-2 {
          position: absolute; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          bottom: -60px; left: -60px; pointer-events: none;
        }

        .stu-right-content { position: relative; z-index: 1; max-width: 420px; text-align: center; }

        .stu-right-img-wrap {
          border-radius: 16px; overflow: hidden; margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15);
        }
        .stu-right-img { width: 100%; height: 260px; object-fit: cover; display: block; }

        .stu-right-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px; padding: 5px 14px; font-size: 11px;
          color: #fff; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1.25rem;
        }

        .stu-right-quote {
          font-size: 16px; color: #e0f2fe; line-height: 1.75; font-style: italic; margin-bottom: 1.25rem;
        }
        .stu-right-quote::before { content: '\\201C'; font-size: 22px; color: #bae6fd; margin-right: 2px; }
        .stu-right-quote::after  { content: '\\201D'; font-size: 22px; color: #bae6fd; margin-left: 2px; }

        .stu-right-attr { font-size: 12px; color: #7dd3fc; }
        .stu-right-attr strong { color: #fff; font-weight: 600; }

      `}</style>

      <div className="stu-login-page">
        {/* LEFT */}
        <div className="stu-login-left">
          <button className="stu-back" onClick={goBack}>
            <ChevronLeft size={16} /> Back to home
          </button>

          <div className="stu-card">
            <div className="stu-brand">
              <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'contain', marginBottom: '8px' }} />
              <span className="stu-brand-name">ILMEE</span>
              <span className="stu-brand-sub">LSA Portal</span>
            </div>

            <h2 className="stu-heading">Student Login</h2>
            <p className="stu-sub">Access your classes, sessions, and materials</p>

            {error && (
              <div className="stu-error">
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="stu-form">
              <div className="stu-field">
                <label className="stu-label">Username</label>
                <div className="stu-input-wrap">
                  <User size={15} className="stu-input-icon" />
                  <input
                    type="text"
                    className="stu-input"
                    placeholder="student-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="stu-field">
                <div className="stu-label-row">
                  <label className="stu-label">Password</label>
                  <a href="#forgot" className="stu-forgot">Forgot password?</a>
                </div>
                <div className="stu-input-wrap">
                  <Lock size={15} className="stu-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="stu-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="stu-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="stu-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><div className="stu-spinner" /> Signing in…</>
                ) : (
                  <>Sign in <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="stu-login-right">
          <div className="stu-right-blob-1" />
          <div className="stu-right-blob-2" />
          <div className="stu-right-content">
            <div className="stu-right-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=700"
                alt="Student"
                className="stu-right-img"
              />
            </div>

            <div className="stu-right-badge">
              <GraduationCap size={11} /> Learner Portal
            </div>

            <p className="stu-right-quote">
              Join live classes, submit homework, and collaborate with your teachers.
            </p>
            <p className="stu-right-attr">
              <strong>ILMEE Platform</strong> · For Students
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
