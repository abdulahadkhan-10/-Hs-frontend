import { useState } from 'react';
import { 
  ShieldAlert, 
  Send, 
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface ConcernLog {
  id: string;
  studentName: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  date: string;
  description: string;
  status: 'Pending Review' | 'Investigating' | 'Resolved';
}

export default function TeacherSafeguarding() {
  const [activeTab, setActiveTab] = useState<'logs' | 'submit'>('logs');
  const [selectedStudent, setSelectedStudent] = useState('Noah Ark - Year 2');
  const [category, setCategory] = useState('Emotional');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [immediateAlert, setImmediateAlert] = useState(false);

  const [concernLogs, setConcernLogs] = useState<ConcernLog[]>([
    { id: '1', studentName: 'Noah Ark', category: 'Neglect / Physical appearance', severity: 'High', date: 'July 12, 2026', description: 'Student arrived with disheveled clothes and complained of not having breakfast for 2 days. Seems withdrawn.', status: 'Investigating' },
    { id: '2', studentName: 'Emma Watson', category: 'Peer Bullying', severity: 'Medium', date: 'July 05, 2026', description: 'Emma mentioned some older students calling her names in the playground during lunchtime.', status: 'Resolved' }
  ]);

  const handleSubmitConcern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    const newLog: ConcernLog = {
      id: Date.now().toString(),
      studentName: selectedStudent.split(' - ')[0],
      category,
      severity,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      description,
      status: 'Pending Review'
    };

    setConcernLogs([newLog, ...concernLogs]);
    toast.success('Safeguarding concern log successfully submitted to officers.');
    setActiveTab('logs');
    setDescription('');
    setImmediateAlert(false);
  };

  return (
    <div className="teacher-safeguarding-wrapper">
      <style>{`
        .teacher-safeguarding-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .safeguarding-top-card {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: #991b1b;
        }

        .tabs-header-menu {
          display: flex;
          gap: 12px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 12px;
        }

        .tab-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
        }

        .tab-btn.active {
          background: #ffe4e6;
          color: #e11d48;
        }

        /* Form */
        .form-card {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 650px;
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 13.5px;
          font-weight: 600;
          color: #334155;
        }

        .form-input {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          outline: none;
        }

        .form-input:focus {
          border-color: #e11d48;
        }

        .form-textarea {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          outline: none;
          height: 120px;
          resize: none;
          font-family: inherit;
        }

        .form-textarea:focus {
          border-color: #e11d48;
        }

        .severity-options-row {
          display: flex;
          gap: 12px;
        }

        .severity-btn {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          background: white;
          transition: all 0.15s;
          text-align: center;
        }

        .severity-btn.low.active { background: #f0fdf4; color: #166534; border-color: #166534; }
        .severity-btn.medium.active { background: #fffbeb; color: #9a3412; border-color: #9a3412; }
        .severity-btn.high.active { background: #fff1f2; color: #991b1b; border-color: #991b1b; }

        /* Logs Table */
        .logs-table-wrapper {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }

        .logs-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .logs-table th {
          background: #f8fafc;
          padding: 14px 18px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          border-bottom: 1.5px solid #f1f5f9;
        }

        .logs-table td {
          padding: 16px 18px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13.5px;
          color: #0f172a;
        }

        .badge-severity {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .badge-low { background: #ecfdf5; color: #047857; }
        .badge-medium { background: #fffbeb; color: #b45309; }
        .badge-high { background: #fff1f2; color: #e11d48; }

        .badge-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
        }

        .status-pending { background: #f1f5f9; color: #64748b; }
        .status-investigating { background: #eff6ff; color: #1d4ed8; }
        .status-resolved { background: #ecfdf5; color: #047857; }
      `}</style>

      {/* Warning top-card */}
      <div className="safeguarding-top-card">
        <ShieldAlert size={24} />
        <div>
          <span style={{ fontWeight: 700, fontSize: '14.5px' }}>Confidentiality Notice</span>
          <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', opacity: 0.9 }}>
            Safeguarding concern logs are restricted and shared only with designated Safeguarding Officers.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header-menu">
        <button className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
          Logged Concerns Ledger
        </button>
        <button className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`} onClick={() => setActiveTab('submit')}>
          Log New Safeguarding Incident
        </button>
      </div>

      {/* Content Panels */}

      {activeTab === 'logs' && (
        <div className="logs-table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Category</th>
                <th>Risk Level</th>
                <th>Date Logged</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {concernLogs.map((log) => (
                <tr key={log.id}>
                  <td><strong>{log.studentName}</strong></td>
                  <td>{log.category}</td>
                  <td>
                    <span className={`badge-severity badge-${log.severity.toLowerCase()}`}>
                      {log.severity} Risk
                    </span>
                  </td>
                  <td>{log.date}</td>
                  <td>
                    <span className={`badge-status status-${log.status.toLowerCase().replace(' ', '-')}`}>
                      {log.status === 'Pending Review' ? <Clock size={12} /> : log.status === 'Investigating' ? <Clock size={12} /> : <CheckCircle size={12} />}
                      {log.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}
                      onClick={() => alert(`Details: ${log.description}`)}
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'submit' && (
        <form onSubmit={handleSubmitConcern} className="form-card">
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0f172a' }}>New Safeguarding Log</h2>

          <div className="form-row">
            <label className="form-label">Select Student</label>
            <select className="form-input" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              <option>Noah Ark - Year 2</option>
              <option>Liam Neeson - Year 4</option>
              <option>Emma Watson - Year 6</option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Category of Concern</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Emotional / Mood changes</option>
              <option>Neglect / Physical appearance</option>
              <option>Peer Bullying / Social exclusion</option>
              <option>Academic distress / Extreme anxiety</option>
              <option>Physical harm / Unexplained injury</option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Incident Severity Risk</label>
            <div className="severity-options-row">
              <button 
                type="button" 
                className={`severity-btn low ${severity === 'Low' ? 'active' : ''}`}
                onClick={() => setSeverity('Low')}
              >
                Low Risk
              </button>
              <button 
                type="button" 
                className={`severity-btn medium ${severity === 'Medium' ? 'active' : ''}`}
                onClick={() => setSeverity('Medium')}
              >
                Medium Risk
              </button>
              <button 
                type="button" 
                className={`severity-btn high ${severity === 'High' ? 'active' : ''}`}
                onClick={() => setSeverity('High')}
              >
                High Risk
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Detailed Observation Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Be objective. Describe exactly what was seen, heard, or reported. Use quotes where applicable..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '12px 14px', borderRadius: '8px' }}>
            <input
              type="checkbox"
              id="immediate"
              checked={immediateAlert}
              onChange={(e) => setImmediateAlert(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="immediate" style={{ fontSize: '13px', color: '#475569', cursor: 'pointer', fontWeight: 500 }}>
              Request immediate response callback from Lead Safeguarding Officer
            </label>
          </div>

          <button type="submit" className="action-btn-primary" style={{ background: '#e11d48', width: '100%' }}>
            <Send size={16} /> File Confidential Incident Log
          </button>
        </form>
      )}
    </div>
  );
}
