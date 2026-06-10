import React, { useState } from 'react';
import { BookOpenCheck, Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (email.trim() && password.length >= 4) {
        onLoginSuccess(email.split('@')[0]);
      } else {
        setError('Please enter a valid email address and a password of at least 4 characters.');
      }
    }, 800);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(`${provider} Learner`);
    }, 600);
  };

  return (
    <div className="login-page-container">
      {/* Left Column: Form Card */}
      <div className="login-left-side">
        <div className="card-widget" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
          <div className="login-brand-logo">
            <BookOpenCheck className="login-logo-icon" />
            <h1 className="login-brand-title">ILMEE</h1>
            <span className="login-brand-sub">Welcome Back!</span>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', marginBottom: '24px' }}>
            Sign in to your homeschooling account
          </p>

          {error && (
            <div className="alert-box error" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-element">
            <div className="form-group">
              <label className="input-label">Email / Username</label>
              <div className="input-container">
                <Mail className="input-icon" size={16} />
                <input
                  type="text"
                  placeholder="e.g. emma@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label className="input-label">Password</label>
                <a href="#forgot" className="forgot-link">Forgot Password?</a>
              </div>
              <div className="input-container">
                <Lock className="input-icon" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading} style={{ width: '100%', border: 'none' }}>
              {isLoading ? 'Signing In...' : 'Login'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="or-divider">or continue with</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => handleSocialLogin('Google')}
              className="social-google-btn"
              disabled={isLoading}
            >
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google" 
                className="social-google-logo" 
              />
              <span>Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('Microsoft')}
              className="social-google-btn"
              disabled={isLoading}
            >
              <img 
                src="https://www.svgrepo.com/show/354067/microsoft.svg" 
                alt="Microsoft" 
                className="social-google-logo" 
              />
              <span>Microsoft</span>
            </button>
          </div>

          <p className="switch-text">
            New to ILMEE? <button className="switch-btn" onClick={() => handleSocialLogin('New Guest')}>Create an Account</button>
          </p>
        </div>
      </div>

      {/* Right Column: Premium Quote/Presentation Panel */}
      <div className="login-right-side">
        <div className="present-blob"></div>
        <div className="image-container">
          <img
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600"
            alt="Children learning together"
            className="present-img"
          />
        </div>
        <div className="quote-container">
          <blockquote className="quote-text">
            "ILMEE has completely transformed how our family approaches schooling. Structured, supportive, and child-centred."
          </blockquote>
          <cite className="quote-author">— The Thompson Family, London</cite>
        </div>
      </div>
    </div>
  );
}
