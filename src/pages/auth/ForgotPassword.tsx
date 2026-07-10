import React, { useState } from 'react';
import { Mail, ArrowRight, AlertTriangle, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';
import { useForgotPasswordMutation } from '../../store/api/authApi';

export default function ForgotPassword() {
  const [forgotPassword, { isLoading, error, isSuccess }] = useForgotPasswordMutation();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
    } catch (err) {
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

        .forgot-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #fafaf8;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .forgot-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
          position: relative;
          border: 1px solid #f1f5f9;
        }

        .forgot-back {
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
        .forgot-back:hover {
          background: #f1f5f9;
          color: #1a3566;
        }

        .forgot-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.5rem;
          margin-top: 1.5rem;
        }
        .forgot-brand-mark {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #1a3566;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        .forgot-brand-name {
          font-size: 22px;
          font-weight: 700;
          color: #111;
          letter-spacing: 0.06em;
        }

        .forgot-heading {
          font-size: 20px;
          font-weight: 700;
          color: #111;
          margin-bottom: 8px;
          text-align: center;
        }
        .forgot-sub {
          font-size: 13.5px;
          color: #64748b;
          text-align: center;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .forgot-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 13px;
          color: #b91c1c;
          margin-bottom: 1.5rem;
        }

        .forgot-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.5rem 0;
        }
        .success-icon {
          color: #10b981;
          margin-bottom: 1rem;
        }
        .success-title {
          font-size: 18px;
          font-weight: 600;
          color: #111;
          margin-bottom: 8px;
        }
        .success-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 2rem;
        }

        .forgot-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .forgot-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .forgot-label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .forgot-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .forgot-input-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }
        .forgot-input {
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
        .forgot-input:focus {
          border-color: #1a3566;
          box-shadow: 0 0 0 3px rgba(26, 53, 102, 0.08);
        }
        .forgot-input::placeholder {
          color: #94a3b8;
        }
        .forgot-input:disabled {
          background: #f8fafc;
          cursor: not-allowed;
        }

        .forgot-submit-btn {
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
        .forgot-submit-btn:hover:not(:disabled) {
          background: #122450;
          transform: translateY(-1px);
        }
        .forgot-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        @keyframes forgot-spin {
          to { transform: rotate(360deg); }
        }
        .forgot-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: forgot-spin 0.7s linear infinite;
        }

        .forgot-back-login-btn {
          width: 100%;
          padding: 11px;
          background: transparent;
          color: #1a3566;
          border: 1.5px solid #1a3566;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: inherit;
          transition: background 0.15s;
        }
        .forgot-back-login-btn:hover {
          background: rgba(26, 53, 102, 0.04);
        }
      `}</style>

      <div className="forgot-page">
        <div className="forgot-card">
          <button className="forgot-back" onClick={goBack}>
            <ChevronLeft size={16} /> Back to portal
          </button>

          <div className="forgot-brand">
            <div className="forgot-brand-mark">IL</div>
            <span className="forgot-brand-name">ILMEE</span>
          </div>

          {isSuccess ? (
            <div className="forgot-success">
              <CheckCircle2 size={56} className="success-icon" style={{ color: '#10b981', marginBottom: '1rem' }} />
              <h2 className="success-title">Verification Code Sent</h2>
              <p className="success-desc" style={{ fontSize: '14.5px', color: '#64748b', lineHeight: '1.5', marginBottom: '1.75rem' }}>
                We have sent a 6-digit verification code to <br /><strong>{email}</strong>.
              </p>
              <button
                className="forgot-submit-btn"
                onClick={() => {
                  window.history.pushState({}, '', `/reset-password?email=${encodeURIComponent(email)}`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                Verify & Reset Password <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <>
              <h2 className="forgot-heading">Reset Password</h2>
              <p className="forgot-sub">
                Enter your email address and we'll send you a 6-digit verification code to reset your password.
              </p>

              {error && (
                <div className="forgot-error">
                  <AlertTriangle size={16} />
                  <span>
                    {(error as any)?.data?.error || 'Something went wrong. Please try again.'}
                  </span>
                </div>
              )}

              <form className="forgot-form" onSubmit={handleSubmit}>
                <div className="forgot-field">
                  <label className="forgot-label">Email Address</label>
                  <div className="forgot-input-wrap">
                    <Mail size={15} className="forgot-input-icon" />
                    <input
                      type="email"
                      className="forgot-input"
                      placeholder="akshat.g10b14kis@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="forgot-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <><div className="forgot-spinner" /> Sending code…</>
                  ) : (
                    <>Send verification code <Send size={14} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
