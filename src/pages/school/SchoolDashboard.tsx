import {
  Users,
  GraduationCap,
  Layers,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  BookOpen,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Clock,
  Home
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const stats = [
  {
    label: 'Total Teachers',
    value: '18',
    change: '+2 this term',
    trend: 'up',
    icon: Users,
    accent: 'blue',
  },
  {
    label: 'Total Students',
    value: '142',
    change: '+11 this month',
    trend: 'up',
    icon: GraduationCap,
    accent: 'green',
  },
  {
    label: 'Active Classes',
    value: '12',
    change: '4 grades covered',
    trend: 'neutral',
    icon: Layers,
    accent: 'purple',
  },
  {
    label: 'Safeguard Officers',
    value: '3',
    change: 'All active',
    trend: 'good',
    icon: ShieldCheck,
    accent: 'amber',
  },
];

const recentClasses = [
  { id: '1', grade: 'Year 6', division: 'Division A', teacher: 'Sarah Jenkins', studentsCount: 28, status: 'active' },
  { id: '2', grade: 'Year 5', division: 'Division B', teacher: 'David Miller',  studentsCount: 24, status: 'active' },
  { id: '3', grade: 'Year 6', division: 'Division B', teacher: 'Emma Watson',   studentsCount: 26, status: 'active' },
  { id: '4', grade: 'Year 4', division: 'Division A', teacher: 'James Wilson',  studentsCount: 22, status: 'active' },
  { id: '5', grade: 'Year 3', division: 'Division C', teacher: 'Grace Taylor',  studentsCount: 20, status: 'active' },
];

const upcomingSchedule = [
  { id: 's1', time: '09:00 AM', subject: 'Mathematics', teacher: 'Sarah Jenkins', grade: 'Year 6', status: 'live' },
  { id: 's2', time: '10:30 AM', subject: 'Science', teacher: 'David Miller', grade: 'Year 5', status: 'upcoming' },
  { id: 's3', time: '11:45 AM', subject: 'English Lit', teacher: 'Emma Watson', grade: 'Year 6', status: 'upcoming' },
  { id: 's4', time: '01:00 PM', subject: 'History', teacher: 'James Wilson', grade: 'Year 4', status: 'upcoming' },
];

const quickActions = [
  {
    label: 'Add New Teacher',
    desc: 'Create profile & assign to class',
    icon: UserPlus,
    accent: 'blue',
  },
  {
    label: 'Enroll New Student',
    desc: 'Register student & assign year group',
    icon: GraduationCap,
    accent: 'green',
  },
  {
    label: 'Setup Class & Division',
    desc: 'Define divisions, teacher & syllabus',
    icon: BookOpen,
    accent: 'purple',
  },
];

// ─── Accent colour helpers ────────────────────────────────────────────────────
const accentMap: Record<string, { icon: string; bg: string; pill: string }> = {
  blue:   { icon: 'var(--info-blue)',       bg: 'var(--info-blue-bg)',        pill: '#dbeafe' },
  green:  { icon: 'var(--accent-green)',    bg: 'var(--accent-green-bg)',     pill: '#dcfce7' },
  purple: { icon: 'var(--primary-purple)',  bg: 'var(--primary-purple-light)', pill: '#ede9fe' },
  amber:  { icon: 'var(--warning-orange)',  bg: 'var(--warning-orange-bg)',   pill: '#fef3c7' },
};

const statusMap: Record<string, { bar: string; bg: string; label: string }> = {
  live: { bar: 'var(--accent-green)', bg: 'var(--accent-green-bg)', label: 'Live' },
  upcoming: { bar: 'var(--info-blue)', bg: '#f8fafc', label: 'Upcoming' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function SchoolDashboard() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="sd-page">

      {/* ── Header Row ────────────────────────────────────────────── */}
      <div className="sd-topbar">
        <div>
          <h1 className="sd-title" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>

           <Home size={26} />
          School Dashboard</h1>
          <p className="sd-subtitle">{today}</p>
        </div>
      
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────── */}
      <div className="sd-kpi-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const c = accentMap[s.accent];
          return (
            <div key={i} className="sd-kpi-card">
              <div className="sd-kpi-icon" style={{ background: c.bg, color: c.icon }}>
                <Icon size={20} />
              </div>
              <div className="sd-kpi-body">
                <span className="sd-kpi-label">{s.label}</span>
                <span className="sd-kpi-value">{s.value}</span>
                <span className="sd-kpi-change" style={{ color: s.trend === 'up' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                  {s.trend === 'up' && <TrendingUp size={11} style={{ display: 'inline', marginRight: 3 }} />}
                  {s.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────── */}
      <div className="sd-section-card">
        <div className="sd-section-header">
          <span className="sd-section-title">Quick Actions</span>
        </div>
        <div className="sd-actions-grid">
          {quickActions.map((a, i) => {
            const Icon = a.icon;
            const c = accentMap[a.accent];
            return (
              <button key={i} className="sd-action-btn">
                <div className="sd-action-icon" style={{ background: c.pill, color: c.icon }}>
                  <Icon size={18} />
                </div>
                <div className="sd-action-text">
                  <span className="sd-action-label">{a.label}</span>
                  <span className="sd-action-desc">{a.desc}</span>
                </div>
                <ArrowRight size={16} className="sd-action-arrow" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Split ──────────────────────────────────────────── */}
      <div className="sd-split">

        {/* Active Classes Table */}
        <div className="sd-section-card sd-split-main">
          <div className="sd-section-header">
            <span className="sd-section-title">Active Classes</span>
            <button className="sd-link-btn">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="sd-table-wrapper">
            <table className="sd-table">
              <thead>
                <tr>
                  <th>Year Group</th>
                  <th>Division</th>
                  <th>Assigned Teacher</th>
                  <th>Students</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentClasses.map(cls => (
                  <tr key={cls.id} className="sd-table-row">
                    <td className="sd-table-strong">{cls.grade}</td>
                    <td>{cls.division}</td>
                    <td>
                      <div className="sd-teacher-cell">
                        <div className="sd-avatar">{cls.teacher.charAt(0)}</div>
                        {cls.teacher}
                      </div>
                    </td>
                    <td>
                      <span className="sd-pill sd-pill-blue">{cls.studentsCount} students</span>
                    </td>
                    <td>
                      <span className="sd-status-dot">
                        <CheckCircle2 size={13} style={{ color: 'var(--accent-green)' }} />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Schedule Feed */}
        <div className="sd-section-card sd-split-aside">
          <div className="sd-section-header">
            <span className="sd-section-title">Today's Schedule</span>
            <button className="sd-link-btn" style={{ color: 'var(--primary-purple)' }}>
              Full calendar <ChevronRight size={14} />
            </button>
          </div>
          <div className="sd-alert-feed">
            {upcomingSchedule.map(schedule => {
              const s = statusMap[schedule.status] || statusMap.upcoming;
              return (
                <div
                  key={schedule.id}
                  className="sd-alert-card"
                  style={{ borderLeftColor: s.bar, background: s.bg }}
                >
                  <div className="sd-alert-top">
                    <div className="sd-alert-icon" style={{ color: s.bar }}>
                      <Clock size={15} />
                    </div>
                    <div className="sd-alert-info">
                      <span className="sd-alert-student">{schedule.subject} - {schedule.grade}</span>
                      <span className="sd-alert-type">{schedule.teacher}</span>
                    </div>
                    <div className="sd-alert-meta">
                      <span className="sd-alert-time" style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem' }}>{schedule.time}</span>
                      <span className="sd-severity-badge" style={{ background: s.bar }}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
