import { useState } from 'react';
import { 
  FolderOpen, 
  Volume2,
  Play,
  Plus
} from 'lucide-react';

interface OtherPagesProps {
  pageId: string;
}

export default function OtherPages({ pageId }: OtherPagesProps) {
  const [selectedYear, setSelectedYear] = useState('Year 6');
  const [activeTab, setActiveTab] = useState('practice');
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  // 1. My Children
  if (pageId === 'my-children') {
    return (
      <div className="card-widget">
        <div className="panel-header-row">
          <h3 className="panel-title-text">My Children Profiles</h3>
          <button className="action-btn-outline" style={{ width: 'auto', padding: '6px 14px' }}><Plus size={14} /> Add child</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '16px' }}>
          {[
            { name: 'Emma Johnson', year: 'Year 6 (Key Stage 2)', progress: '82%', lessons: 5, time: '12h 40m', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
            { name: 'Liam Johnson', year: 'Year 4 (Key Stage 2)', progress: '64%', lessons: 3, time: '8h 20m', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
            { name: 'Noah Johnson', year: 'Year 2 (Key Stage 1)', progress: '76%', lessons: 4, time: '10h 15m', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' }
          ].map((child) => (
            <div key={child.name} className="child-row" style={{ flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '12px', textAlign: 'center' }}>
              <img src={child.img} alt={child.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{child.name}</h4>
                <span style={{ fontSize: '0.78rem', color: '#475569' }}>{child.year}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', fontSize: '0.74rem', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <div><strong>{child.progress}</strong><br /><span style={{ color: '#94a3b8' }}>Progress</span></div>
                <div><strong>{child.lessons}</strong><br /><span style={{ color: '#94a3b8' }}>Lessons</span></div>
                <div><strong>{child.time}</strong><br /><span style={{ color: '#94a3b8' }}>Study Time</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. My Learning
  if (pageId === 'my-learning') {
    return (
      <div className="home-overview-grid">
        <div className="overview-main-col">
          <div className="card-widget">
            <h3 className="panel-title-text" style={{ marginBottom: '12px' }}>Active Lesson: Year 6 – Autumn Term</h3>
            
            {/* Mock video player */}
            <div style={{
              width: '100%', height: '240px', backgroundColor: '#022c22', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              color: 'white', position: 'relative', overflow: 'hidden'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Fractions</span>
              <p style={{ fontSize: '0.82rem', opacity: 0.8 }}>Understanding Parts of a Whole</p>
              <div style={{
                position: 'absolute', bottom: '16px', left: '16px', right: '16px',
                display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem'
              }}>
                <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>0:00 / 12:45</span>
                <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}>
                  <div style={{ width: '0%', height: '100%', backgroundColor: 'var(--accent-green)' }}></div>
                </div>
                <Volume2 size={16} />
              </div>
              <button style={{
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'white', color: '#022c22',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}>
                <Play size={20} fill="#022c22" />
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>
                {['Content', 'Notes', 'Resources'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    style={{
                      background: 'none', border: 'none', padding: '6px 12px', cursor: 'pointer',
                      fontWeight: 'bold', fontSize: '0.8rem',
                      color: activeTab === tab.toLowerCase() ? '#583fc0' : '#64748b',
                      borderBottom: activeTab === tab.toLowerCase() ? '2px solid #583fc0' : 'none'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'content' && (
                <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                  <h4>Introduction to Fractions</h4>
                  <p>A fraction represents a part of a whole or, more generally, any number of equal parts. When spoken in everyday English, a fraction describes how many parts of a certain size there are, for example, one-half, eight-fifths, three-quarters.</p>
                </div>
              )}
              {activeTab === 'notes' && (
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  <ul style={{ paddingLeft: '16px' }}>
                    <li>Numerator: The top number, represents how many parts we have.</li>
                    <li>Denominator: The bottom number, represents total parts in a whole.</li>
                    <li>Always simplify fractions to their lowest terms.</li>
                  </ul>
                </div>
              )}
              {activeTab === 'resources' && (
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  <a href="#worksheets" style={{ color: 'var(--primary-purple)', textDecoration: 'none' }}>Download Fractions Worksheet (PDF) →</a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Index */}
        <div className="curriculum-sidebar-card">
          <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '12px' }}>Lesson Modules</h4>
          <div className="curriculum-week-list">
            {[
              { num: '1', title: 'Introduction to Fractions', status: 'done' },
              { num: '2', title: 'Equivalent Fractions', status: 'done' },
              { num: '3', title: 'Improper Fractions & Mixed Numbers', status: 'active' },
              { num: '4', title: 'Adding & Subtracting Fractions', status: 'pending' },
              { num: '5', title: 'Multiplying Fractions', status: 'pending' }
            ].map((mod) => (
              <div key={mod.num} className="curriculum-week-item" style={{
                backgroundColor: mod.status === 'active' ? 'var(--primary-purple-light)' : 'transparent',
                borderColor: mod.status === 'active' ? 'var(--primary-purple)' : '#e2e8f0'
              }}>
                <div className="curriculum-item-left">
                  <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>{mod.num}. {mod.title}</span>
                </div>
                <span className={`status-badge ${mod.status === 'done' ? 'done' : mod.status === 'active' ? 'live' : 'upcoming'}`}>
                  {mod.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Timetable
  if (pageId === 'timetable') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Timetable & Weekly Planner</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: '8px' }}>
          {/* Header Row */}
          <div>Time</div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => <div key={day} style={{ fontWeight: 'bold', textAlign: 'center' }}>{day}</div>)}

          {/* Time Slot 1 */}
          <div style={{ fontWeight: 'bold' }}>09:00 - 10:00</div>
          {['Maths', 'English', 'Maths', 'Science', 'Maths'].map((s, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
              {s}
            </div>
          ))}

          {/* Time Slot 2 */}
          <div style={{ fontWeight: 'bold' }}>10:30 - 11:30</div>
          {['English', 'Science', 'English', 'History', 'English'].map((s, idx) => (
            <div key={idx} style={{ backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
              {s}
            </div>
          ))}

          {/* Time Slot 3 */}
          <div style={{ fontWeight: 'bold' }}>13:00 - 14:00</div>
          {['History', 'Art', 'Geography', 'Computing', 'PE'].map((s, idx) => (
            <div key={idx} style={{ backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Subjects
  if (pageId === 'subjects') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text">Subjects Directory</h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>Explore national curriculum subjects customized for Key Stages.</p>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              style={{
                padding: '6px 12px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '0.76rem', fontWeight: '600',
                backgroundColor: selectedYear === yr ? '#583fc0' : 'white',
                color: selectedYear === yr ? 'white' : '#64748b',
                cursor: 'pointer'
              }}
            >
              {yr}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { title: 'Mathematics', desc: 'Fractions, Decimals, Algebra, Geometry' },
            { title: 'English', desc: 'Grammar, Reading comprehension, Spelling' },
            { title: 'Science', desc: 'Chemistry, Physics, Biology forces' },
            { title: 'History', desc: 'Tudors, Romans, Ancient World Wars' },
            { title: 'Geography', desc: 'Climate change, Rivers, Mapping' },
            { title: 'Computing', desc: 'Algorithms, Python coding, HTML Basics' },
            { title: 'Art & Design', desc: 'Drawing, Painting techniques, Modelling' },
            { title: 'PE & Health', desc: 'Stretches, Cardiovascular health' }
          ].map((subj) => (
            <div key={subj.title} className="module-card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{subj.title}</h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b' }}>{subj.desc}</p>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary-purple)', fontWeight: 'bold', marginTop: 'auto' }}>View Lessons →</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. Assignments
  if (pageId === 'assignments') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Homework & Assignments</h3>
        <div className="recent-checkins-list">
          {[
            { title: 'Mathematics Worksheet - Fractions', due: '12 June 2026', subject: 'Maths', status: 'Pending' },
            { title: 'English Reading Comprehension Log', due: '14 June 2026', subject: 'English', status: 'Pending' },
            { title: 'Science Lab Report - Plants', due: '09 June 2026', subject: 'Science', status: 'Completed' },
            { title: 'History Investigation - Ancient Egypt', due: '04 June 2026', subject: 'History', status: 'Completed' }
          ].map((item, idx) => (
            <div key={idx} className="checkin-row-item">
              <div>
                <strong style={{ fontSize: '0.85rem' }}>{item.title}</strong>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Subject: {item.subject} • Due: {item.due}</div>
              </div>
              <span className={`status-badge ${item.status === 'Completed' ? 'done' : 'upcoming'}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Assessments
  if (pageId === 'assessments') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text">Assessments & Quizzes</h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>Test learning outcomes based on Key Stage curriculum guidelines.</p>

        <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: 'var(--bg-portal)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>Q1. What fraction of the shape is shaded?</h4>
          
          {/* Mock visual shape */}
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(var(--primary-purple) 0% 25%, #fff 25% 100%)', border: '2px solid #e2e8f0', margin: '20px auto' }}></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
            {['1/2', '1/3', '1/4', '2/3'].map((ans) => (
              <button
                key={ans}
                onClick={() => setQuizAnswer(ans)}
                style={{
                  padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '600',
                  backgroundColor: quizAnswer === ans ? 'var(--primary-purple)' : 'white',
                  color: quizAnswer === ans ? 'white' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                Option: {ans}
              </button>
            ))}
          </div>

          {quizAnswer && (
            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: quizAnswer === '1/4' ? 'var(--accent-green)' : 'var(--danger-red)', fontWeight: 'bold', textAlign: 'center' }}>
              {quizAnswer === '1/4' ? '✓ Correct Answer!' : '✗ Try again! Hint: 1 piece out of 4 is colored.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 7. Progress
  if (pageId === 'progress') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Student Progress Overview</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { subject: 'Mathematics', score: 82, color: 'var(--primary-purple)' },
            { subject: 'English Reading & Writing', score: 74, color: 'var(--accent-green)' },
            { subject: 'Science', score: 78, color: 'var(--info-blue)' },
            { subject: 'History & Civics', score: 68, color: 'var(--warning-orange)' }
          ].map((item) => (
            <div key={item.subject}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '6px' }}>
                <span>{item.subject}</span>
                <span>{item.score}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${item.score}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. Reports
  if (pageId === 'reports') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Term Reports & Insights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { term: 'Autumn Term 2025 Report', date: 'Published: Dec 2025', desc: 'Emma has shown exceptional performance in Fractions and Spelling. Science requires regular worksheets check.' },
            { term: 'Summer Term 2025 Report', date: 'Published: Jul 2025', desc: 'Liam completed all KS1 primary transition units with good feedback on physical activity checks.' }
          ].map((item, idx) => (
            <div key={idx} className="contact-directory-row">
              <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{item.term}</span>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0' }}>{item.desc}</p>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. Resources
  if (pageId === 'resources') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Worksheets & e-Books</h3>
        <div className="docs-download-grid">
          {[
            { title: 'KS2 Maths Worksheet Bundle', size: '2.4 MB' },
            { title: 'Reading Comprehension Logbook', size: '1.8 MB' },
            { title: 'Tudors & Stuarts History Pack', size: '3.1 MB' },
            { title: 'Year 6 Revision Guide (SATS)', size: '4.5 MB' }
          ].map((doc, idx) => (
            <div key={idx} className="doc-download-card">
              <div className="doc-icon-container">
                <FolderOpen size={20} />
              </div>
              <div className="doc-info-block">
                <span className="doc-title-lbl">{doc.title}</span>
                <span className="doc-date-lbl">PDF • {doc.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 10. Messages
  if (pageId === 'messages') {
    return (
      <div className="card-widget" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', minHeight: '300px' }}>
        <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '12px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' }}>Chats</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Tutor - Sarah', 'Safeguarding Lead', 'Parents Community Forum'].map((chat, idx) => (
              <button key={idx} style={{ padding: '8px', borderRadius: '6px', border: 'none', background: idx === 0 ? 'var(--primary-purple-light)' : 'none', color: idx === 0 ? 'var(--primary-purple)' : '#64748b', fontSize: '0.78rem', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }}>
                {chat}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px' }}>Tutor - Sarah</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '180px', overflowY: 'auto', paddingRight: '6px', fontSize: '0.8rem' }}>
            <div style={{ alignSelf: 'flex-start', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', maxWidth: '80%' }}>
              Hello Emma, Emma has performed very well in today's fractions quiz. Let me know if you need specific homework guides.
            </div>
            <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)', padding: '10px', borderRadius: '8px', maxWidth: '80%' }}>
              Thank you, Sarah. I will print the worksheet bundle.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <input type="text" placeholder="Type a message..." className="form-input" style={{ paddingLeft: '12px' }} />
            <button className="login-btn" style={{ margin: 0, padding: '8px 16px', fontSize: '0.85rem', border: 'none' }}>Send</button>
          </div>
        </div>
      </div>
    );
  }

  // 11. Settings
  if (pageId === 'settings') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Account Settings</h3>
        <form className="form-element" onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="input-label">Parent Account Name</label>
              <input type="text" className="form-input" defaultValue="Emma Johnson" style={{ paddingLeft: '12px' }} />
            </div>
            <div className="form-group">
              <label className="input-label">Contact Email</label>
              <input type="email" className="form-input" defaultValue="emma.johnson@example.co.uk" style={{ paddingLeft: '12px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Homeschooling Organisation/Licence ID</label>
            <input type="text" className="form-input" defaultValue="UK-HS-839284" style={{ paddingLeft: '12px' }} />
          </div>

          <button className="login-btn" style={{ width: '120px', fontSize: '0.85rem', padding: '10px', border: 'none' }}>Save Changes</button>
        </form>
      </div>
    );
  }

  return (
    <div className="card-widget">
      <h3>Page Not Found</h3>
    </div>
  );
}
