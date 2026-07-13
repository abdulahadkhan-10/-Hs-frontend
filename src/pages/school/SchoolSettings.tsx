import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Settings, 
  Save, 
  Upload, 
  ToggleLeft, 
  ToggleRight, 
  Calendar, 
  Building
} from 'lucide-react';

export default function SchoolSettings() {
  const [schoolName, setSchoolName] = useState('Abcd Academyy');
  const [portalTitle, setPortalTitle] = useState('LSA Portal');
  const [academicTerm, setAcademicTerm] = useState('Autumn Term');
  const [termStart, setTermStart] = useState('2026-09-01');
  const [termEnd, setTermEnd] = useState('2026-12-18');
  
  // Toggles
  const [allowTeacherRoster, setAllowTeacherRoster] = useState(true);
  const [allowStudentSelfEnroll, setAllowStudentSelfEnroll] = useState(false);
  const [requireSafeguardingCheck, setRequireSafeguardingCheck] = useState(true);

  // Logo state simulation
  const [logoFile, setLogoFile] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(URL.createObjectURL(e.target.files[0]));
      toast.success('Logo uploaded! Review preview below.');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings updated successfully!');
  };

  return (
    <div className="sd-page">
      {/* Page Header */}
      <div className="sd-topbar" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="sd-title" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
            <Settings size={26} />
            School Settings
          </h1>
          <p className="sd-subtitle" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Configure portal branding, set academic term durations, and establish permission defaults.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Section 1: Branding */}
        <div className="sd-section-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} style={{ color: 'var(--primary)' }} />
            School & Portal Branding
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>SCHOOL NAME</label>
              <input
                type="text"
                className="sd-form-input"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, outline: 'none', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>PORTAL DISPLAY TITLE</label>
              <input
                type="text"
                className="sd-form-input"
                value={portalTitle}
                onChange={(e) => setPortalTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, outline: 'none', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>SCHOOL LOGO</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '12px', 
                  border: '2px dashed var(--border-light)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: 'var(--bg-portal)',
                  overflow: 'hidden'
                }}
              >
                {logoFile ? (
                  <img src={logoFile} alt="School Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Building size={24} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              <label 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '10px 16px', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '8px', 
                  background: 'var(--primary-light)', 
                  color: 'var(--primary)', 
                  fontWeight: 700, 
                  fontSize: '0.82rem', 
                  cursor: 'pointer' 
                }}
              >
                <Upload size={14} />
                Upload Logo
                <input type="file" onChange={handleLogoUpload} style={{ display: 'none' }} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Academic Terms */}
        <div className="sd-section-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} style={{ color: 'var(--primary)' }} />
            Academic Calendar & Terms
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>CURRENT ACTIVE TERM</label>
              <select
                value={academicTerm}
                onChange={(e) => setAcademicTerm(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem', background: '#ffffff' }}
              >
                <option value="Autumn Term">Autumn Term</option>
                <option value="Spring Term">Spring Term</option>
                <option value="Summer Term">Summer Term</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>TERM START DATE</label>
              <input
                type="date"
                className="sd-form-input"
                value={termStart}
                onChange={(e) => setTermStart(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, outline: 'none', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>TERM END DATE</label>
              <input
                type="date"
                className="sd-form-input"
                value={termEnd}
                onChange={(e) => setTermEnd(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, outline: 'none', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Permission Settings */}
        <div className="sd-section-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '24px' }}>
            System Permissions & Access
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 750, fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Allow Teachers to Manage Rosters</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>If active, teachers can enroll or remove students from their assigned classes.</span>
              </div>
              <button 
                type="button" 
                onClick={() => setAllowTeacherRoster(!allowTeacherRoster)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: allowTeacherRoster ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                {allowTeacherRoster ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <div>
                <span style={{ fontWeight: 750, fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Allow Student Self-Enrollment</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Enable students to request enrolment into advanced curriculum tracks.</span>
              </div>
              <button 
                type="button" 
                onClick={() => setAllowStudentSelfEnroll(!allowStudentSelfEnroll)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: allowStudentSelfEnroll ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                {allowStudentSelfEnroll ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <div>
                <span style={{ fontWeight: 750, fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Enforce Safeguarding Check-in Logs</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Require safeguarding officers to log concerns before modifying student file access.</span>
              </div>
              <button 
                type="button" 
                onClick={() => setRequireSafeguardingCheck(!requireSafeguardingCheck)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: requireSafeguardingCheck ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                {requireSafeguardingCheck ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '10px' }}>
          <button 
            type="submit" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '8px', 
              background: 'var(--primary)', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '0.9rem', 
              cursor: 'pointer', 
              boxShadow: '0 4px 12px rgba(61, 82, 72, 0.2)' 
            }}
          >
            <Save size={16} />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
