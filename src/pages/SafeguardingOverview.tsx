import { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  ChevronRight, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Heart,
  Smile,
  Frown,
  AlertOctagon
} from 'lucide-react';

interface SafeguardingOverviewProps {
  onPageChange: (page: string, subpage?: string) => void;
}

export default function SafeguardingOverview({ onPageChange }: SafeguardingOverviewProps) {
  const [showLogModal, setShowLogModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);

  // Concern logs state
  const [concerns, setConcerns] = useState([
    { id: 1, title: 'Focus and Anxiety', time: 'Today', status: 'New concern reported', reporter: 'Parent', severity: 'high' },
    { id: 2, title: 'Social Interaction', time: 'Yesterday', status: 'Under review', reporter: 'Parent', severity: 'medium' },
    { id: 3, title: 'Screen Time Balance', time: '2 days ago', status: 'Under review', reporter: 'Parent', severity: 'medium' },
    { id: 4, title: 'Sleep Routine', time: '5 days ago', status: 'Resolved', reporter: 'Parent', severity: 'resolved' },
  ]);

  // Wellbeing checkins state
  const [checkins, setCheckins] = useState([
    { name: 'Emily', year: 'Year 6', msg: 'Great session today, feeling happy and confident.', time: 'Today', tone: 'excellent' },
    { name: 'Liam', year: 'Year 4', msg: 'Slightly tired, needs help with focus.', time: 'Yesterday', tone: 'attention' },
    { name: 'Noah', year: 'Year 2', msg: 'Enjoyed maths and reading activities.', time: '2 days ago', tone: 'good' },
  ]);

  // Form input state
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState('medium');
  const [newChild, setNewChild] = useState('Emily');
  const [newTone, setNewTone] = useState('good');
  const [newMsg, setNewMsg] = useState('');

  const handleLogConcern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const newLog = {
      id: concerns.length + 1,
      title: newTitle,
      time: 'Just now',
      status: 'Under review',
      reporter: 'Parent',
      severity: newSeverity
    };

    setConcerns([newLog, ...concerns]);
    setNewTitle('');
    setShowLogModal(false);
  };

  const handleAddCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const newLog = {
      name: newChild,
      year: newChild === 'Emily' ? 'Year 6' : newChild === 'Liam' ? 'Year 4' : 'Year 2',
      msg: newMsg,
      time: 'Just now',
      tone: newTone
    };

    setCheckins([newLog, ...checkins]);
    setNewMsg('');
    setShowCheckinModal(false);
  };

  return (
    <div>
      {/* Safeguarding Hero Header */}
      <section className="safeguarding-hero">
        <div className="safeguarding-hero-left">
          <div className="safeguarding-shield-container">
            <ShieldCheck size={28} />
          </div>
          <div className="safeguarding-hero-text">
            <div className="safeguarding-title-row">
              <h1 className="safeguarding-main-title">Safeguarding & Child Protection</h1>
              <span className="priority-badge">Our Priority</span>
            </div>
            <p className="safeguarding-hero-desc">
              Your child's safety and wellbeing are our top priority. We provide a secure learning environment and support you every step of the way.
            </p>
          </div>
        </div>
        
        <div className="safeguarding-hero-right-card">
          <div className="safety-card-icon-circle">
            <Users size={18} />
          </div>
          <div className="safety-card-info">
            <h4 className="safety-card-title">Keeping Children Safe</h4>
            <p className="safety-card-sub">Everyone. Every Day.</p>
          </div>
        </div>
      </section>

      {/* Statistics Row */}
      <section className="safeguarding-stats-grid">
        <div className="safeguarding-stat-card" style={{ borderColor: 'rgba(88, 63, 192, 0.2)' }} onClick={() => onPageChange('safeguarding', 'concern-log')}>
          <div className="stat-header-icon-row">
            <div className="stat-icon-container purple">
              <FileText size={18} />
            </div>
            <ChevronRight size={14} className="stat-arrow-icon" />
          </div>
          <div className="stat-value-group">
            <span className="stat-number-value">0</span>
            <span className="stat-bold-label">Open Concerns</span>
            <span className="stat-subtitle-text green">No action required</span>
          </div>
        </div>

        <div className="safeguarding-stat-card" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }} onClick={() => onPageChange('safeguarding', 'concern-log')}>
          <div className="stat-header-icon-row">
            <div className="stat-icon-container orange">
              <Clock size={18} />
            </div>
            <ChevronRight size={14} className="stat-arrow-icon" />
          </div>
          <div className="stat-value-group">
            <span className="stat-number-value">2</span>
            <span className="stat-bold-label">Under Review</span>
            <span className="stat-subtitle-text muted">Being assessed</span>
          </div>
        </div>

        <div className="safeguarding-stat-card" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }} onClick={() => onPageChange('safeguarding', 'concern-log')}>
          <div className="stat-header-icon-row">
            <div className="stat-icon-container green">
              <CheckCircle size={18} />
            </div>
            <ChevronRight size={14} className="stat-arrow-icon" />
          </div>
          <div className="stat-value-group">
            <span className="stat-number-value">5</span>
            <span className="stat-bold-label">Resolved</span>
            <span className="stat-subtitle-text muted">This term</span>
          </div>
        </div>

        <div className="safeguarding-stat-card" style={{ borderColor: 'rgba(59, 130, 246, 0.2)' }} onClick={() => onPageChange('safeguarding', 'wellbeing')}>
          <div className="stat-header-icon-row">
            <div className="stat-icon-container blue">
              <Users size={18} />
            </div>
            <ChevronRight size={14} className="stat-arrow-icon" />
          </div>
          <div className="stat-value-group">
            <span className="stat-number-value">1</span>
            <span className="stat-bold-label">Children Monitored</span>
            <span className="stat-subtitle-text muted">Active guidance</span>
          </div>
        </div>

        <div className="safeguarding-stat-card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => onPageChange('safeguarding', 'policies')}>
          <div className="stat-header-icon-row">
            <div className="stat-icon-container red">
              <ShieldCheck size={18} />
            </div>
            <ChevronRight size={14} className="stat-arrow-icon" />
          </div>
          <div className="stat-value-group">
            <span className="stat-number-value">100%</span>
            <span className="stat-bold-label">Safety Compliance</span>
            <span className="stat-subtitle-text green">Up to date</span>
          </div>
        </div>
      </section>

      {/* Main Grid Content Panels */}
      <section className="safeguarding-content-grid">
        {/* Column 1: Safeguarding Overview */}
        <div className="card-widget wellbeing-snapshot-card">
          <div className="panel-header-row">
            <h3 className="panel-title-text">Safeguarding Overview</h3>
            <span className="panel-view-all" onClick={() => onPageChange('safeguarding', 'wellbeing')}>View all</span>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '16px', fontWeight: 600 }}>Wellbeing Snapshot (This Week)</p>

          <div className="wellbeing-chart-row">
            <div className="donut-chart-mock-wrapper">
              <div className="donut-chart-center-cutout">
                <span className="cutout-percent">92%</span>
                <span className="cutout-label">Overall<br />Wellbeing</span>
              </div>
            </div>

            <div className="wellbeing-metric-legend">
              <div className="legend-item-row">
                <span className="legend-bullet-text">
                  <span className="legend-bullet" style={{ backgroundColor: 'var(--accent-green)' }}></span>
                  Emotional Wellbeing
                </span>
                <span className="legend-score-label excellent">Excellent</span>
              </div>
              <div className="legend-item-row">
                <span className="legend-bullet-text">
                  <span className="legend-bullet" style={{ backgroundColor: 'var(--info-blue)' }}></span>
                  Engagement
                </span>
                <span className="legend-score-label good">Good</span>
              </div>
              <div className="legend-item-row">
                <span className="legend-bullet-text">
                  <span className="legend-bullet" style={{ backgroundColor: 'var(--primary-purple)' }}></span>
                  Social Connection
                </span>
                <span className="legend-score-label good">Good</span>
              </div>
              <div className="legend-item-row">
                <span className="legend-bullet-text">
                  <span className="legend-bullet" style={{ backgroundColor: 'var(--warning-orange)' }}></span>
                  Physical Wellbeing
                </span>
                <span className="legend-score-label good">Good</span>
              </div>
              <div className="legend-item-row">
                <span className="legend-bullet-text">
                  <span className="legend-bullet" style={{ backgroundColor: 'var(--danger-red)' }}></span>
                  Needs Attention
                </span>
                <span className="legend-score-label low">Low</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '12px', fontWeight: 600 }}>Recent Check-ins</p>
          <div className="recent-checkins-list">
            {checkins.map((check, idx) => (
              <div key={idx} className="checkin-row-item">
                <div className="checkin-left-profile">
                  <div className={`checkin-smiley-badge ${check.tone}`}>
                    {check.tone === 'excellent' || check.tone === 'good' ? <Smile size={16} /> : <Frown size={16} />}
                  </div>
                  <div className="checkin-info-txt">
                    <span className="checkin-child-name">{check.name} – {check.name === 'Emily' ? 'Year 6' : check.name === 'Liam' ? 'Year 4' : 'Year 2'}</span>
                    <span className="checkin-child-status">{check.msg}</span>
                  </div>
                </div>
                <div className="checkin-date-col">
                  <span>{check.time}</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>

          <button className="action-btn-outline" onClick={() => setShowCheckinModal(true)}>
            + Add Wellbeing Check-in
          </button>
        </div>

        {/* Column 2: Concern Log */}
        <div className="card-widget">
          <div className="panel-header-row">
            <h3 className="panel-title-text">Concern Log</h3>
            <span className="panel-view-all" onClick={() => onPageChange('safeguarding', 'concern-log')}>View all</span>
          </div>

          <div className="concern-logs-list" style={{ marginTop: '12px' }}>
            {concerns.map((log) => (
              <div key={log.id} className="concern-log-row-item">
                <div className={`concern-badge-icon ${log.severity}`}>
                  <AlertCircle size={16} />
                </div>
                <div className="concern-content-txt">
                  <div className="concern-row-title-row">
                    <span className="concern-row-title">{log.title}</span>
                    <span className="concern-row-time">{log.time}</span>
                  </div>
                  <span className="concern-row-sub">{log.status}</span>
                  <div className="concern-row-meta-row">
                    <span className="concern-reporter">Reported by: {log.reporter}</span>
                    <span className={`concern-severity-pill ${log.severity}`}>{log.severity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="action-btn-outline" onClick={() => setShowLogModal(true)}>
            + Log a Concern
          </button>
        </div>

        {/* Column 3: Quick Actions & Contacts */}
        <div className="card-widget">
          <div className="panel-header-row">
            <h3 className="panel-title-text">Quick Actions</h3>
          </div>

          <div style={{ marginTop: '12px', marginBottom: '24px' }}>
            <div className="quick-action-link-row" onClick={() => setShowLogModal(true)}>
              <div className="quick-action-left-wrapper">
                <div className="quick-action-icon-box purple">
                  <AlertOctagon size={14} />
                </div>
                <span>Report a Concern</span>
              </div>
              <ChevronRight size={12} />
            </div>

            <div className="quick-action-link-row" onClick={() => setShowCheckinModal(true)}>
              <div className="quick-action-left-wrapper">
                <div className="quick-action-icon-box blue">
                  <Smile size={14} />
                </div>
                <span>Wellbeing Check-in</span>
              </div>
              <ChevronRight size={12} />
            </div>

            <div className="quick-action-link-row" onClick={() => onPageChange('safeguarding', 'support')}>
              <div className="quick-action-left-wrapper">
                <div className="quick-action-icon-box green">
                  <Users size={14} />
                </div>
                <span>Access Support</span>
              </div>
              <ChevronRight size={12} />
            </div>

            <div className="quick-action-link-row" onClick={() => onPageChange('safeguarding', 'policies')}>
              <div className="quick-action-left-wrapper">
                <div className="quick-action-icon-box orange">
                  <FileText size={14} />
                </div>
                <span>Safeguarding Resources</span>
              </div>
              <ChevronRight size={12} />
            </div>
          </div>

          <div className="panel-header-row">
            <h3 className="panel-title-text">Important Contacts</h3>
            <span className="panel-view-all">View all</span>
          </div>

          <div className="contacts-directory">
            <div className="contact-directory-row">
              <span className="contact-name-label">Designated Safeguarding Lead (DSL)</span>
              <div className="contact-detail-line">
                <Phone size={12} />
                <a href="tel:02079460958">020 7946 0958</a>
              </div>
              <div className="contact-detail-line">
                <Mail size={12} />
                <a href="mailto:dsl@ilmeelearning.com">dsl@ilmeelearning.com</a>
              </div>
            </div>

            <div className="contact-directory-row">
              <span className="contact-name-label">Deputy DSL</span>
              <div className="contact-detail-line">
                <Phone size={12} />
                <a href="tel:02079460959">020 7946 0959</a>
              </div>
              <div className="contact-detail-line">
                <Mail size={12} />
                <a href="mailto:deputydsl@ilmeelearning.com">deputydsl@ilmeelearning.com</a>
              </div>
            </div>

            <div className="contact-directory-row">
              <span className="contact-name-label">Childline</span>
              <div className="contact-detail-line">
                <Phone size={12} />
                <a href="tel:08001111">0800 1111</a>
              </div>
              <div className="contact-detail-line">
                <Globe size={12} />
                <a href="https://www.childline.org.uk" target="_blank" rel="noreferrer">www.childline.org.uk</a>
              </div>
            </div>
          </div>

          <div className="emergency-strip-footer">
            <AlertCircle size={14} />
            <span>In an emergency, contact 999 or your local authority</span>
          </div>
        </div>
      </section>

      {/* Safety Guidance & Support Promotion */}
      <section className="safeguarding-footer-grid">
        {/* Safety & Guidance Documents */}
        <div className="card-widget">
          <div className="panel-header-row">
            <h3 className="panel-title-text">Safety & Guidance</h3>
            <span className="panel-view-all" onClick={() => onPageChange('safeguarding', 'policies')}>View all</span>
          </div>
          
          <div className="docs-download-grid" style={{ marginTop: '12px' }}>
            {[
              { title: 'Child Protection Policy', date: 'Updated: May 2024' },
              { title: 'Emotional Wellbeing Guide', date: 'Updated: May 2024' },
              { title: 'Online Safety Guide', date: 'Updated: May 2024' },
              { title: 'Screen Time Guidance', date: 'Updated: May 2024' },
              { title: 'Positive Behaviour Guide', date: 'Updated: May 2024' },
              { title: 'Emergency Contacts', date: 'Updated: May 2024' }
            ].map((doc, idx) => (
              <div key={idx} className="doc-download-card">
                <div className="doc-icon-container">
                  <FileText size={18} />
                </div>
                <div className="doc-info-block">
                  <span className="doc-title-lbl">{doc.title}</span>
                  <span className="doc-date-lbl">{doc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wellbeing Support Banner */}
        <div className="wellbeing-support-promo">
          <div className="support-promo-graphic">
            <Heart size={44} fill="var(--primary-purple-light)" />
          </div>
          <div className="support-promo-info">
            <span className="support-promo-title">We are here to support you and your child.</span>
            <ul className="support-promo-bullets">
              <li><CheckCircle size={10} className="bullet-chk-icon" /> Safe Learning Environment</li>
              <li><CheckCircle size={10} className="bullet-chk-icon" /> Emotional Support</li>
              <li><CheckCircle size={10} className="bullet-chk-icon" /> Parental Guidance</li>
              <li><CheckCircle size={10} className="bullet-chk-icon" /> Regular Check-ins</li>
            </ul>
            <button className="support-promo-btn" onClick={() => onPageChange('safeguarding', 'support')}>Explore Support Centre</button>
          </div>
        </div>
      </section>

      {/* Bottom Disclaimer Banner */}
      <section className="safeguarding-disclaimer-banner">
        <div className="disclaimer-left-block">
          <ShieldCheck size={24} className="disclaimer-icon-graphic" />
          <div>
            <span className="disclaimer-title-text">Safeguarding is everyone's responsibility.</span>
            <p className="disclaimer-desc-text">If you have any concerns about a child's safety or wellbeing, speak to us. We listen, we protect, we support, we care.</p>
          </div>
        </div>
        <div className="disclaimer-icons-row">
          <span className="disclaimer-icon-item"><Heart size={14} className="disclaimer-icon-graphic" /> We Listen</span>
          <span className="disclaimer-icon-item"><ShieldCheck size={14} className="disclaimer-icon-graphic" /> We Protect</span>
          <span className="disclaimer-icon-item"><Users size={14} className="disclaimer-icon-graphic" /> We Support</span>
          <span className="disclaimer-icon-item"><Heart size={14} className="disclaimer-icon-graphic" /> We Care</span>
        </div>
      </section>

      {/* LOG CONCERN MODAL POPUP */}
      {showLogModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card-widget" style={{ width: '90%', maxWidth: '500px', backgroundColor: 'white' }}>
            <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Report / Log a Safeguarding Concern</h3>
            <form onSubmit={handleLogConcern} className="form-element">
              <div className="form-group">
                <label className="input-label">Describe the Concern</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Focus and Anxiety, Attendance issues" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ paddingLeft: '12px' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-label">Severity Level</label>
                <select 
                  className="form-input" 
                  value={newSeverity} 
                  onChange={(e) => setNewSeverity(e.target.value)}
                  style={{ paddingLeft: '12px' }}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="resolved">Already Resolved (Log file only)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="support-promo-btn" onClick={() => setShowLogModal(false)}>Cancel</button>
                <button type="submit" className="login-btn" style={{ margin: 0, padding: '8px 16px', fontSize: '0.85rem' }}>Log Concern</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD WELLBEING CHECK-IN MODAL POPUP */}
      {showCheckinModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', 
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card-widget" style={{ width: '90%', maxWidth: '500px', backgroundColor: 'white' }}>
            <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Add Wellbeing Check-in</h3>
            <form onSubmit={handleAddCheckin} className="form-element">
              <div className="form-group">
                <label className="input-label">Select Child</label>
                <select 
                  className="form-input" 
                  value={newChild}
                  onChange={(e) => setNewChild(e.target.value)}
                  style={{ paddingLeft: '12px' }}
                >
                  <option value="Emily">Emily (Year 6)</option>
                  <option value="Liam">Liam (Year 4)</option>
                  <option value="Noah">Noah (Year 2)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Wellbeing Rating</label>
                <select 
                  className="form-input" 
                  value={newTone}
                  onChange={(e) => setNewTone(e.target.value)}
                  style={{ paddingLeft: '12px' }}
                >
                  <option value="excellent">Excellent Wellbeing</option>
                  <option value="good">Good / Happy</option>
                  <option value="attention">Needs Attention</option>
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Notes / Observation</label>
                <textarea 
                  className="form-input" 
                  placeholder="e.g. Completed lessons smoothly, showed excitement for science." 
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  style={{ paddingLeft: '12px', minHeight: '80px', paddingTop: '8px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="support-promo-btn" onClick={() => setShowCheckinModal(false)}>Cancel</button>
                <button type="submit" className="login-btn" style={{ margin: 0, padding: '8px 16px', fontSize: '0.85rem' }}>Submit Check-in</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
