import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  X, 
  Save, 
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  time: string;
  className: string;
  subject: string;
  room: string;
  status: 'marked' | 'live' | 'upcoming';
}

export default function TeacherLessons() {
  const [activeWeek, setActiveWeek] = useState(12);
  const [attendanceClass, setAttendanceClass] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'present' | 'absent' | 'late'>>({
    '1': 'present',
    '2': 'present',
    '3': 'present',
    '4': 'present'
  });

  const lessons: Lesson[] = [
    { id: '1', time: '09:00 - 10:00', className: 'Year 6 - Division A', subject: 'Mathematics (Fractions)', room: 'Room 102', status: 'marked' },
    { id: '2', time: '11:00 - 12:00', className: 'Year 6 - Division A', subject: 'Science (Photosynthesis)', room: 'Room 102', status: 'live' },
    { id: '3', time: '13:00 - 14:00', className: 'Year 4 - Division B', subject: 'English Reading (Comprehension)', room: 'Room 205', status: 'upcoming' },
    { id: '4', time: '14:30 - 15:30', className: 'Year 2 - Division A', subject: 'Basic Phonics', room: 'Room 101', status: 'upcoming' }
  ];

  const studentsForAttendance = [
    { id: '1', name: 'Emma Watson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80' },
    { id: '2', name: 'James Potter', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80' },
    { id: '3', name: 'Noah Ark', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80' },
    { id: '4', name: 'Sophia Loren', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80' }
  ];

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = () => {
    toast.success(`Attendance successfully logged for ${attendanceClass}!`);
    setAttendanceClass(null);
  };

  const schemeOfWork = [
    { title: 'Core Objective', desc: 'Identify, name and write equivalent fractions of a given fraction, represented visually.' },
    { title: 'Required Materials', desc: 'Fraction slides, printable grid sheets, color pencils, and interactive smart-board quiz.' },
    { title: 'AI Teacher Assistant Tips', desc: 'Prompt students with high-complexity diagrams for equivalent scaling. Support lower performing students with visual block fraction slices.' }
  ];

  return (
    <div className="teacher-lessons-wrapper">
      <style>{`
        .teacher-lessons-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .lessons-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .lessons-grid {
            grid-template-columns: 1fr;
          }
        }

        .card-lessons-schedule {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lesson-card-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          background: #fafaf9;
          gap: 16px;
          flex-wrap: wrap;
        }

        .lesson-left-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .lesson-time-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #ffebd2;
          color: #c06d48;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lesson-text-details {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .lesson-title-text {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .lesson-meta-row {
          display: flex;
          gap: 12px;
          font-size: 12.5px;
          color: #64748b;
          align-items: center;
        }

        .meta-tag {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-badge-premium {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 600;
        }

        .status-marked { background: #ecfdf5; color: #047857; }
        .status-live { background: #eff6ff; color: #1d4ed8; animation: pulse 2s infinite; }
        .status-upcoming { background: #f8fafc; color: #475569; }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .attendance-sheet-overlay {
          background: white;
          border: 1px solid #ffd8c4;
          border-radius: 14px;
          padding: 24px;
          box-shadow: 0 10px 25px -5px rgba(192, 109, 72, 0.15);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .attendance-student-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .attendance-student-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .attendance-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .attendance-buttons {
          display: flex;
          gap: 6px;
        }

        .attendance-btn-option {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid #e2e8f0;
          background: white;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-present.active { background: #ecfdf5; color: #059669; border-color: #059669; }
        .btn-absent.active { background: #fff1f2; color: #e11d48; border-color: #e11d48; }
        .btn-late.active { background: #fffbeb; color: #d97706; border-color: #d97706; }

        .scheme-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #fafaf9;
          border-radius: 10px;
          padding: 14px;
          border-left: 3.5px solid #c06d48;
        }

        .scheme-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1c1917;
        }

        .scheme-desc {
          font-size: 12.5px;
          color: #57534e;
          line-height: 1.5;
        }
      `}</style>

      {/* Main schedule grid */}
      <div className="lessons-grid">
        
        {/* Left Side: Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card-lessons-schedule">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} style={{ color: '#c06d48' }} /> Today's Teaching Schedule
              </h2>
              <span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: 500 }}>Tuesday, July 14, 2026</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-card-item">
                  <div className="lesson-left-group">
                    <div className="lesson-time-icon">
                      <Clock size={20} />
                    </div>
                    <div className="lesson-text-details">
                      <span className="lesson-title-text">{lesson.subject}</span>
                      <div className="lesson-meta-row">
                        <span className="meta-tag"><strong>Class:</strong> {lesson.className}</span>
                        <span className="meta-tag"><MapPin size={12} /> {lesson.room}</span>
                        <span className="meta-tag"><Clock size={12} /> {lesson.time}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`status-badge-premium status-${lesson.status}`}>
                      {lesson.status === 'marked' ? 'Attendance Marked' : lesson.status === 'live' ? 'Live Session' : 'Upcoming'}
                    </span>
                    {lesson.status !== 'marked' && (
                      <button 
                        className="action-btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => setAttendanceClass(lesson.className)}
                      >
                        Log Attendance
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance sheet conditional block */}
          {attendanceClass && (
            <div className="attendance-sheet-overlay">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Class Attendance Form</h3>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>Logging attendance for {attendanceClass}</p>
                </div>
                <button 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  onClick={() => setAttendanceClass(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {studentsForAttendance.map((student) => (
                  <div key={student.id} className="attendance-student-row">
                    <div className="attendance-student-info">
                      <img src={student.avatar} alt={student.name} className="attendance-avatar" />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{student.name}</span>
                    </div>

                    <div className="attendance-buttons">
                      <button 
                        className={`attendance-btn-option btn-present ${attendanceRecords[student.id] === 'present' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(student.id, 'present')}
                      >
                        Present
                      </button>
                      <button 
                        className={`attendance-btn-option btn-late ${attendanceRecords[student.id] === 'late' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(student.id, 'late')}
                      >
                        Late
                      </button>
                      <button 
                        className={`attendance-btn-option btn-absent ${attendanceRecords[student.id] === 'absent' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(student.id, 'absent')}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="action-btn-primary" 
                onClick={saveAttendance}
                style={{ width: '100%', marginTop: '10px' }}
              >
                <Save size={16} /> Save & Submit Attendance
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Curriculum Scheme of work */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card-lessons-schedule">
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: '#059669' }} /> Autumn Term Curriculum Guide
            </h2>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
              {[10, 11, 12, 13].map((wk) => (
                <button
                  key={wk}
                  className={`action-btn-outline ${activeWeek === wk ? 'active' : ''}`}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    borderRadius: '20px',
                    color: activeWeek === wk ? '#fff' : '#64748b',
                    background: activeWeek === wk ? '#c06d48' : '#fff',
                    borderColor: activeWeek === wk ? '#c06d48' : '#e2e8f0'
                  }}
                  onClick={() => setActiveWeek(wk)}
                >
                  Week {wk}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {schemeOfWork.map((item, idx) => (
                <div key={idx} className="scheme-item">
                  <span className="scheme-title">{item.title}</span>
                  <span className="scheme-desc">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
