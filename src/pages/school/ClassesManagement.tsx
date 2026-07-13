import { useState } from 'react';
import {
  Layers,
  Users,
  User,
  Plus,
  BookOpen,
  ArrowLeft,
  Search,
  Trash2,
  Calendar,
  ChevronRight,
  Sparkles,
  UserCheck,
  Tag
} from 'lucide-react';

// ─── Initial Mock Data ────────────────────────────────────────────────────────
const initialTeachers = [
  { id: 't1', name: 'Sarah Jenkins', expertise: 'Mathematics', initial: 'S' },
  { id: 't2', name: 'David Miller', expertise: 'Science', initial: 'D' },
  { id: 't3', name: 'Emma Watson', expertise: 'English Lit', initial: 'E' },
  { id: 't4', name: 'James Wilson', expertise: 'History', initial: 'J' },
  { id: 't5', name: 'Grace Taylor', expertise: 'Physical Education', initial: 'G' },
  { id: 't6', name: 'Robert Chen', expertise: 'Computing', initial: 'R' },
];

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

const initialClasses = [
  {
    id: 'c1',
    grade: 'Year 6',
    division: 'Division A',
    classTeacherId: 't1', // Sarah Jenkins
    students: ['s1', 's2', 's4'],
    subjectTeachers: [
      { subject: 'Mathematics', teacherId: 't1' },
      { subject: 'Science', teacherId: 't2' },
      { subject: 'English Lit', teacherId: 't3' },
    ]
  },
  {
    id: 'c2',
    grade: 'Year 5',
    division: 'Division B',
    classTeacherId: 't2', // David Miller
    students: ['s3', 's5'],
    subjectTeachers: [
      { subject: 'Mathematics', teacherId: 't1' },
      { subject: 'Science', teacherId: 't2' },
      { subject: 'History', teacherId: 't4' },
    ]
  },
  {
    id: 'c3',
    grade: 'Year 4',
    division: 'Division A',
    classTeacherId: 't4', // James Wilson
    students: ['s6', 's7'],
    subjectTeachers: [
      { subject: 'Computing', teacherId: 't6' },
      { subject: 'English Lit', teacherId: 't3' },
    ]
  },
  {
    id: 'c4',
    grade: 'Year 3',
    division: 'Division C',
    classTeacherId: 't5', // Grace Taylor
    students: ['s8'],
    subjectTeachers: [
      { subject: 'Physical Education', teacherId: 't5' },
      { subject: 'Mathematics', teacherId: 't1' },
    ]
  }
];

