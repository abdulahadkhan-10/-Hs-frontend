import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import SafeguardingOverview from './pages/SafeguardingOverview';
import SafeguardingSubpages from './pages/SafeguardingSubpages';
import OtherPages from './pages/OtherPages';

// Auth Pages
import LandingPage from './pages/LandingPage';
import SchoolLogin from './pages/auth/SchoolLogin';
import SchoolRegistration from './pages/auth/SchoolRegistration';
import TeacherLogin from './pages/auth/TeacherLogin';
import StudentLogin from './pages/auth/StudentLogin';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import SafeguardLogin from './pages/auth/SafeguardLogin';

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
    if (authRoute === '/login-school') {
      return <SchoolLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/register-school') {
      return <SchoolRegistration onRegisterSuccess={(user) => handleLoginSuccess(user, 'school')} />;
    }
    if (authRoute === '/login-teacher') {
      return <TeacherLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-student') {
      return <StudentLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-safeguard') {
      return <SafeguardLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-sa') {
      return <SuperAdminLogin onLoginSuccess={handleLoginSuccess} />;
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
