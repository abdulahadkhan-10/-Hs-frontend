import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetSchoolClassesQuery } from '../../store/api/teacherApi';
import { 
  GraduationCap, 
  Users, 
  Activity, 
  FileText, 
  ShieldAlert, 
  Search, 
  Mail, 
  Phone, 
  Send, 
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade: string;
  attendance: string;
  parentName: string;
  parentPhone: string;
  safeguardingFlag: boolean;
}

export default function TeacherMyClassroom() {
  const { user } = useSelector((state: RootState) => state.auth);
  const schoolId = user?.profile?.schoolId || '';
  const myClassInfo = user?.profile?.classTeacherOf?.[0]; // e.g. { id, grade, division }

  const { data: classesData, isLoading } = useGetSchoolClassesQuery(schoolId, {
    skip: !schoolId,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [bulletinText, setBulletinText] = useState('');
  const [bulletins, setBulletins] = useState([
    { id: 1, date: 'Today, 09:00', text: 'Reminder: The field trip consent forms are due by this Friday!' },
    { id: 2, date: 'July 10, 2026', text: 'Math homework on Fractions has been set. Due next Tuesday.' }
  ]);

  const [classroomStudents, setClassroomStudents] = useState<Student[]>([]);
  const [classroomGrade, setClassroomGrade] = useState('');
  const [classroomDivision, setClassroomDivision] = useState('');

  useEffect(() => {
    if (classesData?.classes && myClassInfo) {
      // Find the class matching the teacher's classTeacherOf ID
      const matchedClass = classesData.classes.find((cls: any) => cls.id === myClassInfo.id);
      
      if (matchedClass) {
        setClassroomGrade(matchedClass.grade);
        setClassroomDivision(matchedClass.division);
        
        const mappedStudents = (matchedClass.students || []).map((std: any, index: number) => {
          const grades = ['A', 'B+', 'A-', 'B', 'C', 'A+'];
          const attendances = ['98%', '95%', '92%', '88%', '100%', '94%'];
          return {
            id: std.id,
            name: std.name,
            email: `${std.name.toLowerCase().replace(/\s+/g, '.')}@lsa-school.com`,
            avatar: `https://images.unsplash.com/photo-${1500000000000 + (index * 10000)}?auto=format&fit=crop&q=80&w=80`,
            grade: grades[index % grades.length],
            attendance: attendances[index % attendances.length],
            parentName: `Parent of ${std.name.split(' ')[0]}`,
            parentPhone: `+44 7700 900${Math.floor(100 + Math.random() * 900)}`,
            safeguardingFlag: index % 4 === 0 // 1 in 4 class teacher students flagged
          };
        });
        setClassroomStudents(mappedStudents);
      }
    } else if (!myClassInfo) {
      // Fallback mock data if teacher is not designated a class teacher in DB
      setClassroomGrade('Year 6');
      setClassroomDivision('Division A');
      setClassroomStudents([
        { id: '1', name: 'Emma Watson', email: 'emma.w@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80', grade: 'A', attendance: '98%', parentName: 'Helen Watson', parentPhone: '+44 7700 900077', safeguardingFlag: false },
        { id: '2', name: 'James Potter', email: 'james.p@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80', grade: 'B+', attendance: '94%', parentName: 'Lily Potter', parentPhone: '+44 7700 900122', safeguardingFlag: false },
        { id: '3', name: 'Noah Ark', email: 'noah.a@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80', grade: 'C', attendance: '88%', parentName: 'Mary Ark', parentPhone: '+44 7700 900388', safeguardingFlag: true },
        { id: '4', name: 'Sophia Loren', email: 'sophia.l@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80', grade: 'A+', attendance: '100%', parentName: 'Carlo Loren', parentPhone: '+44 7700 900455', safeguardingFlag: false }
      ]);
    }
  }, [classesData, myClassInfo]);

  const handlePostBulletin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulletinText.trim()) return;

    const newBulletin = {
      id: Date.now(),
      date: 'Just now',
      text: bulletinText
    };

    setBulletins([newBulletin, ...bulletins]);
    setBulletinText('');
    toast.success('Notice successfully posted to classroom bulletin board!');
  };

  const filteredStudents = classroomStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading Classroom details...</div>;
  }

  return (
    <div className="my-classroom-wrapper">
      <style>{`
        .my-classroom-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .classroom-header-hero {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          border-radius: 16px;
          padding: 28px 32px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.25);
        }

        .classroom-header-hero::after {
          content: '';
          position: absolute;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
          right: -40px;
          top: -40px;
          pointer-events: none;
        }

        .classroom-header-hero h1 {
          font-size: 26px;
          font-weight: 800;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .classroom-header-hero p {
          margin: 0;
          opacity: 0.9;
          font-size: 14.5px;
        }

        .classroom-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .classroom-stat-card {
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }

        .stat-labels {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-val {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        .stat-lbl {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-purple { background: #faf5ff; color: #7c3aed; }
        .stat-icon-blue { background: #eff6ff; color: #2563eb; }
        .stat-icon-emerald { background: #ecfdf5; color: #059669; }
        .stat-icon-rose { background: #fff1f2; color: #e11d48; }

        .classroom-main-grid {
          display: grid;
          grid-template-columns: 1.5fr 1.0fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .classroom-main-grid {
            grid-template-columns: 1fr;
          }
        }

        .card-widget-premium {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px solid #f8fafc;
          padding-bottom: 12px;
        }

        .widget-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Student Card List */
        .student-item-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px;
          border-radius: 10px;
          background: #fafaf9;
          border: 1px solid #f3f3f0;
          gap: 12px;
          flex-wrap: wrap;
        }

        .student-top-details {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .student-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #7c3aed;
        }

        /* Bulletin */
        .bulletin-textarea {
          width: 100%;
          height: 80px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 13.5px;
          outline: none;
          resize: none;
          font-family: inherit;
        }

        .bulletin-textarea:focus {
          border-color: #7c3aed;
        }

        .bulletin-row-item {
          padding: 12px 14px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1.5px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bulletin-date {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
        }

        .bulletin-text {
          font-size: 13px;
          color: #334155;
          line-height: 1.5;
        }

        .flag-tag-visual {
          background: #fff1f2;
          color: #e11d48;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
      `}</style>

      {/* Header Banner */}
      <div className="classroom-header-hero">
        <h1>
          <GraduationCap size={28} />
          My Classroom: {classroomGrade} - {classroomDivision}
        </h1>
        <p>Class tutor dashboard &middot; Oversee daily attendance, behavior reports, and student welfare.</p>
      </div>

      {/* Stats Widgets */}
      <div className="classroom-stats-row">
        <div className="classroom-stat-card">
          <div className="stat-labels">
            <span className="stat-val">{classroomStudents.length}</span>
            <span className="stat-lbl">Students Enrolled</span>
          </div>
          <div className="stat-icon stat-icon-purple">
            <Users size={20} />
          </div>
        </div>

        <div className="classroom-stat-card">
          <div className="stat-labels">
            <span className="stat-val">95%</span>
            <span className="stat-lbl">Class Attendance</span>
          </div>
          <div className="stat-icon stat-icon-blue">
            <Activity size={20} />
          </div>
        </div>

        <div className="classroom-stat-card">
          <div className="stat-labels">
            <span className="stat-val">3</span>
            <span className="stat-lbl">Active Homeworks</span>
          </div>
          <div className="stat-icon stat-icon-emerald">
            <FileText size={20} />
          </div>
        </div>

        <div className="classroom-stat-card">
          <div className="stat-labels">
            <span className="stat-val">1</span>
            <span className="stat-lbl">Safeguarding Issues</span>
          </div>
          <div className="stat-icon stat-icon-rose">
            <ShieldAlert size={20} />
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="classroom-main-grid">
        
        {/* Left Column: Student Roster */}
        <div className="card-widget-premium">
          <div className="widget-header">
            <h3 className="widget-title">
              <Users size={18} style={{ color: '#7c3aed' }} />
              Classroom Student Roster
            </h3>
            
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="form-input"
                style={{ padding: '6px 10px 6px 30px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '12.5px', outline: 'none', width: '100%' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student.id} className="student-item-strip">
                  <div className="student-top-details">
                    <img src={student.avatar} alt={student.name} className="student-avatar" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>{student.name}</span>
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={11} /> {student.email}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {student.safeguardingFlag && (
                      <span className="flag-tag-visual">
                        <ShieldAlert size={12} /> Active Case
                      </span>
                    )}

                    <div style={{ fontSize: '13px', color: '#475569' }}>
                      Attendance: <strong style={{ color: '#2563eb' }}>{student.attendance}</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px', color: '#64748b' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>Parent: {student.parentName}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Phone size={10} /> {student.parentPhone}</span>
                    </div>

                    <button 
                      className="action-btn-primary" 
                      style={{ padding: '6px 10px', fontSize: '12px', background: '#7c3aed' }}
                      onClick={() => alert(`Opening report generator for ${student.name}`)}
                    >
                      Report Card
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No students match your query.</div>
            )}
          </div>
        </div>

        {/* Right Column: Bulletin and Notices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Bulletin Board */}
          <div className="card-widget-premium">
            <div className="widget-header">
              <h3 className="widget-title">
                <Bell size={18} style={{ color: '#7c3aed' }} />
                Class Bulletin Board
              </h3>
            </div>

            <form onSubmit={handlePostBulletin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea 
                className="bulletin-textarea" 
                placeholder="Post a new notice or homework reminder to parents and students of your class..."
                value={bulletinText}
                onChange={(e) => setBulletinText(e.target.value)}
                required
              />
              <button type="submit" className="action-btn-primary" style={{ background: '#7c3aed', width: '100%' }}>
                <Send size={14} /> Post Notice
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {bulletins.map((item) => (
                <div key={item.id} className="bulletin-row-item">
                  <span className="bulletin-date">{item.date}</span>
                  <p className="bulletin-text">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
