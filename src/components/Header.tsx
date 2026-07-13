import { useState } from 'react';
import { Bell, Search, HelpCircle, ChevronDown, User, LogOut } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  currentSubpage: string;
  onLogout: () => void;
  onProfileClick: () => void;
  selectedChild: string;
  setSelectedChild: (child: string) => void;
  loggedInUser: string;
}

export default function Header({ 
  currentPage, 
  currentSubpage, 
  onLogout,
  onProfileClick,
  selectedChild,
  setSelectedChild,
  loggedInUser
}: HeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showChildDropdown, setShowChildDropdown] = useState(false);

  // Format Page Title
  const getPageTitle = () => {
    switch (currentPage) {
      case 'home': return 'Home Learning Hub';
      case 'my-children': return 'My Children Profiles';
      case 'my-learning': return 'My Learning & Lessons';
      case 'timetable': return 'Timetable & Planner';
      case 'subjects': return 'Subjects & Curriculum';
      case 'assignments': return 'Assignments & Homework';
      case 'assessments': return 'Assessments & Quizzes';
      case 'progress': return 'Student Progress Overview';
      case 'reports': return 'Reports & Insights';
      case 'resources': return 'Resources Hub';
      case 'messages': return 'Messages & Communication';
      case 'settings': return 'Account Settings';
      case 'safeguarding':
        return `Safeguarding & Child Protection - ${currentSubpage.charAt(0).toUpperCase() + currentSubpage.slice(1)}`;
      default: return 'Homeschool Portal';
    }
  };

  return (
    <header className="app-header">
      {/* Breadcrumb Selector */}
      <div className="header-left">
        <div className="position-relative">
          <button 
            className="breadcrumb-select-trigger"
            onClick={() => setShowChildDropdown(!showChildDropdown)}
          >
            <span>{getPageTitle()}</span>
            <ChevronDown size={14} />
          </button>

          {showChildDropdown && (
            <div 
              style={{
                position: 'absolute',
                top: '40px',
                left: '0',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                zIndex: 100,
                width: '200px',
                padding: '6px 0'
              }}
            >
              {['All Children', 'Emma - Year 6', 'Liam - Year 4', 'Noah - Year 2'].map((child) => (
                <button
                  key={child}
                  onClick={() => {
                    setSelectedChild(child);
                    setShowChildDropdown(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 16px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.85rem',
                    color: selectedChild === child ? '#583fc0' : '#475569',
                    fontWeight: selectedChild === child ? '600' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {child}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="header-right">
        {/* Search */}
        <button className="icon-btn">
          <Search size={18} />
        </button>

        {/* Notifications */}
        <div className="icon-btn-badge-wrapper">
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <span className="badge-dot"></span>
        </div>

        {/* Support */}
        <button className="icon-btn">
          <HelpCircle size={18} />
        </button>

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button 
            className="header-user-profile" 
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" 
              alt="Emma Johnson" 
              className="user-avatar"
            />
            <div className="user-info-text">
              <span className="user-name">{loggedInUser}</span>
              <span className="user-role">Parent</span>
            </div>
            <ChevronDown size={14} style={{ color: '#94a3b8', marginLeft: '4px' }} />
          </button>

          {showUserDropdown && (
            <div 
              style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                zIndex: 100,
                width: '160px',
                padding: '6px 0'
              }}
            >
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onProfileClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 16px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.85rem',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <User size={16} />
                Profile
              </button>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 16px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.85rem',
                  color: '#ef4444',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
