import React, { useState } from 'react';
import { Shield, Mail, Lock, ArrowRight, AlertTriangle, Eye, EyeOff, ChevronLeft } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string, role: string) => void;
}

export default function GuardLogin({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
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
      if (email.trim() && password.length >= 6) {
        onLoginSuccess(email.split('@')[0], 'guard');
      } else {
        setError('Invalid credentials. Please check your Guard ID and password.');
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

        .gd-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', system-ui, sans-serif;
          background: linear-gradient(135deg, #f7f5ef 0%, #fcfbf9 50%, #f3f0e8 100%);
          padding: 2rem;
          position: relative;
        }

        .gd-bg-blob-1 {
          position: fixed; top: -120px; right: -120px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(80,110,77,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .gd-bg-blob-2 {
          position: fixed; bottom: -100px; left: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(80,110,77,0.06) 0%, transparent 65%);
          pointer-events: none;
        }

        .gd-back {
          position: fixed;
          top: 1.5rem; left: 1.5rem;
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #5a6557;
          cursor: pointer; background: #fff;
          border: 1px solid #dfdacd; padding: 7px 12px;
          border-radius: 8px; transition: all 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .gd-back:hover { border-color: #506e4d; color: #415a3e; }

        .gd-card {
          background: #fff;
          border-radius: 20px;
          padding: 2.75rem 2.5rem;
          width: 100%; max-width: 420px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(0,0,0,0.08);
          border: 1px solid #f0ede4;
          position: relative;
          z-index: 1;
        }

        .gd-card-top-bar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 4px; background: linear-gradient(90deg, #506e4d, #728c6f);
          border-radius: 20px 20px 0 0;
        }

        .gd-brand {
          display: flex; flex-direction: column;
          align-items: center; gap: 6px; margin-bottom: 2rem;
        }
        .gd-brand-mark {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #506e4d, #728c6f);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
          box-shadow: 0 4px 14px rgba(80,110,77,0.25);
        }
        .gd-brand-name { font-size: 22px; font-weight: 700; color: #2b352a; letter-spacing: 0.06em; }
        .gd-brand-sub  { font-size: 12px; color: #5a6557; letter-spacing: 0.04em; }

        .gd-heading { font-size: 19px; font-weight: 700; color: #2b352a; text-align: center; margin-bottom: 4px; }
        .gd-sub { font-size: 13px; color: #5a6557; text-align: center; margin-bottom: 1.75rem; line-height: 1.55; }

        .gd-notice {
          display: flex; align-items: center; gap: 8px;
          background: #f0ede4; border: 1px solid #dfdacd; border-radius: 8px;
          padding: 10px 14px; font-size: 12.5px; color: #3b4539;
          margin-bottom: 1.25rem;
        }
        .gd-notice svg { color: #506e4d; flex-shrink: 0; }

        .gd-error {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 8px;
          font-size: 13px; color: #b91c1c; margin-bottom: 1rem;
        }

        .gd-form { display: flex; flex-direction: column; gap: 1rem; }
        .gd-field { display: flex; flex-direction: column; gap: 6px; }
        .gd-label { font-size: 13px; font-weight: 500; color: #3b4539; }
        .gd-input-wrap { position: relative; display: flex; align-items: center; }
        .gd-input-icon { position: absolute; left: 12px; color: #7b8878; pointer-events: none; }
        .gd-input {
          width: 100%; padding: 11px 40px 11px 38px;
          border: 1.5px solid #dfdacd; border-radius: 9px;
          font-size: 14px; color: #2b352a; background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none; font-family: inherit;
        }
        .gd-input:focus { border-color: #506e4d; box-shadow: 0 0 0 3px rgba(80,110,77,0.1); }
        .gd-input::placeholder { color: #7b8878; }
        .gd-input:disabled { background: #fcfbf9; cursor: not-allowed; }
        .gd-eye-btn {
          position: absolute; right: 10px;
          background: none; border: none; cursor: pointer;
          color: #7b8878; display: flex; align-items: center; padding: 4px;
          transition: color 0.15s;
        }
        .gd-eye-btn:hover { color: #5a6557; }

        .gd-submit-btn {
          width: 100%; padding: 12px;
          background: linear-gradient(135deg, #506e4d, #728c6f);
          color: #fff; border: none; border-radius: 9px;
          font-size: 14.5px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 8px; font-family: inherit;
          transition: opacity 0.15s, transform 0.1s;
          margin-top: 4px;
          box-shadow: 0 4px 14px rgba(80,110,77,0.3);
        }
        .gd-submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .gd-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        @keyframes gd-spin { to { transform: rotate(360deg); } }
        .gd-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: gd-spin 0.7s linear infinite;
        }
      `}</style>

      <div className="gd-login-page">
        <div className="gd-bg-blob-1" />
        <div className="gd-bg-blob-2" />

        <button className="gd-back" onClick={goBack}>
          <ChevronLeft size={15} /> Back to home
        </button>

        <div className="gd-card">
          <div className="gd-card-top-bar" />

          <div className="gd-brand">
            <div className="gd-brand-mark">
              <Shield size={26} color="#fff" />
            </div>
            <span className="gd-brand-name">ILMEE</span>
            <span className="gd-brand-sub">Guard / Security Portal</span>
          </div>

          <h2 className="gd-heading">Secure Access</h2>
          <p className="gd-sub">Enter your credentials to access the security dashboard.</p>

          <div className="gd-notice">
            <Shield size={13} />
            This is a restricted portal for authorised security staff only.
          </div>

          {error && (
            <div className="gd-error">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="gd-form">
            <div className="gd-field">
              <label className="gd-label">Guard ID / Email</label>
              <div className="gd-input-wrap">
                <Mail size={15} className="gd-input-icon" />
                <input
                  type="text"
                  className="gd-input"
                  placeholder="guard@ilmee.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="gd-field">
              <label className="gd-label">Password</label>
              <div className="gd-input-wrap">
                <Lock size={15} className="gd-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="gd-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="gd-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="gd-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <><div className="gd-spinner" /> Authenticating…</>
              ) : (
                <>Secure Login <ArrowRight size={15} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
