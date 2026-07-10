import { FileText } from 'lucide-react';

interface SubpageProps {
  subpage: string;
}

export default function SafeguardingSubpages({ subpage }: SubpageProps) {
  if (subpage === 'wellbeing') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '12px' }}>Wellbeing Check-ins History</h3>
        <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '20px' }}>
          Monitor your children's emotional and physical wellbeing. Weekly check-ins help us flag any areas requiring early attention.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="contact-directory-row" style={{ borderLeft: '4px solid var(--accent-green)' }}>
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>Emily - Year 6</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '4px 0' }}>Excellent</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 600 }}>Active & Engaged</span>
          </div>
          <div className="contact-directory-row" style={{ borderLeft: '4px solid var(--warning-orange)' }}>
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>Liam - Year 4</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '4px 0' }}>Needs Attention</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--warning-orange)', fontWeight: 600 }}>Slightly tired</span>
          </div>
          <div className="contact-directory-row" style={{ borderLeft: '4px solid var(--accent-green)' }}>
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>Noah - Year 2</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '4px 0' }}>Good</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 600 }}>Enjoying curriculum</span>
          </div>
        </div>

        <div className="recent-checkins-list">
          {[
            { child: 'Emily', date: '10 June 2026', mood: 'Excellent', text: 'Excited about the upcoming fractions practice worksheet. Showed great engagement.' },
            { child: 'Liam', date: '09 June 2026', mood: 'Needs Attention', text: 'Complained of eye strain during history lessons. Suggested screen time breaks.' },
            { child: 'Noah', date: '08 June 2026', mood: 'Good', text: 'Loved drawing ancient Egyptian pyramids in art activities today.' },
            { child: 'Emily', date: '05 June 2026', mood: 'Excellent', text: 'Completed all assignments ahead of time. Happy environment at home.' }
          ].map((check, idx) => (
            <div key={idx} className="checkin-row-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.8rem', fontWeight: 'bold' }}>
                <span>{check.child} ({check.mood})</span>
                <span style={{ color: '#94a3b8' }}>{check.date}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569' }}>{check.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (subpage === 'concern-log') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '12px' }}>Concern Log Timeline</h3>
        <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '20px' }}>
          Detailed record of reported concerns. Each item is reviewed by our Designated Safeguarding Lead (DSL) within 2 hours.
        </p>

        <div className="concern-logs-list">
          {[
            { id: 'LOG-384', title: 'Focus and Anxiety', date: '10 June 2026', severity: 'high', status: 'Under review by DSL Emma J.', desc: 'Parent reported child has been finding it difficult to focus on assignments and expressing high anxiety during assessments.' },
            { id: 'LOG-382', title: 'Social Interaction', date: '09 June 2026', severity: 'medium', status: 'Assessment complete', desc: 'Discussed with tutor about organising group online learning sessions to assist child with peer interactions.' },
            { id: 'LOG-379', title: 'Screen Time Balance', date: '08 June 2026', severity: 'medium', status: 'Action plan created', desc: 'Tutor recommended printable worksheets and textbooks for science to reduce screen time by 40%.' },
            { id: 'LOG-375', title: 'Sleep Routine', date: '05 June 2026', severity: 'resolved', status: 'Resolved & closed', desc: 'Adjusted study timetable to start at 09:30 instead of 08:30. Sleep hours have improved.' }
          ].map((item) => (
            <div key={item.id} className="concern-log-row-item" style={{ flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0f172a' }}>{item.title} <span style={{ color: '#94a3b8', fontSize: '0.74rem' }}>#{item.id}</span></span>
                <span className={`concern-severity-pill ${item.severity}`}>{item.severity}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#475569' }}>{item.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.74rem', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px', color: '#64748b' }}>
                <span>Status: <strong>{item.status}</strong></span>
                <span>Date: {item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (subpage === 'support') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '12px' }}>Support & Guidance Directory</h3>
        <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '20px' }}>
          Explore external services and internal resources to support your child's emotional, mental, and physical health.
        </p>

        <div className="contacts-directory" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="contact-directory-row">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>YoungMinds</h4>
            <p style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '8px' }}>UK leading charity fighting for children and young people's mental health.</p>
            <span style={{ fontSize: '0.74rem' }}>Helpline: <strong>0808 802 5544</strong></span>
          </div>

          <div className="contact-directory-row">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>NSPCC Safeguarding</h4>
            <p style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '8px' }}>National Society for the Prevention of Cruelty to Children, advice for parents.</p>
            <span style={{ fontSize: '0.74rem' }}>Helpline: <strong>0808 800 5000</strong></span>
          </div>

          <div className="contact-directory-row">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>Internet Matters</h4>
            <p style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '8px' }}>Support for parents to keep children safe in the digital world.</p>
            <span style={{ fontSize: '0.74rem' }}>Website: <a href="https://www.internetmatters.org" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-purple)' }}>www.internetmatters.org</a></span>
          </div>

          <div className="contact-directory-row">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '6px' }}>NHS Mental Health Services</h4>
            <p style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '8px' }}>Free, confidential support from local UK healthcare practitioners.</p>
            <span style={{ fontSize: '0.74rem' }}>Call: <strong>111</strong> (Non-emergency)</span>
          </div>
        </div>
      </div>
    );
  }

  if (subpage === 'policies') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '12px' }}>Safeguarding Policies & Standard Procedures</h3>
        <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '20px' }}>
          Download official documents outlining LSA's commitment to British National Safeguarding standards.
        </p>

        <div className="docs-download-grid">
          {[
            { title: 'Child Protection Policy 2026', size: '1.2 MB', desc: 'Core policies governing teacher, parent, and child safety compliance.' },
            { title: 'Online Safety & Digital Wellbeing', size: '940 KB', desc: 'Guidance on setting up parental controls and monitoring online class sessions.' },
            { title: 'Tutor Code of Conduct', size: '580 KB', desc: 'Standard rules and verification procedures for all LSA curriculum tutors.' },
            { title: 'GDPR & Child Data Privacy Policy', size: '1.5 MB', desc: 'How we store, process, and secure student profile data and logs.' }
          ].map((doc, idx) => (
            <div key={idx} className="doc-download-card" style={{ padding: '16px' }}>
              <div className="doc-icon-container" style={{ alignSelf: 'flex-start' }}>
                <FileText size={24} />
              </div>
              <div className="doc-info-block" style={{ flex: 1 }}>
                <span className="doc-title-lbl" style={{ fontSize: '0.85rem' }}>{doc.title}</span>
                <p style={{ fontSize: '0.74rem', color: '#475569', margin: '4px 0' }}>{doc.desc}</p>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>PDF • {doc.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
