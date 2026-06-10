import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuoteSection from './components/QuoteSection';
import LoginCard from './components/LoginCard';
import Dashboard from './components/Dashboard';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<string>('');

  // UI / Alert States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  // Authentication Handlers
  const handleLoginSuccess = (user: string) => {
    setIsAuthenticated(true);
    setLoggedInUser(user);
    setAlert({ type: 'success', message: 'Successfully authenticated!' });
  };

  const handleGoogleLogin = () => {
    setAlert(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(true);
      setLoggedInUser('Google Scholar');
      setAlert({ type: 'success', message: 'Signed in with Google!' });
    }, 800);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser('');
    setAlert(null);
  };

  return (
    <>
      {/* Top Header Navbar */}
      <Navbar onLogout={handleLogout} setAlert={setAlert} />

      {/* Main Grid Content Split */}
      <main className="main-layout">
        
        {/* Left Column: Authenticaton Forms */}
        <section className="form-column">
          {isAuthenticated ? (
            <Dashboard 
              loggedInUser={loggedInUser} 
              onLogout={handleLogout} 
              setAlert={setAlert} 
            />
          ) : (
            <LoginCard 
              onSuccess={handleLoginSuccess}
              onGoogleLogin={handleGoogleLogin}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              alert={alert}
              setAlert={setAlert}
            />
          )}
        </section>

        {/* Right Column: Visual Brand Quote Section */}
        <QuoteSection />
        
      </main>

      {/* Footer Branding & Links */}
      <Footer setAlert={setAlert} />
    </>
  );
}