export default function ClassesManagement() {
  const [classes, setClasses] = useState(initialClasses);
  const [teachers] = useState(initialTeachers);
  const [students, setStudents] = useState(initialStudents);

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'subjects'>('students');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAssignSubjectModal, setShowAssignSubjectModal] = useState(false);

  // Forms
  const [newClass, setNewClass] = useState({ grade: 'Year 6', division: '', classTeacherId: 't1' });
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [newSubject, setNewSubject] = useState({ name: '', teacherId: 't1' });

  const activeClass = classes.find(c => c.id === selectedClassId);

  // Handlers
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.division) return;

    const createdClass = {
      id: `c${classes.length + 1}`,
      grade: newClass.grade,
      division: newClass.division,
      classTeacherId: newClass.classTeacherId,
      students: [],
      subjectTeachers: []
    };

    setClasses([...classes, createdClass]);
    setShowCreateModal(false);
    setNewClass({ grade: 'Year 6', division: '', classTeacherId: 't1' });
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
    setClasses(classes.map(c => {
      if (c.id === selectedClassId) {
        return { ...c, students: c.students.filter(id => id !== studentId) };
      }
      return c;
    }));
  };

  const handleAssignSubjectTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name || !selectedClassId) return;

    setClasses(classes.map(c => {
      if (c.id === selectedClassId) {
        // filter out if same subject already exists to update it
        const filtered = c.subjectTeachers.filter(s => s.subject.toLowerCase() !== newSubject.name.toLowerCase());
        return {
          ...c,
          subjectTeachers: [...filtered, { subject: newSubject.name, teacherId: newSubject.teacherId }]
        };
      }
      return c;
    }));

    setShowAssignSubjectModal(false);
    setNewSubject({ name: '', teacherId: 't1' });
  };

  const handleRemoveSubjectAssignment = (subjectName: string) => {
    if (!selectedClassId) return;
    setClasses(classes.map(c => {
      if (c.id === selectedClassId) {
        return {
          ...c,
          subjectTeachers: c.subjectTeachers.filter(s => s.subject !== subjectName)
        };
      }
      return c;
    }));
  };

  const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || 'Unknown';
  const getTeacherInitial = (id: string) => teachers.find(t => t.id === id)?.initial || '?';

  // Filters classes list
  const filteredClasses = classes.filter(c => 
    c.grade.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getTeacherName(c.classTeacherId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sd-page">
      {!selectedClassId ? (
        // ─── OVERVIEW GRID VIEW ───────────────────────────────────────────────────
        <>
          <div className="sd-topbar">
            <div>
              <h1 className="sd-title">Class Management</h1>
              <p className="sd-subtitle">Define grades, sections, class teachers and student rosters.</p>
            </div>
            <button className="sd-term-chip" onClick={() => setShowCreateModal(true)} style={{ cursor: 'pointer', background: 'var(--primary-purple)', color: 'white' }}>
              <Plus size={16} style={{ marginRight: 6 }} />
              Create New Class
            </button>
          </div>

          {/* Search bar */}
          <div className="sd-section-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search classes by grade, division, or class teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', color: 'var(--text-main)' }}
            />
          </div>

          {/* Classes Grid */}
          <div className="sd-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {filteredClasses.map((cls) => {
              const classTeacherName = getTeacherName(cls.classTeacherId);
              const classTeacherInitial = getTeacherInitial(cls.classTeacherId);
              return (
                <div key={cls.id} className="sd-kpi-card" style={{ flexDirection: 'column', padding: '24px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: 16 }}>
                    <div className="sd-kpi-icon" style={{ background: 'var(--primary-purple-light)', color: 'var(--primary-purple)' }}>
                      <Layers size={22} />
                    </div>
                    <span className="sd-pill sd-pill-blue" style={{ fontSize: '0.7rem' }}>
                      {cls.students.length} Enrolled
                    </span>
                  </div>

                  <h3 className="sd-action-label" style={{ fontSize: '1.2rem', marginBottom: 6 }}>
                    {cls.grade} – {cls.division}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, borderTop: '1px solid var(--border-light)', paddingTop: 12, width: '100%' }}>
                    <div className="sd-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{classTeacherInitial}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>CLASS TEACHER</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 650, color: 'var(--text-main)' }}>{classTeacherName}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setSelectedClassId(cls.id); setActiveTab('students'); }}
                    className="sd-link-btn" 
                    style={{ marginTop: 20, width: '100%', justifyContent: 'center', background: '#fafbfc', border: '1px solid var(--border-light)', padding: '8px', borderRadius: '8px' }}
                  >
                    Manage Class Roster
                    <ChevronRight size={14} style={{ marginLeft: 4 }} />
                  </button>
                </div>
              );
            })}
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
          <div className="sd-section-card" style={{ padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #fff 0%, rgba(88, 63, 192, 0.02) 100%)' }}>
            <div>
              <h1 className="sd-title" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                {activeClass?.grade} - {activeClass?.division}
                <Sparkles size={20} style={{ color: 'var(--warning-orange)' }} />
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserCheck size={16} style={{ color: 'var(--primary-purple)' }} />
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    Class Teacher: <strong>{getTeacherName(activeClass?.classTeacherId || '')}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={16} style={{ color: 'var(--accent-green)' }} />
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    Total Enrolled: <strong>{activeClass?.students.length} students</strong>
                  </span>
                </div>
              </div>
            </div>
            <div className="sd-avatar" style={{ width: 56, height: 56, fontSize: '1.4rem' }}>
              {activeClass?.grade.slice(-1)}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', gap: 24 }}>
            <button
              onClick={() => setActiveTab('students')}
              className={`sd-link-btn ${activeTab === 'students' ? 'active' : ''}`}
              style={{
                fontSize: '0.9rem',
                padding: '12px 4px',
                borderBottom: activeTab === 'students' ? '2.5px solid var(--primary-purple)' : 'none',
                borderRadius: 0,
                fontWeight: activeTab === 'students' ? 700 : 500,
                color: activeTab === 'students' ? 'var(--primary-purple)' : 'var(--text-secondary)',
                opacity: 1
              }}
            >
              <Users size={16} style={{ marginRight: 6 }} />
              Students Roster
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`sd-link-btn ${activeTab === 'subjects' ? 'active' : ''}`}
              style={{
                fontSize: '0.9rem',
                padding: '12px 4px',
                borderBottom: activeTab === 'subjects' ? '2.5px solid var(--primary-purple)' : 'none',
                borderRadius: 0,
                fontWeight: activeTab === 'subjects' ? 700 : 500,
                color: activeTab === 'subjects' ? 'var(--primary-purple)' : 'var(--text-secondary)',
                opacity: 1
              }}
            >
              <BookOpen size={16} style={{ marginRight: 6 }} />
              Subject Teachers
            </button>
          </div>

          {/* TAB CONTENTS */}
          {activeTab === 'students' ? (
            <div className="sd-section-card">
              <div className="sd-section-header">
                <span className="sd-section-title">Students Enrolled</span>
                <button className="sd-term-chip" onClick={() => setShowAddStudentModal(true)} style={{ cursor: 'pointer', background: 'var(--primary-purple-light)', color: 'var(--primary-purple)', border: '1px solid rgba(88, 63, 192, 0.15)' }}>
                  <Plus size={14} style={{ marginRight: 4 }} />
                  Enroll Student
                </button>
              </div>

              <div className="sd-table-wrapper">
                <table className="sd-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Date of Birth</th>
                      <th>Grade</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeClass?.students.map(stId => {
                      const studentObj = students.find(s => s.id === stId);
                      if (!studentObj) return null;
                      return (
                        <tr key={stId} className="sd-table-row">
                          <td className="sd-table-strong">
                            <div className="sd-teacher-cell">
                              <div className="sd-avatar">{studentObj.name.charAt(0)}</div>
                              {studentObj.name}
                            </div>
                          </td>
                          <td>{studentObj.email}</td>
                          <td>{studentObj.dob}</td>
                          <td>{studentObj.grade}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => handleRemoveStudentFromClass(stId)}
                              style={{ background: 'none', border: 'none', color: 'var(--danger-red)', cursor: 'pointer', padding: 6 }}
                              title="Remove from Class"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {activeClass?.students.length === 0 && (
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
            <div className="sd-section-card">
              <div className="sd-section-header">
                <span className="sd-section-title">Subject Mapping</span>
                <button className="sd-term-chip" onClick={() => setShowAssignSubjectModal(true)} style={{ cursor: 'pointer', background: 'var(--primary-purple-light)', color: 'var(--primary-purple)', border: '1px solid rgba(88, 63, 192, 0.15)' }}>
                  <Plus size={14} style={{ marginRight: 4 }} />
                  Assign Subject Teacher
                </button>
              </div>

              <div className="sd-table-wrapper">
                <table className="sd-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Assigned Teacher</th>
                      <th>Expertise / Department</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeClass?.subjectTeachers.map((subj, idx) => (
                      <tr key={idx} className="sd-table-row">
                        <td className="sd-table-strong">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Tag size={14} style={{ color: 'var(--primary-purple)' }} />
                            {subj.subject}
                          </div>
                        </td>
                        <td>
                          <div className="sd-teacher-cell">
                            <div className="sd-avatar">{getTeacherInitial(subj.teacherId)}</div>
                            {getTeacherName(subj.teacherId)}
                          </div>
                        </td>
                        <td>
                          <span className="sd-pill sd-pill-blue">
                            {teachers.find(t => t.id === subj.teacherId)?.expertise}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleRemoveSubjectAssignment(subj.subject)}
                            style={{ background: 'none', border: 'none', color: 'var(--danger-red)', cursor: 'pointer', padding: 6 }}
                            title="Unassign Subject"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {activeClass?.subjectTeachers.length === 0 && (
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
          <div className="sd-section-card" style={{ maxWidth: 460, width: '100%', padding: '24px 30px' }}>
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
                  {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>DIVISION / SECTION (e.g. Division A)</label>
                <input
                  type="text"
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
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: 12, border: '1px solid var(--border-light)', borderRadius: 8, background: '#fafbfc', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: 12, border: 'none', borderRadius: 8, background: 'var(--primary-purple)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
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
          <div className="sd-section-card" style={{ maxWidth: 460, width: '100%', padding: '24px 30px' }}>
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
                  {/* Filter out students already in this class */}
                  {students
                    .filter(st => !activeClass?.students.includes(st.id))
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
                <button type="submit" style={{ flex: 1, padding: 12, border: 'none', borderRadius: 8, background: 'var(--primary-purple)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
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
          <div className="sd-section-card" style={{ maxWidth: 460, width: '100%', padding: '24px 30px' }}>
            <h2 className="sd-title" style={{ fontSize: '1.3rem', marginBottom: 6 }}>Assign Subject Teacher</h2>
            <p className="sd-subtitle" style={{ marginBottom: 20 }}>Specify a subject and select the teacher to teach it in this class.</p>
            
            <form onSubmit={handleAssignSubjectTeacher} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>SUBJECT NAME (e.g. Science, Mathematics)</label>
                <input
                  type="text"
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
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.expertise})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAssignSubjectModal(false)} style={{ flex: 1, padding: 12, border: '1px solid var(--border-light)', borderRadius: 8, background: '#fafbfc', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 1, padding: 12, border: 'none', borderRadius: 8, background: 'var(--primary-purple)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
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
