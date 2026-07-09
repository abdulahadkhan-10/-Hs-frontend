import React, { useState } from 'react';
import { School, Mail, Lock, ArrowRight, AlertTriangle, Eye, EyeOff, ChevronLeft, Building, Key, MapPin, Globe } from 'lucide-react';

interface RegistrationProps {
  onRegisterSuccess: (username: string, role: string) => void;
}

export default function SchoolRegistration({ onRegisterSuccess }: RegistrationProps) {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolKey: '',
    address: '',
    region: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      // Simulate successful registration, but the account will be pending approval in reality
      onRegisterSuccess(formData.schoolName, 'school');
    }, 1200);
  };

  const goBack = () => {
    window.history.pushState({}, '', '/login-school');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .sch-reg-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #fafaf8;
        }

        /* LEFT */
        .sch-reg-left {
          flex: 1.2; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 3rem 2rem; background: #fff; position: relative;
        }

        .sch-reg-back {
          position: absolute; top: 1.5rem; left: 1.5rem;
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #64748b;
          cursor: pointer; background: none; border: none;
          padding: 6px 10px; border-radius: 6px;
          transition: background 0.15s, color 0.15s; text-decoration: none;
        }
        .sch-reg-back:hover { background: #f1f5f9; color: #1a3566; }

        .sch-reg-card { width: 100%; max-width: 540px; }

        .sch-reg-brand {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; margin-bottom: 1.5rem;
        }
        .sch-reg-brand-mark {
          width: 48px; height: 48px; border-radius: 12px;
          background: #1a3566; display: flex; align-items: center;
          justify-content: center; margin-bottom: 4px;
        }
        .sch-reg-brand-name { font-size: 22px; font-weight: 700; color: #111; letter-spacing: 0.06em; }

        .sch-reg-heading { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 4px; text-align: center; }
        .sch-reg-sub { font-size: 13.5px; color: #64748b; text-align: center; margin-bottom: 1.75rem; }

        .sch-reg-error {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 8px;
          font-size: 13px; color: #b91c1c; margin-bottom: 1rem;
        }

        .sch-reg-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .sch-reg-field { display: flex; flex-direction: column; gap: 6px; }
        .sch-reg-field.full { grid-column: span 2; }
        .sch-reg-label { font-size: 13px; font-weight: 500; color: #374151; }

        .sch-reg-input-wrap { position: relative; display: flex; align-items: center; }
        .sch-reg-input-icon { position: absolute; left: 12px; color: #94a3b8; pointer-events: none; }
        .sch-reg-input {
          width: 100%; padding: 11px 40px 11px 38px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-size: 14px; color: #111; background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s; outline: none; font-family: inherit;
        }
        .sch-reg-input:focus { border-color: #1a3566; box-shadow: 0 0 0 3px rgba(26,53,102,0.08); }
        .sch-reg-input::placeholder { color: #94a3b8; }
        .sch-reg-input:disabled { background: #f8fafc; cursor: not-allowed; }

        .sch-reg-select {
          width: 100%; padding: 11px 12px 11px 38px;
          border: 1.5px solid #e2e8f0; border-radius: 9px;
          font-size: 14px; color: #111; background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s; outline: none; font-family: inherit;
          appearance: none;
        }
        .sch-reg-select:focus { border-color: #1a3566; box-shadow: 0 0 0 3px rgba(26,53,102,0.08); }

        .sch-reg-eye-btn {
          position: absolute; right: 10px; background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; align-items: center; padding: 4px; transition: color 0.15s;
        }
        .sch-reg-eye-btn:hover { color: #475569; }

        .sch-reg-submit-btn {
          grid-column: span 2; width: 100%; padding: 12px;
          background: #1a3566; color: #fff; border: none; border-radius: 9px;
          font-size: 14.5px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: inherit; transition: background 0.15s, transform 0.1s; margin-top: 10px;
        }
        .sch-reg-submit-btn:hover:not(:disabled) { background: #122450; transform: translateY(-1px); }
        .sch-reg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @keyframes sch-reg-spin { to { transform: rotate(360deg); } }
        .sch-reg-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%; animation: sch-reg-spin 0.7s linear infinite;
        }

        .sch-reg-login-link {
          grid-column: span 2; text-align: center; margin-top: 1rem; font-size: 13.5px; color: #64748b;
        }
        .sch-reg-login-link a {
          color: #1a3566; font-weight: 600; text-decoration: none; margin-left: 4px;
        }
        .sch-reg-login-link a:hover { text-decoration: underline; }

        /* RIGHT */
        .sch-reg-right {
          flex: 1; background: linear-gradient(145deg, #1a3566 0%, #0d1f45 60%, #0a1530 100%);
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: 3rem 2.5rem; position: relative; overflow: hidden;
        }
        @media (max-width: 900px) { .sch-reg-right { display: none; } }

        .sch-reg-blob-1 {
          position: absolute; width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(100,140,220,0.12) 0%, transparent 70%);
          top: -80px; right: -80px; pointer-events: none;
        }
        .sch-reg-blob-2 {
          position: absolute; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(212,201,154,0.08) 0%, transparent 70%);
          bottom: -60px; left: -60px; pointer-events: none;
        }

        .sch-reg-content { position: relative; z-index: 1; max-width: 420px; text-align: center; }

        .sch-reg-info-card {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 24px; text-align: left; margin-bottom: 2rem;
        }
        .sch-reg-info-title { font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 12px; }
        .sch-reg-info-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .sch-reg-info-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; color: #cbd5e1; line-height: 1.5; }
        .sch-reg-info-list li svg { color: #60a5fa; flex-shrink: 0; margin-top: 2px; }

      `}</style>

      <div className="sch-reg-page">
        {/* LEFT */}
        <div className="sch-reg-left">
          <button className="sch-reg-back" onClick={goBack}>
            <ChevronLeft size={16} /> Back to Login
          </button>

          <div className="sch-reg-card">
            <div className="sch-reg-brand">
              <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'contain', marginBottom: '8px' }} />
              <span className="sch-reg-brand-name">ILMEE</span>
            </div>

            <h2 className="sch-reg-heading">School Registration</h2>
            <p className="sch-reg-sub">Register your institution to access the LSA Portal</p>

            {error && (
              <div className="sch-reg-error">
                <AlertTriangle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="sch-reg-form">
              <div className="sch-reg-field">
                <label className="sch-reg-label">School Name</label>
                <div className="sch-reg-input-wrap">
                  <Building size={15} className="sch-reg-input-icon" />
                  <input
                    type="text"
                    name="schoolName"
                    className="sch-reg-input"
                    placeholder="e.g. Oxford Academy"
                    value={formData.schoolName}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="sch-reg-field">
                <label className="sch-reg-label">School Key (Unique Identifier)</label>
                <div className="sch-reg-input-wrap">
                  <Key size={15} className="sch-reg-input-icon" />
                  <input
                    type="text"
                    name="schoolKey"
                    className="sch-reg-input"
                    placeholder="e.g. OXF-2026"
                    value={formData.schoolKey}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="sch-reg-field full">
                <label className="sch-reg-label">Address (Optional)</label>
                <div className="sch-reg-input-wrap">
                  <MapPin size={15} className="sch-reg-input-icon" />
                  <input
                    type="text"
                    name="address"
                    className="sch-reg-input"
                    placeholder="Full address of the institution"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="sch-reg-field full">
                <label className="sch-reg-label">Region</label>
                <div className="sch-reg-input-wrap">
                  <Globe size={15} className="sch-reg-input-icon" />
                  <select
                    name="region"
                    className="sch-reg-select"
                    value={formData.region}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  >
                    <option value="" disabled>Select Region</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="sch-reg-field">
                <label className="sch-reg-label">Admin Email</label>
                <div className="sch-reg-input-wrap">
                  <Mail size={15} className="sch-reg-input-icon" />
                  <input
                    type="email"
                    name="email"
                    className="sch-reg-input"
                    placeholder="admin@school.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="sch-reg-field">
                <label className="sch-reg-label">Password</label>
                <div className="sch-reg-input-wrap">
                  <Lock size={15} className="sch-reg-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="sch-reg-input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="sch-reg-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="sch-reg-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <><div className="sch-reg-spinner" /> Submitting Request…</>
                ) : (
                  <>Submit Registration <ArrowRight size={15} /></>
                )}
              </button>

              <div className="sch-reg-login-link">
                Already registered? 
                <a href="/login-school" onClick={goBack}>
                  Sign in here
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sch-reg-right">
          <div className="sch-reg-blob-1" />
          <div className="sch-reg-blob-2" />
          <div className="sch-reg-content">
            <div className="sch-reg-info-card">
              <h3 className="sch-reg-info-title">Registration Process</h3>
              <ul className="sch-reg-info-list">
                <li>
                  <ArrowRight size={16} />
                  <span>Submit your institution details and admin credentials.</span>
                </li>
                <li>
                  <ArrowRight size={16} />
                  <span>Your application is sent to our Regional Administration team for verification.</span>
                </li>
                <li>
                  <ArrowRight size={16} />
                  <span>Once approved, you can log in and start onboarding teachers and students immediately.</span>
                </li>
              </ul>
            </div>
            
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
              By registering, you agree to our Terms of Service and Privacy Policy. All accounts are subject to approval.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
