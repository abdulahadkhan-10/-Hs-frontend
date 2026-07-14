import { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Download, 
  Activity 
} from 'lucide-react';
import { toast } from 'sonner';

export default function TeacherReports() {
  const [selectedClass, setSelectedClass] = useState('Year 6 - Division A');
  const [selectedStudent, setSelectedStudent] = useState('Emma Watson');
  const [mathsGrade, setMathsGrade] = useState('A');
  const [englishGrade, setEnglishGrade] = useState('A-');
  const [comments, setComments] = useState('');

  const classPerformanceData: Record<string, { avgGrade: string; attendance: string; coverage: string }> = {
    'Year 6 - Division A': { avgGrade: 'B+', attendance: '94%', coverage: '68%' },
    'Year 4 - Division B': { avgGrade: 'B', attendance: '93%', coverage: '48%' },
    'Year 2 - Division A': { avgGrade: 'A-', attendance: '95%', coverage: '82%' }
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Progress report generated for ${selectedStudent} successfully!`);
    setComments('');
  };

  return (
    <div className="teacher-reports-wrapper">
      <style>{`
        .teacher-reports-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .reports-grid-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .metric-card-visual {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }

        .metric-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-purple { background: #faf5ff; color: #7c3aed; }
        .icon-emerald { background: #ecfdf5; color: #059669; }
        .icon-blue { background: #eff6ff; color: #2563eb; }

        .metric-labels {
          display: flex;
          flex-direction: column;
        }

        .metric-val {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
        }

        .metric-name {
          font-size: 12.5px;
          color: #64748b;
        }

        .analytics-display-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .analytics-display-layout {
            grid-template-columns: 1fr;
          }
        }

        .card-analytics {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart-container-mock {
          height: 180px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding-top: 20px;
          border-bottom: 2px solid #e2e8f0;
          gap: 10px;
        }

        .chart-bar-mock {
          flex: 1;
          background: #ffebd2;
          border-radius: 6px 6px 0 0;
          position: relative;
          transition: height 0.3s;
          max-width: 44px;
        }

        .chart-bar-mock.active {
          background: #c06d48;
        }

        .chart-label-val {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          font-weight: 600;
          color: #0f172a;
        }

        .chart-label-name {
          position: absolute;
          bottom: -24px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
        }

        /* Report Form */
        .form-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
        }

        .form-input {
          padding: 9px 12px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 13.5px;
          outline: none;
        }

        .form-input:focus {
          border-color: #c06d48;
        }
      `}</style>

      {/* Class selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Performance Reports & Analytics</h2>
        <select 
          className="form-input" 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          style={{ width: '220px' }}
        >
          <option>Year 6 - Division A</option>
          <option>Year 4 - Division B</option>
          <option>Year 2 - Division A</option>
        </select>
      </div>

      {/* Key metrics visual row */}
      <div className="reports-grid-metrics">
        <div className="metric-card-visual">
          <div className="metric-icon-wrap icon-purple">
            <Award size={20} />
          </div>
          <div className="metric-labels">
            <span className="metric-val">{classPerformanceData[selectedClass].avgGrade}</span>
            <span className="metric-name">Average Grade</span>
          </div>
        </div>

        <div className="metric-card-visual">
          <div className="metric-icon-wrap icon-emerald">
            <Activity size={20} />
          </div>
          <div className="metric-labels">
            <span className="metric-val">{classPerformanceData[selectedClass].attendance}</span>
            <span className="metric-name">Avg Attendance</span>
          </div>
        </div>

        <div className="metric-card-visual">
          <div className="metric-icon-wrap icon-blue">
            <BookOpen size={20} />
          </div>
          <div className="metric-labels">
            <span className="metric-val">{classPerformanceData[selectedClass].coverage}</span>
            <span className="metric-name">Syllabus Covered</span>
          </div>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="analytics-display-layout">
        
        {/* Left Side Chart */}
        <div className="card-analytics">
          <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Grade Distribution Breakdown</h3>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>Count of students achieving grade ranges</span>
          </div>

          <div className="chart-container-mock">
            <div className="chart-bar-mock" style={{ height: '20%' }}>
              <span className="chart-label-val">1</span>
              <span className="chart-label-name">D/E</span>
            </div>
            <div className="chart-bar-mock" style={{ height: '40%' }}>
              <span className="chart-label-val">2</span>
              <span className="chart-label-name">C</span>
            </div>
            <div className="chart-bar-mock active" style={{ height: '80%' }}>
              <span className="chart-label-val">5</span>
              <span className="chart-label-name">B</span>
            </div>
            <div className="chart-bar-mock active" style={{ height: '60%' }}>
              <span className="chart-label-val">3</span>
              <span className="chart-label-name">A</span>
            </div>
          </div>

          <div style={{ height: '10px' }} /> {/* Spacing */}
        </div>

        {/* Right Side: Generate Report Card */}
        <form onSubmit={handleGenerateReport} className="card-analytics">
          <div style={{ borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Progress Report Generator</h3>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>Draft student report cards for parents</span>
          </div>

          <div className="form-row">
            <label className="form-label">Select Student</label>
            <select className="form-input" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              <option>Emma Watson</option>
              <option>James Potter</option>
              <option>Noah Ark</option>
              <option>Sophia Loren</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-row">
              <label className="form-label">Maths Assessment</label>
              <select className="form-input" value={mathsGrade} onChange={(e) => setMathsGrade(e.target.value)}>
                <option>A*</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">English Assessment</label>
              <select className="form-input" value={englishGrade} onChange={(e) => setEnglishGrade(e.target.value)}>
                <option>A*</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Form Tutor Comments</label>
            <textarea 
              className="form-input" 
              style={{ height: '72px', resize: 'none', fontFamily: 'inherit' }}
              placeholder="Highlight strengths and key focus targets..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="action-btn-primary" style={{ width: '100%' }}>
            <Download size={16} /> Generate & Export Report Card
          </button>
        </form>

      </div>
    </div>
  );
}
