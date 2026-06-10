
interface DashboardProps {
  loggedInUser: string;
  onLogout: () => void;
  setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
}

export default function Dashboard({ loggedInUser, onLogout, setAlert }: DashboardProps) {
  return (
    <div className="login-card success-card">
      <span className="success-header-icon">🎓</span>
      <h2 className="card-title">Welcome back!</h2>
      <p className="card-subtitle">
        Hello, <strong>{loggedInUser}</strong>. Access granted to ScholarlyPath Academy Dashboard.
      </p>

      <div className="success-btn-group">
        <button 
          className="login-btn" 
          onClick={() => setAlert({ type: 'success', message: 'Redirecting to classroom lectures...' })}
        >
          Go to Classes
        </button>
        <button 
          className="social-google-btn" 
          style={{ width: '100%' }}
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
