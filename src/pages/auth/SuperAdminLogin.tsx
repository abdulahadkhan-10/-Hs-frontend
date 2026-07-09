import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string, role: string) => void;
}

export default function SuperAdminLogin({ onLoginSuccess }: LoginProps) {
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
      if (email.trim() && password.length >= 8) {
        onLoginSuccess(email.split('@')[0], 'superadmin');
      } else {
        setError('Invalid admin credentials. Access denied.');
      }
    }, 800);
  };



  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .sa-login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #f7f5ef;
        }

        /* LEFT */
        .sa-login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2rem;
          background: #fff;
          position: relative;
          border-right: 1px solid #dfdacd;
        }

        .sa-back {
          position: absolute; top: 1.5rem; left: 1.5rem;
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #5a6557;
          cursor: pointer; background: #fff;
          border: 1px solid #dfdacd;
          padding: 7px 12px; border-radius: 8px;
          transition: all 0.15s;
          text-decoration: none;
        }
        .sa-back:hover { background: #f0ede4; color: #506e4d; border-color: #506e4d; }

        .sa-card { width: 100%; max-width: 420px; }

        .sa-brand {
          display: flex; flex-direction: column;
          align-items: center; gap: 6px; margin-bottom: 2rem;
        }
        .sa-brand-mark {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #506e4d, #728c6f);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
          box-shadow: 0 4px 20px rgba(80,110,77,0.25);
        }
        .sa-brand-name { font-size: 22px; font-weight: 700; color: #2b352a; letter-spacing: 0.06em; }
        .sa-brand-sub  { font-size: 12px; color: #5a6557; letter-spacing: 0.04em; }

        .sa-heading { font-size: 19px; font-weight: 700; color: #2b352a; text-align: center; margin-bottom: 4px; }
        .sa-sub { font-size: 13px; color: #5a6557; text-align: center; margin-bottom: 1.75rem; line-height: 1.55; }

        .sa-warning {
          display: flex; align-items: center; gap: 8px;
          background: #f0ede4; border: 1px solid #dfdacd; border-radius: 8px;
          padding: 10px 14px; font-size: 12.5px; color: #3b4539;
          margin-bottom: 1.25rem;
        }
        .sa-warning svg { color: #c06d48; flex-shrink: 0; }

        .sa-error {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 8px;
          font-size: 13px; color: #b91c1c; margin-bottom: 1rem;
        }

        .sa-form { display: flex; flex-direction: column; gap: 1rem; }
        .sa-field { display: flex; flex-direction: column; gap: 6px; }
        .sa-label { font-size: 13px; font-weight: 500; color: #3b4539; }
        .sa-input-wrap { position: relative; display: flex; align-items: center; }
        .sa-input-icon { position: absolute; left: 12px; color: #7b8878; pointer-events: none; }
        .sa-input {
          width: 100%; padding: 11px 40px 11px 38px;
          border: 1.5px solid #dfdacd; border-radius: 9px;
          font-size: 14px; color: #2b352a; background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none; font-family: inherit;
        }
        .sa-input:focus { border-color: #506e4d; box-shadow: 0 0 0 3px rgba(80,110,77,0.1); }
        .sa-input::placeholder { color: #7b8878; }
        .sa-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .sa-eye-btn {
          position: absolute; right: 10px;
          background: none; border: none; cursor: pointer;
          color: #7b8878; display: flex; align-items: center; padding: 4px;
          transition: color 0.15s;
        }
        .sa-eye-btn:hover { color: #5a6557; }

        .sa-submit-btn {
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
        .sa-submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .sa-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        @keyframes sa-spin { to { transform: rotate(360deg); } }
        .sa-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: sa-spin 0.7s linear infinite;
        }

        /* RIGHT */
        .sa-login-right {
          flex: 1;
          background: linear-gradient(145deg, #506e4d 0%, #2b352a 60%, #1c241b 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) { .sa-login-right { display: none; } }

        .sa-right-blob-1 {
          position: absolute; width: 500px; height: 500px;
          top: -150px; right: -150px; border-radius: 50%;
          background: radial-gradient(circle, rgba(114,140,111,0.15) 0%, transparent 65%);
          pointer-events: none;
        }
        .sa-right-blob-2 {
          position: absolute; width: 350px; height: 350px;
          bottom: -100px; left: -100px; border-radius: 50%;
          background: radial-gradient(circle, rgba(223,218,205,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .sa-right-content { position: relative; z-index: 1; max-width: 400px; text-align: center; }

        .sa-right-icon-ring {
          width: 100px; height: 100px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
          background: rgba(255,255,255,0.05);
        }
        .sa-right-icon-inner {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
        }

        .sa-right-title { font-size: 20px; font-weight: 700; color: #f0ede4; margin-bottom: 0.6rem; letter-spacing: -0.01em; }
        .sa-right-desc { font-size: 13.5px; color: #c3ccbf; line-height: 1.7; margin-bottom: 2rem; }

        .sa-right-checks { display: flex; flex-direction: column; gap: 10px; text-align: left; }
        .sa-right-check {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px; padding: 10px 14px;
        }
        .sa-right-check-dot { width: 6px; height: 6px; border-radius: 50%; background: #c06d48; flex-shrink: 0; }
        .sa-right-check span { font-size: 12.5px; color: #c3ccbf; }
      `}</style>

      <div className="sa-login-page">

        {/* LEFT */}
        <div className="sa-login-left">
         

          <div className="sa-card">
            <div className="sa-brand">
              <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'contain', marginBottom: '8px' }} />
              <span className="sa-brand-name">ILMEE</span>
              <span className="sa-brand-sub">Super Admin Portal</span>
            </div>

            <h2 className="sa-heading">Administrator Access</h2>
            <p className="sa-sub">Restricted access. Authorised personnel only.</p>

            <div className="sa-warning">
              <ShieldCheck size={13} />
              All login attempts are logged and monitored.
            </div>

            {error && (
              <div className="sa-error">
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="sa-form">
              <div className="sa-field">
                <label className="sa-label">Admin ID / Email</label>
                <div className="sa-input-wrap">
                  <Mail size={15} className="sa-input-icon" />
                  <input
                    type="text"
                    className="sa-input"
                    placeholder="admin@ilmee.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="sa-field">
                <label className="sa-label">Password</label>
                <div className="sa-input-wrap">
                  <Lock size={15} className="sa-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="sa-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="sa-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="sa-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><div className="sa-spinner" /> Authenticating…</>
                ) : (
                  <>Secure Login <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sa-login-right">
          <div className="sa-right-blob-1" />
          <div className="sa-right-blob-2" />
          <div className="sa-right-content">
            <div className="sa-right-icon-ring">
              <div className="sa-right-icon-inner">
                <ShieldCheck size={32} color="#dc2626" />
              </div>
            </div>

            <h3 className="sa-right-title">Platform Administration</h3>
            <p className="sa-right-desc">
              Full platform control for authorised ILMEE administrators.
              Manage users, portals, and system-wide configurations.
            </p>

            <div className="sa-right-checks">
              {[
                'Full user management across all portals',
                'System-wide configuration controls',
                'Audit logs and access monitoring',
                'Safeguarding escalation oversight',
              ].map((item) => (
                <div key={item} className="sa-right-check">
                  <div className="sa-right-check-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
