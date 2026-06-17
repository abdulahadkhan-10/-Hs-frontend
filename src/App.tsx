import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import SafeguardingOverview from './pages/SafeguardingOverview';
import SafeguardingSubpages from './pages/SafeguardingSubpages';
import OtherPages from './pages/OtherPages';

// Auth Pages
import LandingPage from './pages/LandingPage';
import ParentStudentLogin from './pages/auth/ParentStudentLogin';
import TeacherStudentLogin from './pages/auth/TeacherStudentLogin';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import GuardLogin from './pages/auth/GuardLogin';
import ParentRegistration from './pages/auth/ParentRegistration';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<string>('');

  // Simple state-based routing for Auth URLs
  const [authRoute, setAuthRoute] = useState<string>(window.location.pathname);

  // Navigation Routing States (Post-Login)
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentSubpage, setCurrentSubpage] = useState<string>('overview');
  const [selectedChild, setSelectedChild] = useState<string>('Emma - Year 6');

  // Intercept browser navigation for auth routes
  useEffect(() => {
    const handleLocationChange = () => {
      setAuthRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Authentication Handlers
  const handleLoginSuccess = (user: string, _role: string) => {
    setIsAuthenticated(true);
    setLoggedInUser(user);
    setCurrentPage('home');
    // Clear URL to root purely for visual consistency in our mock
    window.history.pushState({}, '', '/');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser('');
    window.history.pushState({}, '', '/');
    setAuthRoute('/');
  };

  const handlePageChange = (page: string, subpage?: string) => {
    setCurrentPage(page);
    if (subpage) {
      setCurrentSubpage(subpage);
    } else {
      setCurrentSubpage('');
    }
  };

  if (!isAuthenticated) {
    if (authRoute === '/login-hs') {
      return <ParentStudentLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-tutn') {
      return <TeacherStudentLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-sa') {
      return <SuperAdminLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-guard') {
      return <GuardLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/register-hs') {
      return <ParentRegistration onRegisterSuccess={(user) => handleLoginSuccess(user, 'parent')} />;
    }
    // Default fallback is the new Landing Page
    return <LandingPage onNavigate={setAuthRoute} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentPage={currentPage} 
        currentSubpage={currentSubpage} 
        onPageChange={handlePageChange} 
      />

      {/* Main Content Area */}
      <main className="app-main">
        <Header 
          currentPage={currentPage} 
          currentSubpage={currentSubpage} 
          onLogout={handleLogout} 
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
          loggedInUser={loggedInUser}
        />

        <div className="app-body">
          {currentPage === 'home' && <Home />}

          {currentPage === 'safeguarding' && currentSubpage === 'overview' && (
            <SafeguardingOverview onPageChange={handlePageChange} />
          )}

          {currentPage === 'safeguarding' && currentSubpage !== 'overview' && (
            <SafeguardingSubpages subpage={currentSubpage} />
          )}

          {currentPage !== 'home' && currentPage !== 'safeguarding' && (
            <OtherPages pageId={currentPage} />
          )}
        </div>
      </main>
    </div>
  );
}
