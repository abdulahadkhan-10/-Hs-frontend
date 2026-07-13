import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  useGetSchoolClassesQuery,
  useGetTeachersQuery,
  useCreateClassMutation,
} from '../../store/api/teacherApi';
import { toast } from 'sonner';
import {
  Layers,
  Plus,
  ArrowLeft,
  Search,
  Trash2,
  ChevronRight,
  UserCheck,
  Tag
} from 'lucide-react';

// ─── Initial Mock Data ────────────────────────────────────────────────────────
const initialStudents = [
  { id: 's1', name: 'Oliver Smith', email: 'oliver.smith@gmail.com', dob: '12/04/2014', grade: 'Year 6' },
  { id: 's2', name: 'Sophia Brown', email: 'sophia.brown@gmail.com', dob: '23/08/2014', grade: 'Year 6' },
  { id: 's3', name: 'Lucas Davis', email: 'lucas.davis@gmail.com', dob: '05/11/2015', grade: 'Year 5' },
  { id: 's4', name: 'Mia Johnson', email: 'mia.johnson@gmail.com', dob: '19/02/2014', grade: 'Year 6' },
  { id: 's5', name: 'Ethan Garcia', email: 'ethan.garcia@gmail.com', dob: '30/09/2015', grade: 'Year 5' },
  { id: 's6', name: 'Isabella Martinez', email: 'isabella.m@gmail.com', dob: '14/01/2016', grade: 'Year 4' },
  { id: 's7', name: 'Mason Rodriguez', email: 'mason.r@gmail.com', dob: '08/07/2016', grade: 'Year 4' },
  { id: 's8', name: 'Charlotte Avery', email: 'charlotte.a@gmail.com', dob: '22/05/2017', grade: 'Year 3' },
];

