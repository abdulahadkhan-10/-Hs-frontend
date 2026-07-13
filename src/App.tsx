import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { setCredentials, logout } from './store/slices/authSlice';
import { useGetMeQuery, useLogoutMutation } from './store/api/authApi';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import SchoolDashboard from './pages/school/SchoolDashboard';
import ClassesManagement from './pages/school/ClassesManagement';
import SafeguardingOverview from './pages/SafeguardingOverview';
import SafeguardingSubpages from './pages/SafeguardingSubpages';
import OtherPages from './pages/OtherPages';
import { Toaster } from 'sonner';

// Auth Pages
import LandingPage from './pages/LandingPage';
import SchoolLogin from './pages/auth/SchoolLogin';
import SchoolRegistration from './pages/auth/SchoolRegistration';
import TeacherLogin from './pages/auth/TeacherLogin';
import StudentLogin from './pages/auth/StudentLogin';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import SafeguardLogin from './pages/auth/SafeguardLogin';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Call getMe query to load session automatically if authenticated state in slice is set from localStorage
  const { data: meData, error: meError } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (meData?.user) {
      dispatch(setCredentials({ user: meData.user }));
    } else if (meError) {
      dispatch(logout());
    }
  }, [meData, meError, dispatch]);

  const loggedInUser = user?.profile?.schoolName || user?.profile?.name || user?.email || '';

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

  const [logoutApi] = useLogoutMutation();

  // Authentication Handlers
  const handleLoginSuccess = (_userVal: string, _role: string) => {
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error("Failed to log out on server:", err);
    } finally {
      dispatch(logout());
      window.history.pushState({}, '', '/');
      setAuthRoute('/');
    }
  };

  const handlePageChange = (page: string, subpage?: string) => {
    setCurrentPage(page);
    if (subpage) {
      setCurrentSubpage(subpage);
    } else {
      setCurrentSubpage('');
    }
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      if (authRoute === '/login-school') {
        return <SchoolLogin onLoginSuccess={handleLoginSuccess} />;
      }
      if (authRoute === '/register-school') {
        return <SchoolRegistration onRegisterSuccess={(userVal) => handleLoginSuccess(userVal, 'school')} />;
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
      if (authRoute === '/forgot-password') {
        return <ForgotPassword />;
      }
      if (authRoute.startsWith('/reset-password')) {
        return <ResetPassword />;
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
          userRole={user?.role}
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
            {currentPage === 'home' && (
              user?.role === 'SCHOOL' ? <SchoolDashboard /> : <Home />
            )}

            {currentPage === 'school-classes' && (
              <ClassesManagement />
            )}

            {currentPage === 'safeguarding' && currentSubpage === 'overview' && (
              <SafeguardingOverview onPageChange={handlePageChange} />
            )}

            {currentPage === 'safeguarding' && currentSubpage !== 'overview' && (
              <SafeguardingSubpages subpage={currentSubpage} />
            )}

            {currentPage !== 'home' && currentPage !== 'safeguarding' && currentPage !== 'school-classes' && (
              <OtherPages pageId={currentPage} />
            )}
          </div>
        </main>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      <Toaster position="bottom-right" richColors />
    </>
  );
}
