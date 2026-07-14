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
import TeachersManagement from './pages/school/TeachersManagement';
import AdminRequests from './pages/school/AdminRequests';
import SchoolSettings from './pages/school/SchoolSettings';
import SafeguardingOverview from './pages/SafeguardingOverview';
import SafeguardingSubpages from './pages/SafeguardingSubpages';
import OtherPages from './pages/OtherPages';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'sonner';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherClasses from './pages/teacher/TeacherClasses';
import TeacherLessons from './pages/teacher/TeacherLessons';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherSafeguarding from './pages/teacher/TeacherSafeguarding';
import TeacherReports from './pages/teacher/TeacherReports';
import TeacherMessages from './pages/teacher/TeacherMessages';
import TeacherSettings from './pages/teacher/TeacherSettings';
import TeacherMyClassroom from './pages/teacher/TeacherMyClassroom';


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

  const handleProfileClick = () => {
    setCurrentPage('profile');
    setCurrentSubpage('');
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
            onProfileClick={handleProfileClick}
            selectedChild={selectedChild}
            setSelectedChild={setSelectedChild}
            loggedInUser={loggedInUser}
            userRole={user?.role}
          />

          <div className="app-body">
            {currentPage === 'home' && (
              user?.role === 'SCHOOL' ? <SchoolDashboard /> : 
              user?.role === 'TEACHER' ? <TeacherDashboard onNavigate={handlePageChange} /> : <Home />
            )}

            {currentPage === 'school-classes' && (
              <ClassesManagement />
            )}

            {currentPage === 'school-requests' && (
              <AdminRequests />
            )}

            {currentPage === 'school-settings' && (
              <SchoolSettings />
            )}

            {currentPage === 'teacher-my-classroom' && (
              <TeacherMyClassroom />
            )}

            {currentPage === 'teacher-classes' && (
              <TeacherClasses />
            )}

            {currentPage === 'teacher-lessons' && (
              <TeacherLessons />
            )}

            {currentPage === 'teacher-assignments' && (
              <TeacherAssignments />
            )}

            {currentPage === 'teacher-safeguarding' && (
              <TeacherSafeguarding />
            )}

            {currentPage === 'teacher-reports' && (
              <TeacherReports />
            )}

            {currentPage === 'teacher-messages' && (
              <TeacherMessages />
            )}

            {currentPage === 'teacher-settings' && (
              <TeacherSettings />
            )}

            {currentPage === 'safeguarding' && currentSubpage === 'overview' && (
              <SafeguardingOverview onPageChange={handlePageChange} />
            )}

            {currentPage === 'safeguarding' && currentSubpage !== 'overview' && (
              <SafeguardingSubpages subpage={currentSubpage} />
            )}

            {currentPage === 'school-users' && currentSubpage === 'teachers' && (
              <TeachersManagement />
            )}

            {currentPage === 'profile' && (
              <ProfilePage />
            )}

            {currentPage !== 'home' && 
             currentPage !== 'safeguarding' && 
             currentPage !== 'school-classes' && 
             currentPage !== 'school-requests' && 
             currentPage !== 'school-settings' && 
             currentPage !== 'school-users' && 
             currentPage !== 'profile' && 
             currentPage !== 'teacher-classes' &&
             currentPage !== 'teacher-lessons' &&
             currentPage !== 'teacher-assignments' &&
             currentPage !== 'teacher-safeguarding' &&
             currentPage !== 'teacher-reports' &&
             currentPage !== 'teacher-messages' &&
             currentPage !== 'teacher-settings' && 
             currentPage !== 'teacher-my-classroom' && (
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
