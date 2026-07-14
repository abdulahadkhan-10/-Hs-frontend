import { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle, 
  Save, 
  Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';

interface Assignment {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  points: number;
  submitted: number;
  total: number;
  status: 'active' | 'graded';
}

interface Submission {
  id: string;
  studentName: string;
  avatar: string;
  submittedAt: string;
  answerContent: string;
  grade: string;
  pointsAwarded?: number;
  feedback?: string;
  status: 'pending' | 'graded';
}

export default function TeacherAssignments() {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'grade'>('list');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  // State for mock database
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: '1', title: 'Equivalency of Fractions Homework', className: 'Year 6 - Division A', dueDate: 'July 18, 2026', points: 20, submitted: 3, total: 4, status: 'active' },
    { id: '2', title: 'Autumn Botany Science Report', className: 'Year 6 - Division A', dueDate: 'July 10, 2026', points: 50, submitted: 4, total: 4, status: 'graded' },
    { id: '3', title: 'Creative Writing: Narrative Opening', className: 'Year 4 - Division B', dueDate: 'July 20, 2026', points: 30, submitted: 1, total: 2, status: 'active' }
  ]);

  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: '1', studentName: 'Emma Watson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80', submittedAt: 'Yesterday, 14:32', answerContent: 'Here is my fraction grid showing equivalent blocks for 2/4, 3/6, and 4/8. All simplify to 1/2.', grade: 'Pending', status: 'pending' },
    { id: '2', studentName: 'James Potter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80', submittedAt: 'Today, 09:15', answerContent: 'Equivalent fractions are fractions that represent the same value even though they look different. For example 5/10 is equivalent to 1/2.', grade: 'Pending', status: 'pending' },
    { id: '3', studentName: 'Noah Ark', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80', submittedAt: 'Today, 11:30', answerContent: 'I completed the worksheet. 4/8 equals 1/2.', grade: 'Pending', status: 'pending' }
  ]);

  // Form State
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('Year 6 - Division A');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState(20);
  const [description, setDescription] = useState('');

  // Grading State
  const [currentGradingSubmission, setCurrentGradingSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState(18);
  const [feedbackText, setFeedbackText] = useState('');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title,
      className,
      dueDate: new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      points,
      submitted: 0,
      total: className === 'Year 6 - Division A' ? 4 : className === 'Year 4 - Division B' ? 2 : 1,
      status: 'active'
    };

    setAssignments([newAssignment, ...assignments]);
    toast.success('Assignment created and dispatched to students successfully.');
    setActiveTab('list');
    setTitle('');
    setDueDate('');
    setDescription('');
  };

  const handleGradeSubmission = (submissionId: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (sub) {
      setCurrentGradingSubmission(sub);
      setGradeScore(18);
      setFeedbackText('');
      setActiveTab('grade');
    }
  };

  const submitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGradingSubmission) return;

    // Update submissions local state
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === currentGradingSubmission.id) {
        return {
          ...sub,
          grade: 'Graded',
          status: 'graded',
          pointsAwarded: gradeScore,
          feedback: feedbackText
        };
      }
      return sub;
    }));

    toast.success(`Successfully graded assignment for ${currentGradingSubmission.studentName}!`);
    setActiveTab('list');
    setCurrentGradingSubmission(null);
  };

  return (
    <div className="teacher-assignments-wrapper">
      <style>{`
        .teacher-assignments-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
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
          background: #ffebd2;
          color: #c06d48;
        }

        .assignments-list-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .assignment-card-premium {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .assignment-info-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .assignment-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .assignment-meta-row {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #64748b;
          align-items: center;
        }

        .sub-counter {
          font-size: 13.5px;
          font-weight: 600;
          color: #c06d48;
          background: #fffbeb;
          padding: 4px 10px;
          border-radius: 20px;
        }

        /* Form styling */
        .form-card {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 600px;
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
          border-color: #c06d48;
        }

        .form-textarea {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          outline: none;
          height: 100px;
          resize: none;
          font-family: inherit;
        }

        .form-textarea:focus {
          border-color: #c06d48;
        }

        /* Submission card */
        .submission-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .grading-panel-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .grading-panel-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Tabs list */}
      <div className="tabs-header-menu">
        <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          Assignments List & Grading
        </button>
        <button className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>
          Create New Assignment
        </button>
        {activeTab === 'grade' && (
          <button className="tab-btn active">
            Grading Student Work
          </button>
        )}
      </div>

      {/* CONTENT PANELS */}

      {activeTab === 'list' && (
        <div className="assignments-list-grid">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card-premium">
              <div className="assignment-info-group">
                <span className="assignment-title">{assignment.title}</span>
                <div className="assignment-meta-row">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} /> {assignment.className}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> Due: {assignment.dueDate}
                  </span>
                  <span>Max Points: {assignment.points}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="sub-counter">
                  {assignment.submitted}/{assignment.total} Submitted
                </span>
                
                {assignment.submitted > 0 && assignment.status !== 'graded' && (
                  <button 
                    className="action-btn-primary" 
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      // focus on submissions list
                    }}
                  >
                    Grade Submissions &rarr;
                  </button>
                )}

                {assignment.status === 'graded' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#059669', fontWeight: 600 }}>
                    <CheckCircle size={15} /> Fully Graded
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Submissions Section under Selected Assignment */}
          {selectedAssignment && (
            <div style={{ marginTop: '24px', background: '#fafaf9', padding: '24px', borderRadius: '14px', border: '1px dashed #ffd8c4' }}>
              <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                  Submissions for: {selectedAssignment.title}
                </h3>
                <button 
                  style={{ background: 'none', border: 'none', color: '#c06d48', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                  onClick={() => setSelectedAssignment(null)}
                >
                  Close Panel
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {submissions.map((submission) => (
                  <div key={submission.id} className="submission-card">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={submission.avatar} alt={submission.studentName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>{submission.studentName}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Submitted {submission.submittedAt}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: submission.status === 'graded' ? '#ecfdf5' : '#fffbeb',
                        color: submission.status === 'graded' ? '#047857' : '#b45309'
                      }}>
                        {submission.status === 'graded' ? `Graded: ${submission.pointsAwarded}/${selectedAssignment.points}` : 'Awaiting Grade'}
                      </span>
                      {submission.status === 'pending' && (
                        <button 
                          className="action-btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleGradeSubmission(submission.id)}
                        >
                          Grade Work
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handleCreateAssignment} className="form-card">
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Create New Assignment</h2>
          
          <div className="form-row">
            <label className="form-label">Assignment Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Fractions Worksheet or Lab Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-row">
              <label className="form-label">Target Class</label>
              <select className="form-input" value={className} onChange={(e) => setClassName(e.target.value)}>
                <option>Year 6 - Division A</option>
                <option>Year 4 - Division B</option>
                <option>Year 2 - Division A</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Max Points</label>
              <input
                type="number"
                className="form-input"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                min={1}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label className="form-label">Description & Instructions</label>
            <textarea
              className="form-textarea"
              placeholder="Provide instructions, requirements, and AI support suggestions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="action-btn-primary" style={{ width: '100%' }}>
            <Plus size={16} /> Deploy Assignment to Students
          </button>
        </form>
      )}

      {activeTab === 'grade' && currentGradingSubmission && (
        <div className="grading-panel-grid">
          
          {/* Work Display */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Review Submission</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Student: {currentGradingSubmission.studentName}</span>
              </div>
              <button 
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}
                onClick={() => {
                  setActiveTab('list');
                  setCurrentGradingSubmission(null);
                }}
              >
                Cancel
              </button>
            </div>

            <div style={{ padding: '16px', borderRadius: '10px', background: '#fafaf9', border: '1px solid #f3f3f0' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>STUDENT ANSWER</h4>
              <p style={{ margin: 0, fontSize: '14.5px', color: '#1c1917', lineHeight: '1.6' }}>
                {currentGradingSubmission.answerContent}
              </p>
            </div>

            {/* AI Assistant Grade Suggestion */}
            <div style={{ padding: '16px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', gap: '12px' }}>
              <div style={{ color: '#2563eb' }}><Sparkles size={20} /></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e3a8a' }}>AI Grading Companion suggestion</span>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#1e40af', lineHeight: '1.5' }}>
                  The response clearly shows full understanding of equivalency. The student correctly mapped and simplified all fractions. Suggested grade: <strong>19/20 points</strong> (Excellent).
                </p>
              </div>
            </div>
          </div>

          {/* Grade submission form */}
          <form onSubmit={submitGrade} style={{ background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Assessment Panel</h3>
            
            <div className="form-row">
              <label className="form-label">Award Score (Out of 20)</label>
              <input
                type="number"
                className="form-input"
                value={gradeScore}
                onChange={(e) => setGradeScore(Number(e.target.value))}
                min={0}
                max={20}
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label">Written Feedback</label>
              <textarea
                className="form-textarea"
                placeholder="Give constructive feedback for improvement..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="action-btn-primary" style={{ width: '100%' }}>
              <Save size={16} /> Submit & Release Grade
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
