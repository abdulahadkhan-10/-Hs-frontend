import { useState } from 'react';
import { 
  Search, 
  Mail, 
  Phone, 
  Award, 
  Activity, 
  ShieldAlert
} from 'lucide-react';

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

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetSchoolClassesQuery } from '../../store/api/teacherApi';



export default function TeacherClasses() {
  const { user } = useSelector((state: RootState) => state.auth);
  const schoolId = user?.profile?.schoolId || '';
  const { data: classesData } = useGetSchoolClassesQuery(schoolId, {
    skip: !schoolId,
  });

  const [selectedClass, setSelectedClass] = useState('Year 6 - Division A');
  const [searchQuery, setSearchQuery] = useState('');

  const defaultClassData: Record<string, { subject: string; room: string; students: Student[] }> = {
    'Year 6 - Division A': {
      subject: 'Mathematics & Science',
      room: 'Room 102',
      students: [
        { id: '1', name: 'Emma Watson', email: 'emma.w@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80', grade: 'A', attendance: '98%', parentName: 'Helen Watson', parentPhone: '+44 7700 900077', safeguardingFlag: false },
        { id: '2', name: 'James Potter', email: 'james.p@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80', grade: 'B+', attendance: '94%', parentName: 'Lily Potter', parentPhone: '+44 7700 900122', safeguardingFlag: false },
        { id: '3', name: 'Noah Ark', email: 'noah.a@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80', grade: 'C', attendance: '88%', parentName: 'Mary Ark', parentPhone: '+44 7700 900388', safeguardingFlag: true },
        { id: '4', name: 'Sophia Loren', email: 'sophia.l@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80', grade: 'A+', attendance: '100%', parentName: 'Carlo Loren', parentPhone: '+44 7700 900455', safeguardingFlag: false }
      ]
    },
    'Year 4 - Division B': {
      subject: 'English & Art',
      room: 'Room 205',
      students: [
        { id: '5', name: 'Liam Neeson', email: 'liam.n@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80', grade: 'B', attendance: '92%', parentName: 'Jane Neeson', parentPhone: '+44 7700 900822', safeguardingFlag: false },
        { id: '6', name: 'Olivia Wild', email: 'olivia.w@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80', grade: 'A-', attendance: '96%', parentName: 'Richard Wild', parentPhone: '+44 7700 900999', safeguardingFlag: false }
      ]
    },
    'Year 2 - Division A': {
      subject: 'General Primary Curriculum',
      room: 'Room 101',
      students: [
        { id: '7', name: 'Charlotte Webb', email: 'charlotte.w@lsa-school.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=80', grade: 'A', attendance: '95%', parentName: 'George Webb', parentPhone: '+44 7700 900533', safeguardingFlag: false }
      ]
    }
  };

  const schoolClasses = classesData?.classes || [];
  const classData: Record<string, { subject: string; room: string; students: Student[] }> = {};

  if (schoolClasses.length > 0) {
    schoolClasses.forEach((cls: any) => {
      const clsName = `${cls.grade} - Division ${cls.division}`;
      classData[clsName] = {
        subject: 'Core School Curriculum',
        room: `Room ${Math.floor(Math.random() * 80) + 101}`,
        students: (cls.students || []).map((std: any, index: number) => {
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
            safeguardingFlag: index % 5 === 0
          };
        })
      };
    });
  } else {
    Object.assign(classData, defaultClassData);
  }

  useEffect(() => {
    const keys = Object.keys(classData);
    if (keys.length > 0 && !keys.includes(selectedClass)) {
      setSelectedClass(keys[0]);
    }
  }, [classData, selectedClass]);

  const currentClassInfo = classData[selectedClass] || { subject: '', room: '', students: [] };
  const filteredStudents = currentClassInfo.students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="teacher-classes-wrapper">
      <style>{`
        .teacher-classes-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .class-selector-tabs {
          display: flex;
          gap: 12px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 12px;
          overflow-x: auto;
        }

        .class-tab {
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }

        .class-tab.active {
          background: #c06d48;
          color: white;
          border-color: #c06d48;
        }

        .class-header-summary {
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-title-meta h2 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
        }

        .header-title-meta p {
          margin: 0;
          font-size: 13.5px;
          color: #64748b;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 320px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
        }

        .search-field {
          width: 100%;
          padding: 9px 12px 9px 38px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 13.5px;
          outline: none;
        }

        .search-field:focus {
          border-color: #c06d48;
        }

        .student-roster-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .student-premium-card {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform 0.15s, box-shadow 0.15s;
          position: relative;
        }

        .student-premium-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -8px rgba(0,0,0,0.08);
        }

        .student-card-header {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .student-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ffebd2;
        }

        .student-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .student-card-name {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .student-card-email {
          font-size: 12px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .flag-indicator {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #fff1f2;
          color: #e11d48;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .metric-split-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          background: #f8fafc;
          border-radius: 10px;
          padding: 10px;
        }

        .metric-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }

        .metric-label {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
        }

        .metric-value {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .parent-contact-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12.5px;
          color: #475569;
          border-top: 1px solid #f1f5f9;
          padding-top: 12px;
        }

        .parent-contact-name {
          font-weight: 600;
          color: #334155;
        }

        .parent-contact-phone {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }

        .card-actions-wrapper {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .btn-card-action {
          padding: 8px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.15s;
        }

        .btn-secondary-flat {
          background: #fafaf9;
          color: #78716c;
          border: 1px solid #e7e5e4;
        }
        .btn-secondary-flat:hover {
          background: #f5f5f4;
          color: #57534e;
        }
      `}</style>

      {/* Class tabs selection */}
      <div className="class-selector-tabs">
        {Object.keys(classData).map((clsName) => (
          <button
            key={clsName}
            className={`class-tab ${selectedClass === clsName ? 'active' : ''}`}
            onClick={() => {
              setSelectedClass(clsName);
              setSearchQuery('');
            }}
          >
            {clsName}
          </button>
        ))}
      </div>

      {/* Header bar with summary */}
      <div className="class-header-summary">
        <div className="header-title-meta">
          <h2>{selectedClass} &middot; {currentClassInfo.subject}</h2>
          <p>{currentClassInfo.room} &middot; {filteredStudents.length} student profiles matched</p>
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-field"
            placeholder="Search student or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Student Roster Grid */}
      <div className="student-roster-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="student-premium-card">
              {student.safeguardingFlag && (
                <span className="flag-indicator">
                  <ShieldAlert size={12} /> Safeguarding Flag
                </span>
              )}

              <div className="student-card-header">
                <img src={student.avatar} alt={student.name} className="student-avatar" />
                <div className="student-info">
                  <span className="student-card-name">{student.name}</span>
                  <span className="student-card-email">
                    <Mail size={12} /> {student.email}
                  </span>
                </div>
              </div>

              <div className="metric-split-row">
                <div className="metric-cell" style={{ borderRight: '1px solid #e2e8f0' }}>
                  <span className="metric-label">Subject Grade</span>
                  <span className="metric-value" style={{ color: '#059669' }}>
                    <Award size={15} /> {student.grade}
                  </span>
                </div>
                <div className="metric-cell">
                  <span className="metric-label">Attendance</span>
                  <span className="metric-value" style={{ color: '#2563eb' }}>
                    <Activity size={15} /> {student.attendance}
                  </span>
                </div>
              </div>

              <div className="parent-contact-section">
                <span>Parent: <span className="parent-contact-name">{student.parentName}</span></span>
                <span className="parent-contact-phone">
                  <Phone size={12} /> {student.parentPhone}
                </span>
              </div>

              <div className="card-actions-wrapper">
                <button className="btn-card-action btn-secondary-flat" onClick={() => alert(`Showing profile detail summary for ${student.name}`)}>
                  View Academic Profile Summary &rarr;
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px' }}>
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
