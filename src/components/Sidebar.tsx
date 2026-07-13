import { useState } from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  Book, 
  FileText, 
  Award, 
  TrendingUp, 
  BarChart2, 
  FolderOpen, 
  MessageSquare, 
  ShieldCheck, 
  Settings, 
  ChevronRight, 
  HelpCircle
} from 'lucide-react';

import { Layers, FileCheck } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  currentSubpage: string;
  onPageChange: (page: string, subpage?: string) => void;
  userRole?: string;
}

export default function Sidebar({ currentPage, currentSubpage, onPageChange, userRole }: SidebarProps) {
  const [safeguardingOpen, setSafeguardingOpen] = useState(currentPage === 'safeguarding');
  const [schoolUsersOpen, setSchoolUsersOpen] = useState(currentPage === 'school-users');

  const handleSafeguardingClick = () => {
    setSafeguardingOpen(!safeguardingOpen);
    onPageChange('safeguarding', 'overview');
  };

  const handleSchoolUsersClick = () => {
    setSchoolUsersOpen(!schoolUsersOpen);
    onPageChange('school-users', 'teachers');
  };

  const isSchool = userRole === 'SCHOOL';

  // Default menu items for standard users (Parents/Students)
  const defaultNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'my-children', label: 'My Children', icon: Users },
    { id: 'my-learning', label: 'My Learning', icon: BookOpen },
    { id: 'timetable', label: 'Timetable & Planner', icon: Calendar },
    { id: 'subjects', label: 'Subjects', icon: Book },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'assessments', label: 'Assessments', icon: Award },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'resources', label: 'Resources', icon: FolderOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Section */}
      <div className="brand-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'contain' }} />
        <div className="brand-title-group">
          <span className="brand-name">LSA</span>
          <span className="brand-sub">AI-Powered<br/> Curriculum Portal</span>
        </div>
      </div>

      {/* Navigation List */}
      <ul className="sidebar-menu">
        {!isSchool ? (
          <>
            {defaultNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id} className="menu-item-wrapper">
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}

            {/* Safeguarding Dropdown Menu */}
            <li className="menu-item-wrapper">
              <button
                onClick={handleSafeguardingClick}
                className={`sidebar-link ${currentPage === 'safeguarding' ? 'active' : ''} ${safeguardingOpen ? 'open' : ''}`}
              >
                <ShieldCheck size={18} />
                <span>Safeguarding</span>
                <ChevronRight size={14} className="chevron" />
              </button>
              
              {safeguardingOpen && (
                <ul className="submenu-list">
                  <li>
                    <button
                      onClick={() => onPageChange('safeguarding', 'overview')}
                      className={`submenu-link ${currentSubpage === 'overview' ? 'active' : ''}`}
                    >
                      Overview
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onPageChange('safeguarding', 'wellbeing')}
                      className={`submenu-link ${currentSubpage === 'wellbeing' ? 'active' : ''}`}
                    >
                      Wellbeing Check-ins
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onPageChange('safeguarding', 'concern-log')}
                      className={`submenu-link ${currentSubpage === 'concern-log' ? 'active' : ''}`}
                    >
                      Concern Log
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onPageChange('safeguarding', 'support')}
                      className={`submenu-link ${currentSubpage === 'support' ? 'active' : ''}`}
                    >
                      Support & Guidance
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onPageChange('safeguarding', 'policies')}
                      className={`submenu-link ${currentSubpage === 'policies' ? 'active' : ''}`}
                    >
                      Policies
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Settings */}
            <li className="menu-item-wrapper">
              <button
                onClick={() => onPageChange('settings')}
                className={`sidebar-link ${currentPage === 'settings' ? 'active' : ''}`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </li>
          </>
        ) : (
          <>
            {/* School Dashboard Link */}
            <li className="menu-item-wrapper">
              <button
                onClick={() => onPageChange('home')}
                className={`sidebar-link ${currentPage === 'home' ? 'active' : ''}`}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </button>
            </li>

            {/* School User Management Dropdown */}
            <li className="menu-item-wrapper">
              <button
                onClick={handleSchoolUsersClick}
                className={`sidebar-link ${currentPage === 'school-users' ? 'active' : ''} ${schoolUsersOpen ? 'open' : ''}`}
              >
                <Users size={18} />
                <span>User Management</span>
                <ChevronRight size={14} className="chevron" />
              </button>
              
              {schoolUsersOpen && (
                <ul className="submenu-list">
                  <li>
                    <button
                      onClick={() => onPageChange('school-users', 'teachers')}
                      className={`submenu-link ${currentSubpage === 'teachers' ? 'active' : ''}`}
                    >
                      Teachers
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onPageChange('school-users', 'students')}
                      className={`submenu-link ${currentSubpage === 'students' ? 'active' : ''}`}
                    >
                      Students
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onPageChange('school-users', 'safeguards')}
                      className={`submenu-link ${currentSubpage === 'safeguards' ? 'active' : ''}`}
                    >
                      Safeguards
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Classes Link */}
            <li className="menu-item-wrapper">
              <button
                onClick={() => onPageChange('school-classes')}
                className={`sidebar-link ${currentPage === 'school-classes' ? 'active' : ''}`}
              >
                <Layers size={18} />
                <span>Classes</span>
              </button>
            </li>

            {/* Admin Requests Link */}
            <li className="menu-item-wrapper">
              <button
                onClick={() => onPageChange('school-requests')}
                className={`sidebar-link ${currentPage === 'school-requests' ? 'active' : ''}`}
              >
                <FileCheck size={18} />
                <span>Admin Requests</span>
              </button>
            </li>

            {/* School Settings Link */}
            <li className="menu-item-wrapper">
              <button
                onClick={() => onPageChange('school-settings')}
                className={`sidebar-link ${currentPage === 'school-settings' ? 'active' : ''}`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Bottom Actions */}
      <div className="sidebar-bottom-actions" style={{ marginTop: 'auto', paddingTop: '20px', paddingBottom: '10px' }}>
        <button 
          className="sd-pill-btn" 
          style={{ width: '100%', marginBottom: '16px', background: 'var(--sg-yellow)', color: '#5a4000', border: 'none', padding: '12px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => window.location.href='tel:02079460958'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Safeguarding Helpline
        </button>
        
        <button className="sidebar-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', opacity: 0.8 }}>
          <HelpCircle size={18} />
          <span>Support</span>
        </button>
        
        <button 
          className="sidebar-link" 
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', opacity: 0.8 }}
          onClick={() => window.location.href='/login'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
