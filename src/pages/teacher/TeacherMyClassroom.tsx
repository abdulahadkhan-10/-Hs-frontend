import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetSchoolClassesQuery } from '../../store/api/teacherApi';
import { useAddStudentMutation, useBulkUploadStudentsMutation } from '../../store/api/studentApi';
import { 
  GraduationCap, 
  Users, 
  Activity, 
  FileText, 
  ShieldAlert, 
  Search, 
  Mail, 
  Send, 
  Bell,
  Plus,
  Upload,
  Download,
  X
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

  const [addStudent, { isLoading: isAdding }] = useAddStudentMutation();
  const [bulkUploadStudents, { isLoading: isBulking }] = useBulkUploadStudentsMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [bulletinText, setBulletinText] = useState('');
  const [bulletins, setBulletins] = useState([
    { id: 1, date: 'Today, 09:00', text: 'Reminder: The field trip consent forms are due by this Friday!' },
    { id: 2, date: 'July 10, 2026', text: 'Math homework on Fractions has been set. Due next Tuesday.' }
  ]);

  const [classroomStudents, setClassroomStudents] = useState<Student[]>([]);
  const [classroomGrade, setClassroomGrade] = useState('');
  const [classroomDivision, setClassroomDivision] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
  });

  // Bulk state
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkReport, setBulkReport] = useState<any | null>(null);
  const [previewStudents, setPreviewStudents] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (classesData?.classes && myClassInfo) {
      // Find the class matching the teacher's classTeacherOf ID
      const matchedClass = classesData.classes.find((cls: any) => cls.id === myClassInfo.id);
      
      if (matchedClass) {
        setClassroomGrade(matchedClass.grade);
        setClassroomDivision(matchedClass.division);
        
        const mappedStudents = (matchedClass.students || []).map((std: any, index: number) => {
          return {
            id: std.id,
            name: std.name,
            email: std.user?.email || `${std.name.toLowerCase().replace(/\s+/g, '.')}@lsa-school.com`,
            avatar: `https://images.unsplash.com/photo-${1500000000000 + (index * 10000)}?auto=format&fit=crop&q=80&w=80`,
            grade: 'N/A',
            attendance: '100%',
            parentName: std.parent?.name || 'N/A',
            parentPhone: std.parent?.phone || 'N/A',
            safeguardingFlag: false
          };
        });
        setClassroomStudents(mappedStudents);
      }
    } else if (!myClassInfo) {
      setClassroomGrade('');
      setClassroomDivision('');
      setClassroomStudents([]);
    }
  }, [classesData, myClassInfo]);

  const handleDownloadTemplate = () => {
    const headers = 'Name,Email,Password,Date of Birth\n';
    const row = 'John Doe,john.doe@lsa-school.com,Password123!,2012-05-15\n';
    const blob = new Blob([headers + row], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_bulk_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Sample template downloaded successfully!');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myClassInfo) {
      toast.error('You must be a designated class teacher to add students.');
      return;
    }
    if (!formData.name || !formData.email) {
      toast.error('Name and Email are required.');
      return;
    }

    try {
      await addStudent({
        ...formData,
        classId: myClassInfo.id,
        password: formData.password || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
      }).unwrap();

      toast.success('Student added successfully!');
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        dateOfBirth: '',
      });
    } catch (err: any) {
      toast.error(err.data?.error || 'Failed to add student');
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile) {
      toast.error('Please select a CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) {
        toast.error('Failed to read file content.');
        return;
      }

      try {
        const rows = text.split('\n').map((row) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        });

        // First row is headers
        const headers = rows[0].map((h) => h.toLowerCase().trim());
        const dataRows = rows.slice(1).filter((r) => r.length > 1 && r[0]);

        const studentsList = dataRows.map((row) => {
          const studentObj: any = {};
          headers.forEach((header, index) => {
            const val = row[index] || '';
            if (header === 'name') studentObj.name = val;
            else if (header === 'email') studentObj.email = val;
            else if (header === 'password') studentObj.password = val;
            else if (header === 'date of birth' || header === 'date_of_birth' || header === 'dateofbirth') {
              studentObj.dateOfBirth = val;
            }
          });
          return studentObj;
        });

        setPreviewStudents(studentsList);
        toast.success(`Successfully parsed ${studentsList.length} rows. Please review preview below.`);
      } catch (err: any) {
        toast.error('Failed to parse CSV file');
      }
    };
    reader.readAsText(bulkFile);
  };

  const handleConfirmUpload = async () => {
    if (!myClassInfo) {
      toast.error('You must be a designated class teacher to upload students.');
      return;
    }
    if (!previewStudents || previewStudents.length === 0) return;
    try {
      const response = await bulkUploadStudents({
        classId: myClassInfo.id,
        students: previewStudents,
      }).unwrap();

      setBulkReport(response);
      setPreviewStudents(null);
      toast.success(`Successfully uploaded CSV. Successes: ${response.successCount}, Failures: ${response.failureCount}`);
    } catch (err: any) {
      toast.error(err.data?.error || 'Failed to process CSV file');
    }
  };

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

  if (!myClassInfo) {
    return (
      <div className="my-classroom-wrapper">
        <style>{`
          .no-class-hero {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            border-radius: 16px;
            padding: 40px;
            color: white;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.25);
            margin-top: 40px;
          }
          .no-class-title {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .no-class-desc {
            font-size: 15px;
            opacity: 0.9;
            max-width: 500px;
            margin: 0 auto;
            line-height: 1.6;
          }
        `}</style>
        <div className="no-class-hero">
          <h1 className="no-class-title">
            <GraduationCap size={32} />
            No Designated Class
          </h1>
          <p className="no-class-desc">
            You are not currently assigned as a Class Teacher for any class. The student directory, rosters, and bulk import features are reserved for class teachers.
          </p>
        </div>
      </div>
    );
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
      <div className="classroom-header-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>
            <GraduationCap size={28} />
            My Classroom: {classroomGrade} - {classroomDivision}
          </h1>
          <p>Class tutor dashboard &middot; Oversee daily attendance, behavior reports, and student welfare.</p>
        </div>
        {myClassInfo && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => {
                setBulkReport(null);
                setBulkFile(null);
                setPreviewStudents(null);
                setShowBulkModal(true);
              }}
              style={{
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              <Upload size={15} />
              Bulk Upload (CSV)
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                cursor: 'pointer',
                background: 'white',
                color: '#6d28d9',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              <Plus size={15} />
              Add Student
            </button>
          </div>
        )}
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

      {/* ─── MODALS ────────────────────────────────────────── */}

      {/* 1. Add Student Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            className="sd-section-card"
            style={{
              maxWidth: 500,
              width: '100%',
              padding: '24px 30px',
              borderRadius: 16,
              background: 'white',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Add Single Student
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 20 }}>
              Create a login user account and profile for a new student in your class.
            </p>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 650, color: '#475569', marginBottom: 6 }}>FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 650, color: '#475569', marginBottom: 6 }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@school.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1.5px solid #e2e8f0',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 650, color: '#475569', marginBottom: 6 }}>PASSWORD</label>
                  <input
                    type="password"
                    placeholder="Student123!"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 650, color: '#475569', marginBottom: 6 }}>DATE OF BIRTH</label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: 12,
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    background: '#fafbfc',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  style={{
                    flex: 1,
                    padding: 12,
                    border: 'none',
                    borderRadius: 8,
                    background: '#7c3aed',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {isAdding ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Bulk Upload Modal */}
      {showBulkModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            className="sd-section-card"
            style={{
              maxWidth: 550,
              width: '100%',
              padding: '24px 30px',
              borderRadius: 16,
              background: 'white',
              border: '1px solid #e2e8f0',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Bulk Upload Students
              </h2>
              <button
                onClick={() => setShowBulkModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            {!bulkReport ? (
              previewStudents ? (
                <div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 16 }}>
                    Please review the parsed students list from your CSV file before uploading.
                  </p>

                  <div
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      maxHeight: 250,
                      overflowY: 'auto',
                      marginBottom: 20,
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                      <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0 }}>
                        <tr>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Name</th>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>Email</th>
                          <th style={{ padding: '10px 12px', fontWeight: 600 }}>DOB</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewStudents.map((std, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 12px' }}>{std.name}</td>
                            <td style={{ padding: '10px 12px' }}>{std.email}</td>
                            <td style={{ padding: '10px 12px' }}>{std.dateOfBirth || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => setPreviewStudents(null)}
                      style={{
                        flex: 1,
                        padding: 12,
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        background: '#fafbfc',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmUpload}
                      disabled={isBulking}
                      style={{
                        flex: 1,
                        padding: 12,
                        border: 'none',
                        borderRadius: 8,
                        background: '#7c3aed',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {isBulking ? 'Uploading...' : 'Confirm Upload'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBulkUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                    Select a CSV file containing student accounts to import. You can download the template to see the expected headers format.
                  </p>

                  <div
                    onClick={handleDownloadTemplate}
                    style={{
                      padding: '14px 20px',
                      borderRadius: 10,
                      border: '1px dashed #cbd5e1',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FileText size={20} style={{ color: '#7c3aed' }} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>CSV Format Template</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Name, Email, Password, Date of Birth</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Download size={14} /> Download
                    </span>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 650, color: '#475569', marginBottom: 6 }}>SELECT CSV FILE</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv"
                      required
                      onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => setShowBulkModal(false)}
                      style={{
                        flex: 1,
                        padding: 12,
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        background: '#fafbfc',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: 12,
                        border: 'none',
                        borderRadius: 8,
                        background: '#7c3aed',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Parse CSV
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                  Upload Report
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 14 }}>
                  CSV processing complete. Successes: <strong style={{ color: '#10b981' }}>{bulkReport.successCount}</strong>, Failures: <strong style={{ color: '#ef4444' }}>{bulkReport.failureCount}</strong>.
                </p>

                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    maxHeight: 250,
                    overflowY: 'auto',
                    marginBottom: 20,
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{ padding: '10px 12px', fontWeight: 600 }}>Name</th>
                        <th style={{ padding: '10px 12px', fontWeight: 600 }}>Email</th>
                        <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkReport.results.map((res: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 12px' }}>{res.name}</td>
                          <td style={{ padding: '10px 12px' }}>{res.email}</td>
                          <td style={{ padding: '10px 12px' }}>
                            {res.success ? (
                              <span style={{ color: '#10b981', fontWeight: 600 }}>Success</span>
                            ) : (
                              <span style={{ color: '#ef4444', fontWeight: 600 }} title={res.error}>Failed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => setShowBulkModal(false)}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: 'none',
                    borderRadius: 8,
                    background: '#7c3aed',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Close Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
