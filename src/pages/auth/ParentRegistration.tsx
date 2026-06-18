import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertTriangle, User, Eye, EyeOff, BookOpen, ChevronLeft } from 'lucide-react';

interface RegisterProps {
  onRegisterSuccess: (username: string) => void;
}

export default function ParentRegistration({ onRegisterSuccess }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (!name.trim() || !email.trim() || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      
      onRegisterSuccess(name);
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

        .pr-register-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #f7f5ef;
        }

        /* LEFT PANEL */
        .pr-register-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2rem;
          background: #fff;
          position: relative;
        }

        .pr-register-back {
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
        .pr-register-back:hover { background: #f0ede4; color: #506e4d; }

        .pr-register-card { width: 100%; max-width: 420px; }

        /* Brand */
        .pr-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.5rem;
        }
        .pr-brand-mark {
          width: 48px;
          height: 48px;
          background: #506e4d;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .pr-brand-name { font-size: 22px; font-weight: 700; color: #2b352a; letter-spacing: 0.06em; }
        .pr-brand-sub  { font-size: 12px; color: #5a6557; letter-spacing: 0.04em; }

        /* Heading */
        .pr-register-heading { font-size: 20px; font-weight: 700; color: #2b352a; margin-bottom: 4px; text-align: center; }
        .pr-register-sub { font-size: 13.5px; color: #5a6557; text-align: center; margin-bottom: 1.5rem; }

        /* Error */
        .pr-error {
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
        .pr-form { display: flex; flex-direction: column; gap: 0.85rem; }
        .pr-field { display: flex; flex-direction: column; gap: 4px; }
        .pr-label { font-size: 13px; font-weight: 500; color: #3b4539; }

        .pr-input-wrap { position: relative; display: flex; align-items: center; }
        .pr-input-icon { position: absolute; left: 12px; color: #7b8878; pointer-events: none; }
        .pr-input {
          width: 100%;
          padding: 10px 40px 10px 38px;
          border: 1.5px solid #dfdacd;
          border-radius: 9px;
          font-size: 14px;
          color: #2b352a;
          background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
          font-family: inherit;
        }
        .pr-input:focus { border-color: #506e4d; box-shadow: 0 0 0 3px rgba(80,110,77,0.1); }
        .pr-input::placeholder { color: #7b8878; }
        .pr-input:disabled { background: #fcfbf9; cursor: not-allowed; }

        .pr-eye-btn {
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
        .pr-eye-btn:hover { color: #5a6557; }

        /* Submit */
        .pr-submit-btn {
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
          margin-top: 6px;
        }
        .pr-submit-btn:hover:not(:disabled) { background: #415a3e; transform: translateY(-1px); }
        .pr-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @keyframes pr-spin { to { transform: rotate(360deg); } }
        .pr-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: pr-spin 0.7s linear infinite;
        }

        /* Switch link */
        .pr-login-row {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 13.5px;
          color: #5a6557;
        }
        .pr-login-row a { color: #506e4d; font-weight: 600; text-decoration: none; }
        .pr-login-row a:hover { text-decoration: underline; }

        /* RIGHT PANEL */
        .pr-register-right {
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
        @media (max-width: 768px) { .pr-register-right { display: none; } }

        .pr-right-blob-1 {
          position: absolute;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(114,140,111,0.15) 0%, transparent 70%);
          top: -80px; right: -80px;
          pointer-events: none;
        }
        .pr-right-blob-2 {
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(223,218,205,0.08) 0%, transparent 70%);
          bottom: -60px; left: -60px;
          pointer-events: none;
        }

        .pr-right-content { position: relative; z-index: 1; max-width: 420px; text-align: center; }

        .pr-right-img-wrap {
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .pr-right-img { width: 100%; height: 260px; object-fit: cover; display: block; }

        .pr-right-badge {
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
        .pr-right-badge svg { color: #c06d48; }

        .pr-right-quote {
          font-size: 16px;
          color: #f0ede4;
          line-height: 1.75;
          font-style: italic;
          margin-bottom: 1.25rem;
        }
        .pr-right-quote::before { content: '\\201C'; font-size: 22px; color: #c06d48; margin-right: 2px; }
        .pr-right-quote::after  { content: '\\201D'; font-size: 22px; color: #c06d48; margin-left: 2px; }

        .pr-right-attr { font-size: 12px; color: #8fa08c; }
        .pr-right-attr strong { color: #f0ede4; font-weight: 600; }
      `}</style>

      <div className="pr-register-page">

        {/* LEFT */}
        <div className="pr-register-left">
          <button className="pr-register-back" onClick={goBack}>
            <ChevronLeft size={16} /> Back to home
          </button>

          <div className="pr-register-card">
            <div className="pr-brand">
              <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'contain', marginBottom: '8px' }} />
              <span className="pr-brand-name">ILMEE</span>
              <span className="pr-brand-sub">Parent Registration</span>
            </div>

            <h2 className="pr-register-heading">Create an account</h2>
            <p className="pr-register-sub">Get started managing your child's homeschooling path</p>

            {error && (
              <div className="pr-error">
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="pr-form">
              <div className="pr-field">
                <label className="pr-label">Full Name</label>
                <div className="pr-input-wrap">
                  <User size={15} className="pr-input-icon" />
                  <input
                    type="text"
                    className="pr-input"
                    placeholder="e.g. Emma Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="pr-field">
                <label className="pr-label">Email address</label>
                <div className="pr-input-wrap">
                  <Mail size={15} className="pr-input-icon" />
                  <input
                    type="email"
                    className="pr-input"
                    placeholder="emma@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="pr-field">
                <label className="pr-label">Password</label>
                <div className="pr-input-wrap">
                  <Lock size={15} className="pr-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="pr-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="pr-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="pr-field">
                <label className="pr-label">Confirm Password</label>
                <div className="pr-input-wrap">
                  <Lock size={15} className="pr-input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="pr-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="pr-eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="pr-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><div className="pr-spinner" /> Creating account…</>
                ) : (
                  <>Register Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <div className="pr-login-row">
              Already have an account? <a href="/login-hs">Login here</a>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="pr-register-right">
          <div className="pr-right-blob-1" />
          <div className="pr-right-blob-2" />
          <div className="pr-right-content">
            <div className="pr-right-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1524508762098-fd966ffb6ef9?auto=format&fit=crop&q=80&w=700"
                alt="Parent teaching child"
                className="pr-right-img"
              />
            </div>

            <div className="pr-right-badge">
              <BookOpen size={11} /> ILMEE Admissions
            </div>

            <p className="pr-right-quote">
              Join the ILMEE community and take control of your child's education with our comprehensive homeschooling platform.
            </p>
            <p className="pr-right-attr">
              <strong>ILMEE Admissions Team</strong> · UK Educator Support
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
