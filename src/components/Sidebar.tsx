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

interface SidebarProps {
  currentPage: string;
  currentSubpage: string;
  onPageChange: (page: string, subpage?: string) => void;
}

export default function Sidebar({ currentPage, currentSubpage, onPageChange }: SidebarProps) {
  const [safeguardingOpen, setSafeguardingOpen] = useState(currentPage === 'safeguarding');

  const handleSafeguardingClick = () => {
    setSafeguardingOpen(!safeguardingOpen);
    onPageChange('safeguarding', 'overview');
  };

  const navItems = [
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
          <span className="brand-name">ILMEE</span>
          <span className="brand-sub">AI-Powered British<br/> Curriculum Portal</span>
        </div>
      </div>

      {/* Navigation List */}
      <ul className="sidebar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <li key={item.id} className="menu-item-wrapper">
              <button
                onClick={() => onPageChange(item.id)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
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
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
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
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('safeguarding', 'wellbeing')}
                  className={`submenu-link ${currentSubpage === 'wellbeing' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  Wellbeing Check-ins
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('safeguarding', 'concern-log')}
                  className={`submenu-link ${currentSubpage === 'concern-log' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  Concern Log
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('safeguarding', 'support')}
                  className={`submenu-link ${currentSubpage === 'support' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                >
                  Support & Guidance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('safeguarding', 'policies')}
                  className={`submenu-link ${currentSubpage === 'policies' ? 'active' : ''}`}
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
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
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </li>
      </ul>

      {/* Emergency Helpline Card */}
      <div className="sidebar-help-card">
        <div className="help-card-icon">
          <HelpCircle size={18} />
        </div>
        <div className="help-card-title">Need Help?</div>
        <div className="help-card-text">Safeguarding Helpline</div>
        <a href="tel:02079460958" className="help-card-number">020 7946 0958</a>
        <div className="help-card-extra">Out of hours: 999</div>
      </div>
    </aside>
  );
}