export default function ClassesManagement() {
  const user = useSelector((state: RootState) => state.auth.user);
  const schoolId = user?.profile?.id || '';

  const { data: classesData } = useGetSchoolClassesQuery(schoolId, { skip: !schoolId });
  const { data: teachersData } = useGetTeachersQuery(schoolId, { skip: !schoolId });
  const [createClass] = useCreateClassMutation();

  const [classes, setClasses] = useState<any[]>([]);
  const teachers = teachersData?.teachers || [];
  const [students] = useState(initialStudents);

  useEffect(() => {
    if (classesData?.classes) {
      setClasses(classesData.classes);
    }
  }, [classesData]);

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'subjects'>('students');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAssignSubjectModal, setShowAssignSubjectModal] = useState(false);

  // Forms
  const [newClass, setNewClass] = useState({ grade: 'Year 6', division: '', classTeacherId: '' });
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [newSubject, setNewSubject] = useState({ name: '', teacherId: '' });

  const activeClass = classes.find(c => c.id === selectedClassId);

  // Handlers
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.division) return;

    try {
      await createClass({
        grade: newClass.grade,
        division: newClass.division,
        schoolId,
        classTeacherId: newClass.classTeacherId || undefined,
      }).unwrap();

      toast.success('Class created successfully!');
      setShowCreateModal(false);
      setNewClass({ grade: 'Year 6', division: '', classTeacherId: '' });
    } catch (err: any) {
      toast.error(err.data?.error || 'Failed to create class');
    }
  };

  const handleAddStudentToClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedClassId) return;

    setClasses(classes.map(c => {
      if (c.id === selectedClassId) {
        // Prevent duplicate
        if (c.students.includes(selectedStudentId)) return c;
        return { ...c, students: [...c.students, selectedStudentId] };
      }
      return c;
    }));

    setShowAddStudentModal(false);
    setSelectedStudentId('');
  };

  const handleRemoveStudentFromClass = (studentId: string) => {
    if (!selectedClassId) return;
    setClasses(classes.map((c: any) => {
      if (c.id === selectedClassId) {
        return { ...c, students: c.students.filter((id: string) => id !== studentId) };
      }
      return c;
    }));
  };

  const handleAssignSubjectTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name || !selectedClassId) return;

    setClasses(classes.map((c: any) => {
      if (c.id === selectedClassId) {
        // filter out if same subject already exists to update it
        const filtered = c.subjectTeachers.filter((s: any) => s.subject.toLowerCase() !== newSubject.name.toLowerCase());
        return {
          ...c,
          subjectTeachers: [...filtered, { subject: newSubject.name, teacherId: newSubject.teacherId }]
        };
      }
      return c;
    }));

    setShowAssignSubjectModal(false);
    setNewSubject({ name: '', teacherId: '' });
  };

  const handleRemoveSubjectAssignment = (subjectName: string) => {
    if (!selectedClassId) return;
    setClasses(classes.map((c: any) => {
      if (c.id === selectedClassId) {
        return {
          ...c,
          subjectTeachers: c.subjectTeachers.filter((s: any) => s.subject !== subjectName)
        };
      }
      return c;
    }));
  };

  const getTeacherName = (id: string) => teachers.find((t: any) => t.id === id)?.name || 'None Assigned';
  const getTeacherInitial = (id: string) => teachers.find((t: any) => t.id === id)?.name?.charAt(0) || '?';

  // Filters classes list
  const filteredClasses = classes.filter((c: any) => 
    c.grade.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getTeacherName(c.classTeacherId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sd-page">
      {!selectedClassId ? (
        // ─── OVERVIEW GRID VIEW ───────────────────────────────────────────────────
        <>

          <div className="sd-topbar" style={{ marginBottom: '24px' }}>
            <div>
  <h1 className="sd-title" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
                <Layers size={26} />
                Class Management
                </h1>
              <p className="sd-subtitle" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>Oversee rosters, assign educators, and manage curriculum modules.</p>
            </div>
          </div>

          {/* Search bar and Create Button */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <div className="sd-section-card" style={{ flex: 1, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: '30px', background: 'rgba(255,255,255,0.9)' }}>
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search classes, teachers, or students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', color: 'var(--text-main)', background: 'transparent' }}
              />
            </div>
            <button 
              onClick={() => setShowCreateModal(true)} 
              style={{ cursor: 'pointer', background: 'linear-gradient(135deg, var(--primary), var(--primary-mid))', color: 'white', border: 'none', borderRadius: '30px', padding: '0 32px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(61,82,72,0.3)', transition: 'all 0.2s' }}
            >
              <Plus size={18} />
              Create New Class
            </button>
          </div>

          {/* Classes Grid */}
          <div className="sd-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {filteredClasses.map((cls) => {
              const classTeacherName = getTeacherName(cls.classTeacherId);
              const mockPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(classTeacherName)}&background=random&color=fff`;

              return (
                <div key={cls.id} className="sd-kpi-card" style={{ flexDirection: 'column', padding: '24px', position: 'relative', borderRadius: '16px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '16px' }}>
                    <h3 className="sd-action-label" style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      {cls.grade} - {cls.division}
                    </h3>
                    <span className="sd-pill sd-pill-blue" style={{ fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', background: 'rgba(61, 82, 72, 0.1)', color: 'var(--primary)' }}>
                      {cls.students ? cls.students.length : 0} Enrolled
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px', width: '100%' }}>
                    <img src={mockPhotoUrl} alt={classTeacherName} style={{ width: 36, height: 36, borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{classTeacherName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Lead Educator</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setSelectedClassId(cls.id); setActiveTab('students'); }}
                    style={{ marginTop: '16px', width: '100%', justifyContent: 'center', background: 'var(--primary-light)', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                  >
                    Manage Class Roster
                    <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}

            {/* Draft New Cohort Placeholder */}
            <div className="sd-kpi-card" style={{ flexDirection: 'column', padding: '24px', position: 'relative', borderRadius: '16px', background: 'rgba(255,255,255,0.4)', border: '2px dashed rgba(61, 82, 72, 0.2)', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => setShowCreateModal(true)}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(61, 82, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '16px' }}>
                <Plus size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>Draft New Cohort</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Set up a new curriculum track</p>
            </div>
          </div>

          {/* Empty State */}
          {filteredClasses.length === 0 && (
            <div className="sd-section-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Layers size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <h3>No classes found</h3>
              <p style={{ fontSize: '0.84rem', marginTop: 4 }}>Try adjusting your search terms or create a new class.</p>
            </div>
          )}
        </>
      ) : (
        // ─── CLASS DETAILS VIEW ──────────────────────────────────────────────────
        <>
          <div className="sd-topbar">
            <button onClick={() => setSelectedClassId(null)} className="sd-link-btn" style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <ArrowLeft size={16} style={{ marginRight: 6 }} />
              Back to Classes
            </button>
            <div className="sd-term-chip">
              <span className="sd-term-dot" />
              Academic Class File
            </div>
          </div>

          {/* Class Summary Banner */}
          <div className="sd-section-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #3d5248, #6b8c7a)', color: 'white', borderRadius: '12px', boxShadow: '0 10px 20px -5px rgba(61, 82, 72, 0.2)' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px' }}>Active Cohort</span>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px' }}>Advanced Track</span>
              </div>
              <h1 className="sd-title" style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px 0', color: 'white', letterSpacing: '-0.3px' }}>
                {activeClass?.grade} - {activeClass?.division}
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Homeroom: Rm 402 • Capacity: {activeClass?.students?.length || 0}/30
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center', minWidth: '90px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2px' }}>98%</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5px' }}>Attendance</div>
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center', minWidth: '90px' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2px' }}>4.2</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5px' }}>Avg GPA</div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)', gap: '32px', padding: '0 8px', marginBottom: '32px', marginTop: '16px' }}>
            <button
              onClick={() => setActiveTab('students')}
              style={{
                fontSize: '0.9rem',
                padding: '16px 4px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'students' ? '3px solid var(--primary)' : '3px solid transparent',
                borderRadius: 0,
                fontWeight: activeTab === 'students' ? 800 : 600,
                color: activeTab === 'students' ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Students Roster
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              style={{
                fontSize: '0.9rem',
                padding: '16px 4px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'subjects' ? '3px solid var(--primary)' : '3px solid transparent',
                borderRadius: 0,
                fontWeight: activeTab === 'subjects' ? 800 : 600,
                color: activeTab === 'subjects' ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Subject Teachers
            </button>
            <button
              style={{
                fontSize: '0.9rem',
                padding: '16px 4px',
                background: 'none',
                border: 'none',
                borderBottom: '3px solid transparent',
                borderRadius: 0,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              Curriculum Mapping
            </button>
          </div>

          {/* TAB CONTENTS */}
          {activeTab === 'students' ? (
            <div className="sd-section-card" style={{ background: '#ffffff', borderRadius: '24px', padding: '32px' }}>
              <div className="sd-section-header" style={{ marginBottom: '24px', background: 'transparent', padding: 0, border: 'none' }}>
                <span className="sd-section-title" style={{ fontSize: '1.4rem', fontWeight: 800 }}>Enrolled Students</span>
                <button className="sd-term-chip" onClick={() => setShowAddStudentModal(true)} style={{ cursor: 'pointer', background: 'transparent', color: 'var(--primary)', border: '1px solid rgba(61, 82, 72, 0.2)', padding: '8px 16px', borderRadius: '20px', fontWeight: 600 }}>
                  <UserCheck size={14} style={{ marginRight: 6 }} />
                  Enroll Student
                </button>
              </div>

              <div className="sd-table-wrapper" style={{ margin: '0 -16px', paddingBottom: 0 }}>
                <table className="sd-table" style={{ borderSpacing: '0 12px', borderCollapse: 'separate', width: '100%', padding: '0 16px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', border: 'none', textTransform: 'none', letterSpacing: '0.5px' }}>Student Name</th>
                      <th style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', border: 'none', textTransform: 'none', letterSpacing: '0.5px' }}>Email Contact</th>
                      <th style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', border: 'none', textTransform: 'none', letterSpacing: '0.5px' }}>DOB</th>
                      <th style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', border: 'none', textTransform: 'none', letterSpacing: '0.5px' }}>Grade Level</th>
                      <th style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', border: 'none', textTransform: 'none', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeClass?.students?.map((stId: any) => {
                      const studentObj = students.find(s => s.id === stId);
                      if (!studentObj) return null;
                      return (
                        <tr key={stId} className="sd-table-row" style={{ background: 'var(--primary-light)' }}>
                          <td className="sd-table-strong" style={{ padding: '16px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px', borderTop: 'none', borderBottom: 'none' }}>
                            <div className="sd-teacher-cell" style={{ gap: '16px' }}>
                              <div className="sd-avatar" style={{ background: '#ffffff', color: 'var(--primary)', fontWeight: 700, border: 'none' }}>{studentObj.name.charAt(0)}{studentObj.name.split(' ')[1]?.charAt(0)}</div>
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{studentObj.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px', color: 'var(--text-secondary)', borderTop: 'none', borderBottom: 'none' }}>{studentObj.email}</td>
                          <td style={{ padding: '16px', color: 'var(--text-secondary)', borderTop: 'none', borderBottom: 'none' }}>{studentObj.dob}</td>
                          <td style={{ padding: '16px', borderTop: 'none', borderBottom: 'none' }}>
                            <span style={{ background: '#f5e6a0', color: '#7a5c00', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>{studentObj.grade}</span>
                          </td>
                          <td style={{ textAlign: 'right', padding: '16px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', borderTop: 'none', borderBottom: 'none' }}>
                            <button
                              onClick={() => handleRemoveStudentFromClass(stId)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 8, opacity: 0.8 }}
                              title="Remove from Class"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {(!activeClass?.students || activeClass.students.length === 0) && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          No students currently enrolled in this class.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="sd-section-card" style={{ background: '#ffffff', borderRadius: '24px', padding: '32px' }}>
              <div className="sd-section-header" style={{ marginBottom: '24px', background: 'transparent', padding: 0, border: 'none' }}>
                <span className="sd-section-title" style={{ fontSize: '1.4rem', fontWeight: 800 }}>Subject Mapping</span>
                <button className="sd-term-chip" onClick={() => setShowAssignSubjectModal(true)} style={{ cursor: 'pointer', background: 'transparent', color: 'var(--primary)', border: '1px solid rgba(61, 82, 72, 0.2)', padding: '8px 16px', borderRadius: '20px', fontWeight: 600 }}>
                  <Plus size={14} style={{ marginRight: 6 }} />
                  Assign Subject Teacher
                </button>
              </div>

              <div className="sd-table-wrapper" style={{ margin: '0 -16px', paddingBottom: 0 }}>
                <table className="sd-table" style={{ borderSpacing: '0 12px', borderCollapse: 'separate', width: '100%', padding: '0 16px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', border: 'none', textTransform: 'none', letterSpacing: '0.5px' }}>Subject</th>
                      <th style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', border: 'none', textTransform: 'none', letterSpacing: '0.5px' }}>Assigned Teacher</th>
                      <th style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', border: 'none', textTransform: 'none', letterSpacing: '0.5px' }}>Expertise / Department</th>
                      <th style={{ padding: '0 16px 8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', border: 'none', textTransform: 'none', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeClass?.subjectTeachers?.map((subj: any, idx: number) => (
                      <tr key={idx} className="sd-table-row" style={{ background: 'var(--primary-light)' }}>
                        <td className="sd-table-strong" style={{ padding: '16px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px', borderTop: 'none', borderBottom: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Tag size={14} style={{ color: 'var(--primary)' }} />
                            {subj.subject}
                          </div>
                        </td>
                        <td style={{ padding: '16px', borderTop: 'none', borderBottom: 'none' }}>
                          <div className="sd-teacher-cell">
                            <div className="sd-avatar" style={{ background: '#ffffff', color: 'var(--primary)', border: 'none' }}>{getTeacherInitial(subj.teacherId)}</div>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{getTeacherName(subj.teacherId)}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px', borderTop: 'none', borderBottom: 'none' }}>
                          <span className="sd-pill sd-pill-blue">
                            {teachers.find((t: any) => t.id === subj.teacherId)?.expertise || 'Expert'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', padding: '16px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', borderTop: 'none', borderBottom: 'none' }}>
                          <button
                            onClick={() => handleRemoveSubjectAssignment(subj.subject)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 8, opacity: 0.8 }}
                            title="Unassign Subject"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!activeClass?.subjectTeachers || activeClass.subjectTeachers.length === 0) && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          No subject teachers assigned yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── MODALS ────────────────────────────────────────────────────────────── */}
      
      {/* 1. Create Class Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="sd-section-card" style={{ maxWidth: 460, width: '100%', padding: '24px 30px', margin: 'auto' }}>
            <h2 className="sd-title" style={{ fontSize: '1.3rem', marginBottom: 6 }}>Create New Class</h2>
            <p className="sd-subtitle" style={{ marginBottom: 20 }}>Specify class details and assign a class teacher.</p>
            
            <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>YEAR GROUP / GRADE</label>
                <select
                  value={newClass.grade}
                  onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem' }}
                >
                  {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12'].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>DIVISION / SECTION (e.g. Division A)</label>
                <input
                  type="text"
                  className="sd-form-input"
                  placeholder="e.g. Division A"
                  required
                  value={newClass.division}
                  onChange={(e) => setNewClass({ ...newClass, division: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>ASSIGN CLASS TEACHER</label>
                <select
                  value={newClass.classTeacherId}
                  onChange={(e) => setNewClass({ ...newClass, classTeacherId: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem' }}
                >
                  <option value="">-- Assign Teacher --</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: 12, border: '1px solid var(--border-light)', borderRadius: 8, background: '#fafbfc', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: 12, border: 'none', borderRadius: 8, background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Enroll Student Modal */}
      {showAddStudentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="sd-section-card" style={{ maxWidth: 460, width: '100%', padding: '24px 30px', margin: 'auto' }}>
            <h2 className="sd-title" style={{ fontSize: '1.3rem', marginBottom: 6 }}>Enroll Student</h2>
            <p className="sd-subtitle" style={{ marginBottom: 20 }}>Select an existing student to enroll into this class.</p>
            
            <form onSubmit={handleAddStudentToClass} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>STUDENT NAME</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem' }}
                >
                  <option value="">-- Select Student --</option>
                  {students
                    .filter(st => !activeClass?.students?.includes(st.id))
                    .map(st => (
                      <option key={st.id} value={st.id}>{st.name} ({st.grade})</option>
                    ))
                  }
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAddStudentModal(false)} style={{ flex: 1, padding: 12, border: '1px solid var(--border-light)', borderRadius: 8, background: '#fafbfc', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: 12, border: 'none', borderRadius: 8, background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                  Add to Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Assign Subject Teacher Modal */}
      {showAssignSubjectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="sd-section-card" style={{ maxWidth: 460, width: '100%', padding: '24px 30px', margin: 'auto' }}>
            <h2 className="sd-title" style={{ fontSize: '1.3rem', marginBottom: 6 }}>Assign Subject Teacher</h2>
            <p className="sd-subtitle" style={{ marginBottom: 20 }}>Specify a subject and select the teacher to teach it in this class.</p>
            
            <form onSubmit={handleAssignSubjectTeacher} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>SUBJECT NAME (e.g. Science, Mathematics)</label>
                <input
                  type="text"
                  className="sd-form-input"
                  placeholder="e.g. History"
                  required
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>ASSIGN TEACHER</label>
                <select
                  value={newSubject.teacherId}
                  onChange={(e) => setNewSubject({ ...newSubject, teacherId: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.88rem' }}
                >
                  <option value="">-- Assign Teacher --</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.expertise || 'Expertise'})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAssignSubjectModal(false)} style={{ flex: 1, padding: 12, border: '1px solid var(--border-light)', borderRadius: 8, background: '#fafbfc', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: 12, border: 'none', borderRadius: 8, background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                  Assign Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
