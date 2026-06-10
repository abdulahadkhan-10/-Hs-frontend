import React, { useState } from 'react';

interface LoginCardProps {
  onSuccess: (user: string) => void;
  onGoogleLogin: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  alert: { type: 'error' | 'success'; message: string } | null;
  setAlert: (alert: { type: 'error' | 'success'; message: string } | null) => void;
}

export default function LoginCard({
  onSuccess,
  onGoogleLogin,
  isLoading,
  setIsLoading,
  alert,
  setAlert,
}: LoginCardProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form Inputs
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (isLogin) {
      if (!usernameOrEmail.trim() || !password) {
        setAlert({ type: 'error', message: 'Please enter both email/username and password.' });
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(usernameOrEmail);
      }, 1000);

    } else {
      if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
        setAlert({ type: 'error', message: 'All fields are required.' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setAlert({ type: 'error', message: 'Please enter a valid email address.' });
        return;
      }

      if (password.length < 6) {
        setAlert({ type: 'error', message: 'Password must be at least 6 characters long.' });
        return;
      }

      if (password !== confirmPassword) {
        setAlert({ type: 'error', message: 'Passwords do not match.' });
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(fullName);
      }, 1000);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setAlert(null);
    setUsernameOrEmail('');
    setPassword('');
    setEmail('');
    setConfirmPassword('');
    setFullName('');
  };

  return (
    <div className="login-card">
      <h2 className="card-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      <p className="card-subtitle">
        {isLogin 
          ? 'Access your learning journey at ScholarlyPath Academy.' 
          : 'Register now to start your learning journey at ScholarlyPath Academy.'}
      </p>

      {alert && (
        <div className={`alert-box ${alert.type}`}>
          <span>{alert.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{alert.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-element" noValidate>
        {/* Full Name (Registration only) */}
        {!isLogin && (
          <div className="form-group">
            <label className="input-label" htmlFor="fullName">Full Name</label>
            <div className="input-container">
              <span className="input-icon">👤</span>
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Email Address (Registration only) */}
        {!isLogin && (
          <div className="form-group">
            <label className="input-label" htmlFor="email">Email Address</label>
            <div className="input-container">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Username / Email (Login only) */}
        {isLogin && (
          <div className="form-group">
            <label className="input-label" htmlFor="usernameOrEmail">Email or Username</label>
            <div className="input-container">
              <span className="input-icon">👤</span>
              <input
                id="usernameOrEmail"
                type="text"
                className="form-input"
                placeholder="Enter your email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Password field */}
        <div className="form-group">
          <div className="label-row">
            <label className="input-label" htmlFor="password">Password</label>
            {isLogin && (
              <a 
                href="#forgot" 
                className="forgot-link" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setAlert({ type: 'success', message: 'Password recovery email sent! Check your inbox.' }); 
                }}
              >
                Forgot Password?
              </a>
            )}
          </div>
          <div className="input-container">
            <span className="input-icon">🔒</span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="form-input password-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁️' : '🔒'}
            </button>
          </div>
        </div>

        {/* Confirm Password (Registration only) */}
        {!isLogin && (
          <div className="form-group">
            <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-container">
              <span className="input-icon">🔒</span>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="form-input password-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Remember Me Checkbox (Login only) */}
        {isLogin && (
          <div className="remember-row">
            <input
              id="rememberMe"
              type="checkbox"
              className="checkbox-input"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="checkbox-label" htmlFor="rememberMe">
              Remember me for 30 days
            </label>
          </div>
        )}

        {/* Submit Action */}
        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? 'Processing...' : isLogin ? 'Login to Account' : 'Register Account'}
          {!isLoading && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          )}
        </button>
      </form>

      <div className="or-divider">or continue with</div>

      {/* Google login component */}
      <button type="button" className="social-google-btn" onClick={onGoogleLogin} disabled={isLoading}>
        <svg className="social-google-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      {/* Login Switch */}
      <div className="switch-text">
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <button type="button" className="switch-btn" onClick={handleToggleMode}>
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" className="switch-btn" onClick={handleToggleMode}>
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
