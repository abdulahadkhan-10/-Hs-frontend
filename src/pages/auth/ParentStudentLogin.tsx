import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertTriangle, User, GraduationCap, Eye, EyeOff, BookOpen, ChevronLeft } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string, role: string) => void;
}

export default function ParentStudentLogin({ onLoginSuccess }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'parent' | 'student'>('parent');
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
      if (email.trim() && password.length >= 4) {
        onLoginSuccess(email.split('@')[0], activeTab);
      } else {
        setError('Please enter a valid email and a password of at least 4 characters.');
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

        .hs-login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #f7f5ef;
        }

        /* LEFT PANEL */
        .hs-login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2rem;
          background: #fff;
          position: relative;
        }

        .hs-login-back {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #5a6557;
          cursor: pointer;
          background: none;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .hs-login-back:hover { background: #f0ede4; color: #506e4d; }

        .hs-login-card { width: 100%; max-width: 420px; }

        /* Brand */
        .hs-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 2rem;
        }
        .hs-brand-mark {
          width: 48px;
          height: 48px;
          background: #506e4d;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .hs-brand-name { font-size: 22px; font-weight: 700; color: #2b352a; letter-spacing: 0.06em; }
        .hs-brand-sub  { font-size: 12px; color: #5a6557; letter-spacing: 0.04em; }

        /* Heading */
        .hs-login-heading { font-size: 20px; font-weight: 700; color: #2b352a; margin-bottom: 4px; text-align: center; }
        .hs-login-sub { font-size: 13.5px; color: #5a6557; text-align: center; margin-bottom: 1.75rem; }

        /* Tabs */
        .hs-tabs {
          display: flex;
          background: #f0ede4;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 1.5rem;
          gap: 4px;
        }
        .hs-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px;
          border-radius: 7px;
          border: none;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          background: transparent;
          color: #5a6557;
          font-family: inherit;
        }
        .hs-tab.active {
          background: #fff;
          color: #506e4d;
          font-weight: 600;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .hs-tab:hover:not(.active) { color: #2b352a; }

        /* Error */
        .hs-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 13px;
          color: #b91c1c;
          margin-bottom: 1rem;
        }

        /* Form */
        .hs-form { display: flex; flex-direction: column; gap: 1rem; }
        .hs-field { display: flex; flex-direction: column; gap: 6px; }
        .hs-label { font-size: 13px; font-weight: 500; color: #3b4539; }
        .hs-label-row { display: flex; align-items: center; justify-content: space-between; }
        .hs-forgot { font-size: 12px; color: #506e4d; text-decoration: none; font-weight: 500; }
        .hs-forgot:hover { text-decoration: underline; }

        .hs-input-wrap { position: relative; display: flex; align-items: center; }
        .hs-input-icon { position: absolute; left: 12px; color: #7b8878; pointer-events: none; }
        .hs-input {
          width: 100%;
          padding: 11px 40px 11px 38px;
          border: 1.5px solid #dfdacd;
          border-radius: 9px;
          font-size: 14px;
          color: #2b352a;
          background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
          font-family: inherit;
        }
        .hs-input:focus { border-color: #506e4d; box-shadow: 0 0 0 3px rgba(80,110,77,0.1); }
        .hs-input::placeholder { color: #7b8878; }
        .hs-input:disabled { background: #fcfbf9; cursor: not-allowed; }

        .hs-eye-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #7b8878;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.15s;
        }
        .hs-eye-btn:hover { color: #5a6557; }

        /* Submit */
        .hs-submit-btn {
          width: 100%;
          padding: 12px;
          background: #506e4d;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          transition: background 0.15s, transform 0.1s;
          margin-top: 4px;
        }
        .hs-submit-btn:hover:not(:disabled) { background: #415a3e; transform: translateY(-1px); }
        .hs-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @keyframes hs-spin { to { transform: rotate(360deg); } }
        .hs-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: hs-spin 0.7s linear infinite;
        }

        /* Register link */
        .hs-register-row {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 13.5px;
          color: #5a6557;
        }
        .hs-register-row a { color: #506e4d; font-weight: 600; text-decoration: none; }
        .hs-register-row a:hover { text-decoration: underline; }

        /* RIGHT PANEL */
        .hs-login-right {
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
        @media (max-width: 768px) { .hs-login-right { display: none; } }

        .hs-right-blob-1 {
          position: absolute;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(114,140,111,0.15) 0%, transparent 70%);
          top: -80px; right: -80px;
          pointer-events: none;
        }
        .hs-right-blob-2 {
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(223,218,205,0.08) 0%, transparent 70%);
          bottom: -60px; left: -60px;
          pointer-events: none;
        }

        .hs-right-content { position: relative; z-index: 1; max-width: 420px; text-align: center; }

        .hs-right-img-wrap {
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .hs-right-img { width: 100%; height: 260px; object-fit: cover; display: block; }

        .hs-right-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 11px;
          color: #f0ede4;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .hs-right-badge svg { color: #c06d48; }

        .hs-right-quote {
          font-size: 16px;
          color: #f0ede4;
          line-height: 1.75;
          font-style: italic;
          margin-bottom: 1.25rem;
        }
        .hs-right-quote::before { content: '\\201C'; font-size: 22px; color: #c06d48; margin-right: 2px; }
        .hs-right-quote::after  { content: '\\201D'; font-size: 22px; color: #c06d48; margin-left: 2px; }

        .hs-right-attr { font-size: 12px; color: #8fa08c; }
        .hs-right-attr strong { color: #f0ede4; font-weight: 600; }

        .hs-right-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 1.75rem;
          text-align: left;
        }
        .hs-right-feat {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 10px 14px;
        }
        .hs-right-feat-dot { width: 6px; height: 6px; border-radius: 50%; background: #c06d48; flex-shrink: 0; }
        .hs-right-feat span { font-size: 12.5px; color: #c3ccbf; }
      `}</style>

      <div className="hs-login-page">

        {/* LEFT */}
        <div className="hs-login-left">
          <button className="hs-login-back" onClick={goBack}>
            <ChevronLeft size={16} /> Back to home
          </button>

          <div className="hs-login-card">
            <div className="hs-brand">
              <div className="hs-brand-mark">
                <BookOpen size={24} color="#fff" />
              </div>
              <span className="hs-brand-name">ILMEE</span>
              <span className="hs-brand-sub">Homeschooling Portal</span>
            </div>

            <h2 className="hs-login-heading">Welcome back</h2>
            <p className="hs-login-sub">Select your role and sign in to continue</p>

            {/* Tabs */}
            <div className="hs-tabs">
              <button
                type="button"
                className={`hs-tab${activeTab === 'parent' ? ' active' : ''}`}
                onClick={() => setActiveTab('parent')}
              >
                <User size={15} /> Parent
              </button>
              <button
                type="button"
                className={`hs-tab${activeTab === 'student' ? ' active' : ''}`}
                onClick={() => setActiveTab('student')}
              >
                <GraduationCap size={15} /> Student
              </button>
            </div>

            {error && (
              <div className="hs-error">
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="hs-form">
              <div className="hs-field">
                <label className="hs-label">
                  {activeTab === 'parent' ? 'Email address' : 'Username'}
                </label>
                <div className="hs-input-wrap">
                  <Mail size={15} className="hs-input-icon" />
                  <input
                    type="text"
                    className="hs-input"
                    placeholder={activeTab === 'parent' ? 'parent@example.com' : 'student-username'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="hs-field">
                <div className="hs-label-row">
                  <label className="hs-label">Password</label>
                  <a href="#forgot" className="hs-forgot">Forgot password?</a>
                </div>
                <div className="hs-input-wrap">
                  <Lock size={15} className="hs-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="hs-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="hs-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="hs-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><div className="hs-spinner" /> Signing in…</>
                ) : (
                  <>Sign in as {activeTab === 'parent' ? 'Parent' : 'Student'} <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <div className="hs-register-row">
              Don't have an account? <a href="/register-hs">Register here</a>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hs-login-right">
          <div className="hs-right-blob-1" />
          <div className="hs-right-blob-2" />
          <div className="hs-right-content">
            <div className="hs-right-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=700"
                alt="Parent teaching child"
                className="hs-right-img"
              />
            </div>

            <div className="hs-right-badge">
              <BookOpen size={11} /> Homeschooling Portal
            </div>

            <p className="hs-right-quote">
              ILMEE has completely transformed how I manage my child's daily schedule, assignments, and wellbeing check-ins.
            </p>
            <p className="hs-right-attr">
              <strong>Emma Johnson</strong> · Parent Educator
            </p>

            <div className="hs-right-features">
              {[
                'Interactive parent & student dashboards',
                'Comprehensive safeguarding overview',
                'Custom lesson plans & progress metrics',
                'Secure messaging & wellbeing check-ins',
              ].map((f) => (
                <div key={f} className="hs-right-feat">
                  <div className="hs-right-feat-dot" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}