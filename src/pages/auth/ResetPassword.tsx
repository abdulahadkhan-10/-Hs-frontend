import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useResetPasswordMutation } from '../../store/api/authApi';

export default function ResetPassword() {
  const [resetPassword, { isLoading, error, isSuccess }] = useResetPasswordMutation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Extract token from query params
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!token) {
      setLocalError('No reset token found in URL. Please request a new password reset link.');
      return;
    }

    if (newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
    } catch (err) {
      // Errors handled by RTK Query state
    }
  };

  const goToLogin = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .reset-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #fafaf8;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .reset-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
          border: 1px solid #f1f5f9;
        }

        .reset-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.5rem;
        }
        .reset-brand-mark {
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
        .reset-brand-name {
          font-size: 22px;
          font-weight: 700;
          color: #111;
          letter-spacing: 0.06em;
        }

        .reset-heading {
          font-size: 20px;
          font-weight: 700;
          color: #111;
          margin-bottom: 8px;
          text-align: center;
        }
        .reset-sub {
          font-size: 13.5px;
          color: #64748b;
          text-align: center;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .reset-error {
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

        .reset-success {
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

        .reset-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .reset-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .reset-label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .reset-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .reset-input-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }
        .reset-input {
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
        .reset-input:focus {
          border-color: #1a3566;
          box-shadow: 0 0 0 3px rgba(26, 53, 102, 0.08);
        }
        .reset-input::placeholder {
          color: #94a3b8;
        }
        .reset-input:disabled {
          background: #f8fafc;
          cursor: not-allowed;
        }

        .reset-eye-btn {
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
        .reset-eye-btn:hover {
          color: #475569;
        }

        .reset-submit-btn {
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
        .reset-submit-btn:hover:not(:disabled) {
          background: #122450;
          transform: translateY(-1px);
        }
        .reset-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        @keyframes reset-spin {
          to { transform: rotate(360deg); }
        }
        .reset-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: reset-spin 0.7s linear infinite;
        }

        .reset-back-login-btn {
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
          transition: background 0.15s;
        }
        .reset-back-login-btn:hover {
          background: #122450;
        }
      `}</style>

      <div className="reset-page">
        <div className="reset-card">
          <div className="reset-brand">
            <div className="reset-brand-mark">IL</div>
            <span className="reset-brand-name">ILMEE</span>
          </div>

          {isSuccess ? (
            <div className="reset-success">
              <CheckCircle2 size={56} className="success-icon" />
              <h2 className="success-title">Password Reset Complete</h2>
              <p className="success-desc">
                Your password has been successfully reset. You can now use your new password to access your account.
              </p>
              <button className="reset-back-login-btn" onClick={goToLogin}>
                Sign In Now <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <h2 className="reset-heading">Reset Password</h2>
              <p className="reset-sub">
                Choose a strong, secure new password for your account.
              </p>

              {(localError || error) && (
                <div className="reset-error">
                  <AlertTriangle size={16} />
                  <span>
                    {localError || (error as any)?.data?.error || 'Something went wrong.'}
                  </span>
                </div>
              )}

              <form className="reset-form" onSubmit={handleSubmit}>
                <div className="reset-field">
                  <label className="reset-label">New Password</label>
                  <div className="reset-input-wrap">
                    <Lock size={15} className="reset-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="reset-input"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="reset-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="reset-field">
                  <label className="reset-label">Confirm New Password</label>
                  <div className="reset-input-wrap">
                    <Lock size={15} className="reset-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="reset-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="reset-submit-btn" disabled={isLoading || !token}>
                  {isLoading ? (
                    <><div className="reset-spinner" /> Resetting…</>
                  ) : (
                    <>Reset Password</>
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
