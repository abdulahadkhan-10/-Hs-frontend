import { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  Plus, 
  GraduationCap, 
  Sparkles, 
  ClipboardList, 
  FileSpreadsheet, 
  BookOpen, 
  BookCheck, 
  HelpCircle as QuizIcon, 
  FileText, 
  Lightbulb, 
  Dumbbell
} from 'lucide-react';

export default function Home() {
  const [activeStep, setActiveStep] = useState(3); // Default step 3
  const [activeWeek, setActiveWeek] = useState(12);

  const steps = [
    { num: 1, label: 'Add Child', desc: 'Create profile' },
    { num: 2, label: 'Select Year', desc: 'Reception to Year 11' },
    { num: 3, label: 'Select Subjects', desc: 'Choose curriculum' },
    { num: 4, label: 'Learning Mode', desc: 'Full/Part-time' },
    { num: 5, label: 'Start Learning', desc: 'Begin 39-week journey' }
  ];

  const childrenData = [
    { name: 'Emma', year: 'Year 6', progress: 82, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80' },
    { name: 'Liam', year: 'Year 4', progress: 64, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80' },
    { name: 'Noah', year: 'Year 2', progress: 76, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80' }
  ];

  const lessons = [
    { time: '09:00', subject: 'Maths - Fractions', status: 'done' },
    { time: '10:00', subject: 'English - Reading Skills', status: 'done' },
    { time: '11:00', subject: 'Science - Plants', status: 'live' },
    { time: '13:00', subject: 'History - Ancient Egypt', status: 'upcoming' },
    { time: '14:30', subject: 'PE - Indoor Fitness', status: 'upcoming' }
  ];

  const weekTasks = [
    { title: 'Lesson Plan', desc: 'Understand objectives & plan', icon: BookOpen },
    { title: 'Lesson', desc: 'Video, slides & explanation', icon: Play },
    { title: 'Practice', desc: 'Questions & activities', icon: BookCheck },
    { title: 'Homework', desc: 'Tasks & assignments', icon: FileSpreadsheet },
    { title: 'Quiz', desc: 'Quick check', icon: QuizIcon },
    { title: 'Weekly Test', desc: 'Assess your learning', icon: ClipboardList },
    { title: 'PE Activity', desc: 'Stay active & healthy', icon: Dumbbell }
  ];

  return (
    <div>
      {/* 1. GET STARTED STEPPER */}
      <section className="get-started-box">
        <div className="stepper-header">
          <span>1. GET STARTED – CHOOSE YOUR CHILD'S LEARNING PATH</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Step {activeStep} of 5</span>
        </div>
        <div className="stepper-steps">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`stepper-step ${activeStep === s.num ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', textAlign: 'left', color: 'white', cursor: 'pointer' }}
            >
              <div className="step-circle">{s.num}</div>
              <div className="step-details">
                <span className="step-num">{s.desc}</span>
                <span className="step-label">{s.label}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. PARENT DASHBOARD MAIN GRID */}
      <div className="home-overview-grid">
        <div className="overview-main-col">
          {/* Dashboard Summary Numbers */}
          <div className="overview-summary-strip">
            <div className="summary-strip-card">
              <span className="strip-card-value">5</span>
              <span className="strip-card-label">Today's Lessons</span>
            </div>
            <div className="summary-strip-card">
              <span className="strip-card-value">3</span>
              <span className="strip-card-label">Completed</span>
            </div>
            <div className="summary-strip-card">
              <span className="strip-card-value">78%</span>
              <span className="strip-card-label">Practice Score</span>
            </div>
            <div className="summary-strip-card">
              <span className="strip-card-value">2h 15m</span>
              <span className="strip-card-label">Time Spent</span>
            </div>
            <div className="summary-strip-card">
              <span className="strip-card-value">2</span>
              <span className="strip-card-label">Upcoming Tests</span>
            </div>
          </div>

          {/* Children & Schedules cards split */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
            {/* Children Overview Card */}
            <div className="card-widget">
              <div className="panel-header-row">
                <h3 className="panel-title-text">Children Overview</h3>
                <button className="panel-view-all" style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={14} /> Add Child
                </button>
              </div>

              <div className="recent-checkins-list" style={{ marginTop: '12px' }}>
                {childrenData.map((child) => (
                  <div key={child.name} className="child-row">
                    <div className="child-avatar-info">
                      <img src={child.avatar} alt={child.name} className="child-avatar" />
                      <div className="child-name-yr">
                        <span className="child-name">{child.name}</span>
                        <span className="child-yr">{child.year}</span>
                      </div>
                    </div>
                    <div className="child-percentage-badge">{child.progress}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Schedule Card */}
            <div className="card-widget">
              <div className="panel-header-row">
                <h3 className="panel-title-text">Today's Schedule</h3>
                <span className="panel-view-all">Full Timetable →</span>
              </div>
              <div className="today-schedule-list" style={{ marginTop: '12px' }}>
                {lessons.map((lesson, idx) => (
                  <div key={idx} className="schedule-row">
                    <span className="schedule-time">{lesson.time}</span>
                    <span className="schedule-subj">{lesson.subject}</span>
                    <span className={`status-badge ${lesson.status}`}>{lesson.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Overview Trend Chart */}
          <div className="card-widget">
            <div className="panel-header-row">
              <h3 className="panel-title-text">Progress Overview</h3>
              <select style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            
            {/* Mock Chart Area */}
            <div className="chart-container-mock">
              {[60, 45, 80, 55, 70, 90, 85].map((val, idx) => (
                <div key={idx} className="chart-bar-mock" style={{ height: `${val}%` }}>
                  <div className="chart-bar-fill" style={{ height: '100%' }}></div>
                  <span className="chart-bar-label">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '28px', fontSize: '0.78rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#583fc0' }}></span> Maths: 82%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> English: 74%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span> Science: 78%
              </span>
            </div>
          </div>
        </div>

        {/* 39-WEEK CURRICULUM JOURNEY SIDEBAR */}
        <div className="curriculum-sidebar-card">
          <div className="panel-header-row" style={{ marginBottom: '8px' }}>
            <h3 className="panel-title-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} style={{ color: '#03684a' }} />
              39-Week Curriculum Journey
            </h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#475569' }}>Year 6 - Autumn Term - Week {activeWeek}</p>

          <div className="week-navigation-tabs">
            {[10, 11, 12, 13, 14].map((wk) => (
              <button
                key={wk}
                className={`week-tab ${activeWeek === wk ? 'active' : ''}`}
                onClick={() => setActiveWeek(wk)}
              >
                Wk {wk}
              </button>
            ))}
          </div>

          <div className="curriculum-week-list">
            {weekTasks.map((t, index) => {
              const Icon = t.icon;
              return (
                <div key={index} className="curriculum-week-item">
                  <div className="curriculum-item-left">
                    <div className="curr-item-icon-wrapper">
                      <Icon size={18} />
                    </div>
                    <div className="curr-item-text">
                      <span className="curr-item-title">{t.title}</span>
                      <span className="curr-item-desc">{t.desc}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </div>
              );
            })}
          </div>
          
          <button className="action-btn-outline" style={{ marginTop: '16px', borderColor: '#03684a', color: '#03684a', backgroundColor: '#ecfdf5' }}>
            View Full 39-Week Scheme →
          </button>
        </div>
      </div>

      {/* 3. BOTTOM KNOWLEDGE & UTILITY MODULES */}
      <h3 className="panel-title-text" style={{ marginTop: '32px', marginBottom: '16px' }}>Interactive Supporting Modules</h3>
      <div className="bottom-modules-grid">
        {/* Module 4 */}
        <div className="module-card">
          <div className="module-icon-container" style={{ backgroundColor: '#583fc0' }}>
            <BookOpen size={18} />
          </div>
          <span className="module-card-title">4. Learning Modules</span>
          <div className="module-step-flow">
            {['Learn & watch', 'Practice questions', 'Assess skills', 'Review reports', 'Master concepts'].map((step, i) => (
              <div key={i} className="module-step-item">
                <span className="module-step-bullet">{i+1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module 5 */}
        <div className="module-card">
          <div className="module-icon-container" style={{ backgroundColor: '#3b82f6' }}>
            <Sparkles size={18} />
          </div>
          <span className="module-card-title">5. AI Learning Support</span>
          <div className="module-step-flow">
            {['Ask AI Tutor', 'Generate Study Notes', 'Custom Practice', 'Identify Learning Gaps'].map((step, i) => (
              <div key={i} className="module-step-item">
                <span className="module-step-bullet">★</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module 6 */}
        <div className="module-card">
          <div className="module-icon-container" style={{ backgroundColor: '#f59e0b' }}>
            <FileText size={18} />
          </div>
          <span className="module-card-title">6. Parent Tools & Reports</span>
          <div className="module-step-flow">
            {['Detailed Progress', 'Attendance tracker', 'Evidence Portfolio', 'Weekly Summaries'].map((step, i) => (
              <div key={i} className="module-step-item">
                <span className="module-step-bullet">✓</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module 7 */}
        <div className="module-card">
          <div className="module-icon-container" style={{ backgroundColor: '#10b981' }}>
            <Lightbulb size={18} />
          </div>
          <span className="module-card-title">7. Resources Hub</span>
          <div className="module-step-flow">
            {['Printable Worksheets', 'Curriculum Videos', 'Digital E-Books', 'SATs Revision Packs'].map((step, i) => (
              <div key={i} className="module-step-item">
                <span className="module-step-bullet">📂</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
