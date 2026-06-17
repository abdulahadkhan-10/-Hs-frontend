import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertTriangle, User, GraduationCap, Eye, EyeOff, BookOpen, ChevronLeft } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string, role: string) => void;
}

export default function TeacherStudentLogin({ onLoginSuccess }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');
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

        .tn-login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #fafaf8;
        }

        /* LEFT PANEL */
        .tn-login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2rem;
          background: #fff;
          position: relative;
        }

        .tn-login-back {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          cursor: pointer;
          background: none;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .tn-login-back:hover { background: #f1f5f9; color: #1a3566; }

        .tn-login-card { width: 100%; max-width: 420px; }

        /* Brand */
        .tn-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 2rem;
        }
        .tn-brand-mark {
          width: 48px;
          height: 48px;
          background: #1a3566;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .tn-brand-name { font-size: 22px; font-weight: 700; color: #111; letter-spacing: 0.06em; }
        .tn-brand-sub  { font-size: 12px; color: #64748b; letter-spacing: 0.04em; }

        /* Heading */
        .tn-login-heading { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 4px; text-align: center; }
        .tn-login-sub { font-size: 13.5px; color: #64748b; text-align: center; margin-bottom: 1.75rem; }

        /* Tabs */
        .tn-tabs {
          display: flex;
          background: #f1f5f9;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 1.5rem;
          gap: 4px;
        }
        .tn-tab {
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
          color: #64748b;
          font-family: inherit;
        }
        .tn-tab.active {
          background: #fff;
          color: #1a3566;
          font-weight: 600;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        .tn-tab:hover:not(.active) { color: #334155; }

        /* Error */
        .tn-error {
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
        .tn-form { display: flex; flex-direction: column; gap: 1rem; }
        .tn-field { display: flex; flex-direction: column; gap: 6px; }
        .tn-label { font-size: 13px; font-weight: 500; color: #374151; }
        .tn-label-row { display: flex; align-items: center; justify-content: space-between; }
        .tn-forgot { font-size: 12px; color: #1a3566; text-decoration: none; font-weight: 500; }
        .tn-forgot:hover { text-decoration: underline; }

        .tn-input-wrap { position: relative; display: flex; align-items: center; }
        .tn-input-icon { position: absolute; left: 12px; color: #94a3b8; pointer-events: none; }
        .tn-input {
          width: 100%;
          padding: 11px 40px 11px 38px;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          font-size: 14px;
          color: #111;
          background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
          font-family: inherit;
        }
        .tn-input:focus { border-color: #1a3566; box-shadow: 0 0 0 3px rgba(26,53,102,0.08); }
        .tn-input::placeholder { color: #94a3b8; }
        .tn-input:disabled { background: #f8fafc; cursor: not-allowed; }

        .tn-eye-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.15s;
        }
        .tn-eye-btn:hover { color: #475569; }

        /* Submit */
        .tn-submit-btn {
          width: 100%;
          padding: 12px;
          background: #1a3566;
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
        .tn-submit-btn:hover:not(:disabled) { background: #122450; transform: translateY(-1px); }
        .tn-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @keyframes tn-spin { to { transform: rotate(360deg); } }
        .tn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: tn-spin 0.7s linear infinite;
        }

        /* RIGHT PANEL */
        .tn-login-right {
          flex: 1;
          background: linear-gradient(145deg, #1a3566 0%, #0d1f45 60%, #0a1530 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) { .tn-login-right { display: none; } }

        .tn-right-blob-1 {
          position: absolute;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(100,140,220,0.12) 0%, transparent 70%);
          top: -80px; right: -80px;
          pointer-events: none;
        }
        .tn-right-blob-2 {
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(212,201,154,0.08) 0%, transparent 70%);
          bottom: -60px; left: -60px;
          pointer-events: none;
        }

        .tn-right-content { position: relative; z-index: 1; max-width: 420px; text-align: center; }

        .tn-right-img-wrap {
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .tn-right-img { width: 100%; height: 260px; object-fit: cover; display: block; }

        .tn-right-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 11px;
          color: #93b4e8;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .tn-right-badge svg { color: #6a9ad4; }

        .tn-right-quote {
          font-size: 16px;
          color: #dce8f8;
          line-height: 1.75;
          font-style: italic;
          margin-bottom: 1.25rem;
        }
        .tn-right-quote::before { content: '\\201C'; font-size: 22px; color: #d4c99a; margin-right: 2px; }
        .tn-right-quote::after  { content: '\\201D'; font-size: 22px; color: #d4c99a; margin-left: 2px; }

        .tn-right-attr { font-size: 12px; color: #6a8ac8; }
        .tn-right-attr strong { color: #b0c8e8; font-weight: 600; }

        .tn-right-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 1.75rem;
          text-align: left;
        }
        .tn-right-feat {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 10px 14px;
        }
        .tn-right-feat-dot { width: 6px; height: 6px; border-radius: 50%; background: #6a9ad4; flex-shrink: 0; }
        .tn-right-feat span { font-size: 12.5px; color: #a0bcd8; }
      `}</style>

      <div className="tn-login-page">

        {/* LEFT */}
        <div className="tn-login-left">
          <button className="tn-login-back" onClick={goBack}>
            <ChevronLeft size={16} /> Back to home
          </button>

          <div className="tn-login-card">
            <div className="tn-brand">
              <div className="tn-brand-mark">
                <BookOpen size={24} color="#a0bcd8" />
              </div>
              <span className="tn-brand-name">ILMEE</span>
              <span className="tn-brand-sub">Tuition Portal</span>
            </div>

            <h2 className="tn-login-heading">Welcome back</h2>
            <p className="tn-login-sub">Select your role and sign in to continue</p>

            {/* Tabs */}
            <div className="tn-tabs">
              <button
                type="button"
                className={`tn-tab${activeTab === 'teacher' ? ' active' : ''}`}
                onClick={() => setActiveTab('teacher')}
              >
                <User size={15} /> Teacher
              </button>
              <button
                type="button"
                className={`tn-tab${activeTab === 'student' ? ' active' : ''}`}
                onClick={() => setActiveTab('student')}
              >
                <GraduationCap size={15} /> Student
              </button>
            </div>

            {error && (
              <div className="tn-error">
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="tn-form">
              <div className="tn-field">
                <label className="tn-label">
                  {activeTab === 'teacher' ? 'Email address' : 'Username'}
                </label>
                <div className="tn-input-wrap">
                  <Mail size={15} className="tn-input-icon" />
                  <input
                    type="text"
                    className="tn-input"
                    placeholder={activeTab === 'teacher' ? 'teacher@example.com' : 'student-username'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="tn-field">
                <div className="tn-label-row">
                  <label className="tn-label">Password</label>
                  <a href="#forgot" className="tn-forgot">Forgot password?</a>
                </div>
                <div className="tn-input-wrap">
                  <Lock size={15} className="tn-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="tn-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="tn-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="tn-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><div className="tn-spinner" /> Signing in…</>
                ) : (
                  <>Sign in as {activeTab === 'teacher' ? 'Teacher' : 'Student'} <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="tn-login-right">
          <div className="tn-right-blob-1" />
          <div className="tn-right-blob-2" />
          <div className="tn-right-content">
            <div className="tn-right-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=700"
                alt="Tutor and student"
                className="tn-right-img"
              />
            </div>

            <div className="tn-right-badge">
              <BookOpen size={11} /> Tuition Portal
            </div>

            <p className="tn-right-quote">
              The ILMEE Tuition platform makes tracking student progress and setting assignments effortless.
            </p>
            <p className="tn-right-attr">
              <strong>Sarah Jenkins</strong> · Mathematics Tutor
            </p>

            <div className="tn-right-features">
              {[
                'Teacher & student dashboards',
                'Live virtual session logs',
                'Assignment & homework tracking',
                'Secure parent-tutor messaging',
              ].map((f) => (
                <div key={f} className="tn-right-feat">
                  <div className="tn-right-feat-dot" />
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
