import { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  FileText, 
  AlertTriangle, 
  Plus, 
  CheckSquare, 
  ShieldAlert, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetSchoolClassesQuery } from '../../store/api/teacherApi';

interface TeacherDashboardProps {
  onNavigate: (page: string, subpage?: string) => void;
}

export default function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const teacherName = user?.profile?.name || 'Educator';
  const schoolName = user?.profile?.school?.schoolName || 'LSA Partner School';
  
  const schoolId = user?.profile?.schoolId || '';
  const { data: classesData } = useGetSchoolClassesQuery(schoolId, {
    skip: !schoolId,
  });

  // State for mock interaction
  const [quickAlertText, setQuickAlertText] = useState('');
  const [selectedStudentAlert, setSelectedStudentAlert] = useState('Liam - Year 4');
  const [wellbeingCheckins] = useState([
    { id: 1, name: 'Emma Watson', class: 'Year 6 - A', mood: '😊 Great', score: 5, time: '10 mins ago', comment: 'Loved the science experiment!' },
    { id: 2, name: 'Liam Neeson', class: 'Year 4 - B', mood: '😐 Neutral', score: 3, time: '1 hour ago', comment: 'Found the math homework a bit hard.' },
    { id: 3, name: 'Noah Ark', class: 'Year 2 - A', mood: '😢 Unhappy', score: 1, time: '2 hours ago', comment: 'Lost my lunchbox today.' }
  ]);

  const defaultClasses = [
    { name: 'Year 6 - Division A', subject: 'Mathematics & Science', studentsCount: 28, room: 'Room 102' },
    { name: 'Year 4 - Division B', subject: 'English & Art', studentsCount: 24, room: 'Room 205' },
    { name: 'Year 2 - Division A', subject: 'General Primary Curriculum', studentsCount: 22, room: 'Room 101' }
  ];

  const schoolClasses = classesData?.classes || [];
  const activeClasses = schoolClasses.length > 0 
    ? schoolClasses.map((cls: any) => ({
        name: `${cls.grade} - Division ${cls.division}`,
        subject: 'Core School Curriculum',
        studentsCount: cls.students?.length || 0,
        room: `Room ${Math.floor(Math.random() * 80) + 101}`
      }))
    : defaultClasses;

  const totalClassesCount = schoolClasses.length > 0 ? schoolClasses.length : 3;
  const totalStudentsCount = schoolClasses.length > 0 
    ? schoolClasses.reduce((sum: number, cls: any) => sum + (cls.students?.length || 0), 0)
    : 74;

  return (
    <div className="teacher-dashboard-wrapper">
      <style>{`
        .teacher-dashboard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .welcome-hero {
          background: linear-gradient(135deg, #c06d48 0%, #a65b39 100%);
          border-radius: 16px;
          padding: 28px 32px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(192, 109, 72, 0.25);
        }

        .welcome-hero::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
          right: -50px;
          top: -50px;
          pointer-events: none;
        }

        .welcome-hero h1 {
          font-size: 26px;
          font-weight: 700;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }

        .welcome-hero p {
          margin: 0;
          opacity: 0.9;
          font-size: 14.5px;
          font-weight: 400;
        }

        .teacher-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .stat-card-premium {
          background: white;
          border-radius: 14px;
          padding: 20px;
          border: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
        }

        .stat-card-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px -8px rgba(0,0,0,0.08);
        }

        .stat-card-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-card-label {
          font-size: 13.5px;
          font-weight: 500;
          color: #64748b;
        }

        .stat-card-value {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
        }

        .stat-card-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .accent-amber { background: #fffbeb; color: #c06d48; }
        .accent-blue { background: #eff6ff; color: #2563eb; }
        .accent-emerald { background: #ecfdf5; color: #059669; }
        .accent-rose { background: #fff1f2; color: #e11d48; }

        .dashboard-main-columns {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-main-columns {
            grid-template-columns: 1fr;
          }
        }

        .card-widget-premium {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px solid #f8fafc;
          padding-bottom: 12px;
        }

        .widget-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .widget-action-btn {
          font-size: 12.5px;
          font-weight: 600;
          color: #c06d48;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.15s;
        }

        .widget-action-btn:hover {
          color: #a65b39;
        }

        /* Class row styling */
        .class-strip-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .class-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-radius: 10px;
          background: #fafaf9;
          border: 1px solid #f3f3f0;
          transition: background 0.15s, border-color 0.15s;
          cursor: pointer;
        }

        .class-strip:hover {
          background: #fdfaf7;
          border-color: #ffd8c4;
        }

        .class-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .class-name {
          font-size: 14.5px;
          font-weight: 600;
          color: #1c1917;
        }

        .class-meta {
          font-size: 12px;
          color: #78716c;
        }

        .class-badge {
          font-size: 12.5px;
          font-weight: 500;
          color: #a65b39;
          background: #ffebd2;
          padding: 4px 10px;
          border-radius: 20px;
        }

        /* Checkin Row */
        .checkin-row-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
          background: #fff;
          transition: transform 0.15s;
        }

        .checkin-row-item:hover {
          transform: translateX(2px);
        }

        .checkin-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .student-meta {
          display: flex;
          flex-direction: column;
        }

        .student-name {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        .student-class {
          font-size: 11.5px;
          color: #64748b;
        }

        .mood-badge {
          font-size: 12.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .mood-great { background: #ecfdf5; color: #047857; }
        .mood-neutral { background: #f8fafc; color: #475569; }
        .mood-unhappy { background: #fff1f2; color: #b91c1c; }

        .checkin-comment {
          font-size: 12.5px;
          color: #475569;
          font-style: italic;
          background: #f8fafc;
          padding: 8px 12px;
          border-radius: 8px;
          margin: 0;
        }

        .checkin-footer {
          font-size: 11px;
          color: #94a3b8;
          text-align: right;
        }

        /* Quick Action Panel Form */
        .action-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-select {
          width: 100%;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 13.5px;
          outline: none;
          background-color: white;
        }

        .action-select:focus {
          border-color: #c06d48;
        }

        .action-textarea {
          width: 100%;
          height: 72px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 13.5px;
          outline: none;
          resize: none;
          font-family: inherit;
        }

        .action-textarea:focus {
          border-color: #c06d48;
        }

        .action-btn-primary {
          background: #c06d48;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.15s;
        }

        .action-btn-primary:hover {
          background: #a65b39;
        }

        /* Chart mock */
        .curriculum-progress-mock {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 6px;
        }

        .progress-indicator-bar {
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-indicator-fill {
          height: 100%;
          background: linear-gradient(90deg, #c06d48, #e0916c);
          border-radius: 4px;
        }
      `}</style>

      {/* Hero Welcome banner */}
      <div className="welcome-hero">
        <h1>Welcome back, {teacherName}!</h1>
        <p>{schoolName} &middot; Classroom & Student Management System</p>
      </div>

      {/* Statistics Row */}
      <div className="teacher-stats-grid">
        <div className="stat-card-premium" onClick={() => onNavigate('teacher-classes')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-left">
            <span className="stat-card-label">My Classes</span>
            <span className="stat-card-value">{totalClassesCount}</span>
          </div>
          <div className="stat-card-icon-wrap accent-amber">
            <Users size={20} />
          </div>
        </div>

        <div className="stat-card-premium" onClick={() => onNavigate('teacher-classes')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-left">
            <span className="stat-card-label">Active Students</span>
            <span className="stat-card-value">{totalStudentsCount}</span>
          </div>
          <div className="stat-card-icon-wrap accent-blue">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="stat-card-premium" onClick={() => onNavigate('teacher-assignments')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-left">
            <span className="stat-card-label">Awaiting Grading</span>
            <span className="stat-card-value">14</span>
          </div>
          <div className="stat-card-icon-wrap accent-emerald">
            <FileText size={20} />
          </div>
        </div>

        <div className="stat-card-premium" onClick={() => onNavigate('teacher-safeguarding')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-left">
            <span className="stat-card-label">Safeguarding Issues</span>
            <span className="stat-card-value">2</span>
          </div>
          <div className="stat-card-icon-wrap accent-rose">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-main-columns">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Active Classes list */}
          <div className="card-widget-premium">
            <div className="widget-header">
              <h3 className="widget-title">
                <Users size={18} style={{ color: '#c06d48' }} />
                My Active Classrooms
              </h3>
              <button className="widget-action-btn" onClick={() => onNavigate('teacher-classes')}>View All Classes &rarr;</button>
            </div>
            
            <div className="class-strip-list">
              {activeClasses.map((cls) => (
                <div key={cls.name} className="class-strip" onClick={() => onNavigate('teacher-classes')}>
                  <div className="class-details">
                    <span className="class-name">{cls.name}</span>
                    <span className="class-meta">{cls.subject} &middot; Room: {cls.room}</span>
                  </div>
                  <span className="class-badge">{cls.studentsCount} Students</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wellbeing Check-ins Widget */}
          <div className="card-widget-premium">
            <div className="widget-header">
              <h3 className="widget-title">
                <Sparkles size={18} style={{ color: '#2563eb' }} />
                Recent Student Wellbeing Check-ins
              </h3>
              <button className="widget-action-btn" onClick={() => onNavigate('teacher-reports')}>Performance Analytics &rarr;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {wellbeingCheckins.map((chk) => (
                <div key={chk.id} className="checkin-row-item">
                  <div className="checkin-top">
                    <div className="student-meta">
                      <span className="student-name">{chk.name}</span>
                      <span className="student-class">{chk.class} &middot; {chk.time}</span>
                    </div>
                    <span className={`mood-badge ${
                      chk.score >= 4 ? 'mood-great' : chk.score === 3 ? 'mood-neutral' : 'mood-unhappy'
                    }`}>
                      {chk.mood}
                    </span>
                  </div>
                  <p className="checkin-comment">"{chk.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Quick Actions Portal */}
          <div className="card-widget-premium" style={{ borderLeft: '4px solid #c06d48' }}>
            <div className="widget-header">
              <h3 className="widget-title">
                <Plus size={18} style={{ color: '#c06d48' }} />
                Quick Actions
              </h3>
            </div>

            <div className="action-form">
              <button className="action-btn-primary" style={{ background: '#f59e0b' }} onClick={() => onNavigate('teacher-lessons')}>
                <CheckSquare size={16} /> Mark Class Attendance
              </button>
              
              <button className="action-btn-primary" onClick={() => onNavigate('teacher-assignments')}>
                <Plus size={16} /> Add New Assignment
              </button>

              <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #f1f5f9' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569' }}>Log Safeguarding Concern</label>
                <select 
                  className="action-select" 
                  value={selectedStudentAlert} 
                  onChange={(e) => setSelectedStudentAlert(e.target.value)}
                >
                  <option>Liam Neeson - Year 4</option>
                  <option>Emma Watson - Year 6</option>
                  <option>Noah Ark - Year 2</option>
                </select>
                <textarea 
                  className="action-textarea" 
                  placeholder="Describe safeguarding or behavior concern..."
                  value={quickAlertText}
                  onChange={(e) => setQuickAlertText(e.target.value)}
                />
                <button 
                  className="action-btn-primary" 
                  style={{ background: '#e11d48' }}
                  onClick={() => {
                    if (!quickAlertText) return;
                    alert('Safeguarding concern logged successfully and Safeguarding Officer notified.');
                    setQuickAlertText('');
                  }}
                >
                  <ShieldAlert size={16} /> Submit Concern Log
                </button>
              </div>
            </div>
          </div>

          {/* Curriculum scheme progress */}
          <div className="card-widget-premium">
            <div className="widget-header">
              <h3 className="widget-title">
                <Calendar size={18} style={{ color: '#059669' }} />
                Curriculum Progression
              </h3>
            </div>
            
            <div className="curriculum-progress-mock">
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Year 6 Mathematics</span>
                <span style={{ fontWeight: 600, color: '#059669' }}>68% Covered</span>
              </div>
              <div className="progress-indicator-bar">
                <div className="progress-indicator-fill" style={{ width: '68%', background: '#059669' }} />
              </div>
            </div>

            <div className="curriculum-progress-mock">
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Year 4 English Lit</span>
                <span style={{ fontWeight: 600, color: '#c06d48' }}>48% Covered</span>
              </div>
              <div className="progress-indicator-bar">
                <div className="progress-indicator-fill" style={{ width: '48%', background: '#c06d48' }} />
              </div>
            </div>

            <div className="curriculum-progress-mock">
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Year 2 Science</span>
                <span style={{ fontWeight: 600, color: '#2563eb' }}>82% Covered</span>
              </div>
              <div className="progress-indicator-bar">
                <div className="progress-indicator-fill" style={{ width: '82%', background: '#2563eb' }} />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
