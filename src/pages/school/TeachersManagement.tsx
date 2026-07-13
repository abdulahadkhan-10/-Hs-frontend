import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  useGetTeachersQuery,
  useAddTeacherMutation,
  useBulkUploadTeachersMutation,
  useGetSchoolClassesQuery,
} from '../../store/api/teacherApi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  Search,
  X,
  BookOpen,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Download,
  Upload,
} from 'lucide-react';

export default function TeachersManagement() {
  const user = useSelector((state: RootState) => state.auth.user);
  const schoolId = user?.profile?.id || '';

  const { data: teachersData, isLoading: teachersLoading } = useGetTeachersQuery(schoolId, {
    skip: !schoolId,
  });
  const { data: classesData } = useGetSchoolClassesQuery(schoolId, {
    skip: !schoolId,
  });

  const [addTeacher, { isLoading: isAdding }] = useAddTeacherMutation();
  const [bulkUploadTeachers, { isLoading: isBulking }] = useBulkUploadTeachersMutation();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    qualification: '',
    expertise: '',
    classIds: [] as string[],
    isClassTeacherOfClassId: '',
  });

  // Bulk Upload state
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkReport, setBulkReport] = useState<any | null>(null);
  const [previewTeachers, setPreviewTeachers] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter teachers
  const teachers = teachersData?.teachers || [];
  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.expertise?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadTemplate = () => {
    const headers = 'Name,Email,Password,Phone,Qualification,Expertise,Classes,Class Teacher Of\n';
    const row = 'Jane Doe,jane.doe@example.com,Password123!,1234567890,B.Ed,Mathematics,"Year 6 Division A, Year 5 Division B",Year 6 Division A\n';
    const blob = new Blob([headers + row], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'teachers_bulk_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Sample template downloaded successfully!');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and Email are required.');
      return;
    }

    try {
      await addTeacher({
        ...formData,
        schoolId,
        password: formData.password || undefined,
        isClassTeacherOfClassId: formData.isClassTeacherOfClassId || undefined,
      }).unwrap();

      toast.success('Teacher added successfully!');
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        qualification: '',
        expertise: '',
        classIds: [],
        isClassTeacherOfClassId: '',
      });
    } catch (err: any) {
      toast.error(err.data?.error || 'Failed to add teacher');
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
          // A simple CSV cell parser that handles double quotes
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
        const headers = rows[0].map((h) => h.toLowerCase());
        const dataRows = rows.slice(1).filter((r) => r.length > 1 && r[0]);

        const teachersList = dataRows.map((row) => {
          const teacherObj: any = {};
          headers.forEach((header, index) => {
            const val = row[index] || '';
            if (header === 'name') teacherObj.name = val;
            else if (header === 'email') teacherObj.email = val;
            else if (header === 'password') teacherObj.password = val;
            else if (header === 'phone') teacherObj.phone = val;
            else if (header === 'qualification') teacherObj.qualification = val;
            else if (header === 'expertise') teacherObj.expertise = val;
            else if (header === 'classes') teacherObj.classes = val;
            else if (header === 'class teacher of' || header === 'class_teacher_of') {
              teacherObj.isClassTeacherOfClass = val;
            }
          });
          return teacherObj;
        });

        setPreviewTeachers(teachersList);
        toast.success(`Successfully parsed ${teachersList.length} rows. Please review preview below.`);
      } catch (err: any) {
        toast.error('Failed to parse CSV file');
      }
    };
    reader.readAsText(bulkFile);
  };

  const handleConfirmUpload = async () => {
    if (!previewTeachers || previewTeachers.length === 0) return;
    try {
      const response = await bulkUploadTeachers({
        schoolId,
        teachers: previewTeachers,
      }).unwrap();

      setBulkReport(response);
      setPreviewTeachers(null);
      toast.success(`Successfully uploaded CSV. Successes: ${response.successCount}, Failures: ${response.failureCount}`);
    } catch (err: any) {
      toast.error(err.data?.error || 'Failed to process CSV file');
    }
  };

  return (
    <div className="sd-page">
      {/* ─── Header ────────────────────────────────────────── */}
      <div className="sd-topbar" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="sd-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={26} style={{ color: 'var(--primary-purple)' }} />
            Teacher Directory
          </h1>
          <p className="sd-subtitle">Manage faculty members, assign classes, and set class teachers.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => {
              setBulkReport(null);
              setBulkFile(null);
              setShowBulkModal(true);
            }}
            className="sd-term-chip"
            style={{
              cursor: 'pointer',
              background: '#f8fafc',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-light)',
            }}
          >
            <Upload size={15} style={{ marginRight: 6 }} />
            Bulk Upload (CSV)
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="sd-term-chip"
            style={{
              cursor: 'pointer',
              background: 'var(--primary-purple)',
              color: 'white',
            }}
          >
            <Plus size={15} style={{ marginRight: 6 }} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* ─── Search Bar ───────────────────────────────────── */}
      <div
        className="sd-section-card"
        style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
        }}
      >
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search teachers by name, email, or subject expertise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            fontSize: '0.88rem',
            color: 'var(--text-main)',
            background: 'transparent',
          }}
        />
      </div>

      {/* ─── Table / Skeleton Loading ────────────────────── */}
      <div
        className="sd-section-card"
        style={{
          padding: 0,
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
          overflow: 'hidden',
        }}
      >
        <div className="sd-table-wrapper">
          <table className="sd-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24 }}>Teacher Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Qualification</th>
                <th>Department / Expertise</th>
                <th>Class Teacher Role</th>
                <th style={{ textAlign: 'right', paddingRight: 24 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachersLoading ? (
                // Use react-loading-skeleton rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td style={{ paddingLeft: 24 }}><Skeleton width={120} height={20} /></td>
                    <td><Skeleton width={160} height={20} /></td>
                    <td><Skeleton width={100} height={20} /></td>
                    <td><Skeleton width={80} height={20} /></td>
                    <td><Skeleton width={110} height={20} /></td>
                    <td><Skeleton width={130} height={20} /></td>
                    <td style={{ textAlign: 'right', paddingRight: 24 }}><Skeleton width={80} height={28} /></td>
                  </tr>
                ))
              ) : filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="sd-table-row">
                    <td className="sd-table-strong" style={{ paddingLeft: 24 }}>
                      <div className="sd-teacher-cell">
                        <div className="sd-avatar">{teacher.name.charAt(0)}</div>
                        {teacher.name}
                      </div>
                    </td>
                    <td>{teacher.user.email}</td>
                    <td>{teacher.phone || 'N/A'}</td>
                    <td>{teacher.qualification || 'N/A'}</td>
                    <td>
                      <span className="sd-pill sd-pill-blue">{teacher.expertise || 'N/A'}</span>
                    </td>
                    <td>
                      {teacher.classTeacherOf && teacher.classTeacherOf.length > 0 ? (
                        teacher.classTeacherOf.map((cls) => (
                          <span
                            key={cls.id}
                            className="sd-status-dot"
                            style={{
                              background: 'var(--accent-green-bg)',
                              color: 'var(--accent-green)',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: '0.74rem',
                              fontWeight: 600,
                            }}
                          >
                            Class Teacher ({cls.grade} - {cls.division})
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>None</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: 24 }}>
                      <button
                        onClick={() => setSelectedTeacher(teacher)}
                        className="sd-link-btn"
                        style={{
                          background: 'white',
                          border: '1px solid var(--border-light)',
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No teachers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODALS ────────────────────────────────────────── */}

      {/* 1. View Details Modal */}
      {selectedTeacher && (
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
              padding: '28px 30px',
              position: 'relative',
              borderRadius: 16,
            }}
          >
            <button
              onClick={() => setSelectedTeacher(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div
                className="sd-avatar"
                style={{
                  width: 56,
                  height: 56,
                  fontSize: '1.4rem',
                  background: 'var(--primary-purple-light)',
                  color: 'var(--primary-purple)',
                }}
              >
                {selectedTeacher.name.charAt(0)}
              </div>
              <div>
                <h3 className="sd-title" style={{ fontSize: '1.4rem', marginBottom: 2 }}>
                  {selectedTeacher.name}
                </h3>
                <span className="sd-pill sd-pill-blue" style={{ fontSize: '0.74rem' }}>
                  {selectedTeacher.expertise || 'General Staff'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid var(--border-light)', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>EMAIL ADDRESS</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 550 }}>{selectedTeacher.user.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PHONE NUMBER</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 550 }}>{selectedTeacher.phone || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <GraduationCap size={16} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>QUALIFICATION</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 550 }}>{selectedTeacher.qualification || 'N/A'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Award size={16} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CLASS TEACHER DUTIES</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 650, marginTop: 4 }}>
                    {selectedTeacher.classTeacherOf && selectedTeacher.classTeacherOf.length > 0 ? (
                      selectedTeacher.classTeacherOf.map((c: any) => `${c.grade} - ${c.division}`).join(', ')
                    ) : (
                      <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>No designated class teacher assignment</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <BookOpen size={16} style={{ color: 'var(--text-muted)', marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ASSIGNED SUBJECT CLASSES</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {selectedTeacher.classes && selectedTeacher.classes.length > 0 ? (
                      selectedTeacher.classes.map((cls: any) => (
                        <span
                          key={cls.id}
                          className="sd-pill"
                          style={{
                            background: '#f1f5f9',
                            color: '#334155',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.74rem',
                          }}
                        >
                          {cls.grade} - {cls.division}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No class rosters assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTeacher(null)}
              className="login-btn"
              style={{
                width: '100%',
                marginTop: 28,
                background: '#f8fafc',
                color: 'var(--text-main)',
                border: '1px solid var(--border-light)',
                boxShadow: 'none',
              }}
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* 2. Add Teacher Modal */}
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
              maxWidth: 550,
              width: '100%',
              padding: '24px 30px',
              borderRadius: 16,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <h2 className="sd-title" style={{ fontSize: '1.3rem', marginBottom: 6 }}>
              Add Single Teacher
            </h2>
            <p className="sd-subtitle" style={{ marginBottom: 20 }}>
              Create a login user account and a profile for a new teacher.
            </p>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="input-label">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="form-input"
                  style={{ paddingLeft: 12 }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="input-label">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@school.com"
                    className="form-input"
                    style={{ paddingLeft: 12 }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">PASSWORD (DEFAULT PASSWORD)</label>
                  <input
                    type="password"
                    placeholder="Password123!"
                    className="form-input"
                    style={{ paddingLeft: 12 }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="input-label">PHONE NUMBER</label>
                  <input
                    type="text"
                    placeholder="e.g. +44 123 4567"
                    className="form-input"
                    style={{ paddingLeft: 12 }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">QUALIFICATION</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Ed, M.Sc"
                    className="form-input"
                    style={{ paddingLeft: 12 }}
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="input-label">DEPARTMENT / AREA OF EXPERTISE</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Science"
                  className="form-input"
                  style={{ paddingLeft: 12 }}
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                />
              </div>

              {/* Subject Classes Select Checkboxes */}
              <div>
                <label className="input-label">ASSIGN SUBJECT CLASSES</label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                    maxHeight: 120,
                    overflowY: 'auto',
                    border: '1px solid var(--border-light)',
                    borderRadius: 8,
                    padding: 10,
                    marginTop: 4,
                  }}
                >
                  {classesData?.classes && classesData.classes.length > 0 ? (
                    classesData.classes.map((cls) => (
                      <label
                        key={cls.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.classIds.includes(cls.id)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...formData.classIds, cls.id]
                              : formData.classIds.filter((id) => id !== cls.id);
                            setFormData({ ...formData, classIds: updated });
                          }}
                        />
                        {cls.grade} - {cls.division}
                      </label>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No classes available. Create classes first.</span>
                  )}
                </div>
              </div>

              {/* Class Teacher Dropdown */}
              <div>
                <label className="input-label">DESIGNATE AS CLASS TEACHER FOR</label>
                <select
                  className="form-input"
                  style={{ paddingLeft: 12, height: 42, width: '100%', marginTop: 4 }}
                  value={formData.isClassTeacherOfClassId}
                  onChange={(e) => setFormData({ ...formData, isClassTeacherOfClassId: e.target.value })}
                >
                  <option value="">-- No Class Teacher Duty --</option>
                  {classesData?.classes?.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.grade} - {cls.division}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: 12,
                    border: '1px solid var(--border-light)',
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
                    background: 'var(--primary-purple)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {isAdding ? 'Adding...' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Bulk Upload Modal */}
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
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 className="sd-title" style={{ fontSize: '1.3rem' }}>
                Bulk Upload Teachers
              </h2>
              <button
                onClick={() => setShowBulkModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {!bulkReport ? (
              previewTeachers ? (
                <div>
                  <p className="sd-subtitle" style={{ marginBottom: 16 }}>
                    Please review the parsed teachers list from your CSV file. Non-existent classes will be automatically created in the database.
                  </p>

                  <div
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: 12,
                      maxHeight: 250,
                      overflowY: 'auto',
                      marginBottom: 20,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    <table className="sd-table" style={{ margin: 0, fontSize: '0.82rem' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px 12px' }}>Name</th>
                          <th style={{ padding: '8px 12px' }}>Email</th>
                          <th style={{ padding: '8px 12px' }}>Expertise</th>
                          <th style={{ padding: '8px 12px' }}>Classes</th>
                          <th style={{ padding: '8px 12px' }}>Class Teacher Of</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewTeachers.map((t: any, idx: number) => (
                          <tr key={idx} className="sd-table-row">
                            <td style={{ padding: '8px 12px', fontWeight: 600 }}>{t.name}</td>
                            <td style={{ padding: '8px 12px' }}>{t.email}</td>
                            <td style={{ padding: '8px 12px' }}>{t.expertise || 'N/A'}</td>
                            <td style={{ padding: '8px 12px' }}>
                              <span style={{ fontSize: '0.74rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#334155' }}>
                                {t.classes || 'None'}
                              </span>
                            </td>
                            <td style={{ padding: '8px 12px' }}>
                              {t.isClassTeacherOfClass ? (
                                <span style={{ fontSize: '0.74rem', background: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                                  {t.isClassTeacherOfClass}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)' }}>None</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewTeachers(null);
                        setBulkFile(null);
                      }}
                      style={{
                        flex: 1,
                        padding: 12,
                        border: '1px solid var(--border-light)',
                        borderRadius: 8,
                        background: '#fafbfc',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Clear & Reselect
                    </button>
                    <button
                      onClick={handleConfirmUpload}
                      disabled={isBulking}
                      style={{
                        flex: 1,
                        padding: 12,
                        border: 'none',
                        borderRadius: 8,
                        background: 'var(--primary-purple)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {isBulking ? 'Uploading & Creating...' : `Upload ${previewTeachers.length} Teachers`}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="sd-subtitle" style={{ marginBottom: 20 }}>
                    Upload a CSV file containing lists of teachers. We will create accounts and map classes.
                  </p>

                  {/* Download sample */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, rgba(88, 63, 192, 0.03) 0%, rgba(88, 63, 192, 0.01) 100%)',
                      border: '1px dashed var(--primary-purple)',
                      marginBottom: 20,
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Need a template?
                      </h4>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Download our template with pre-defined headers to begin.
                      </span>
                    </div>
                    <button
                      onClick={handleDownloadTemplate}
                      className="sd-term-chip"
                      style={{
                        background: 'var(--primary-purple-light)',
                        color: 'var(--primary-purple)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      <Download size={14} style={{ marginRight: 4 }} />
                      Download Sample
                    </button>
                  </div>

                  <form onSubmit={handleBulkUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label className="input-label">SELECT CSV FILE</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          height: 120,
                          border: '2px dashed var(--border-light)',
                          borderRadius: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                          background: '#f8fafc',
                          marginTop: 4,
                        }}
                      >
                        <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                          {bulkFile ? bulkFile.name : 'Click to select CSV File'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          Max file size: 5MB
                        </span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".csv"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setBulkFile(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      <button
                        type="button"
                        onClick={() => setShowBulkModal(false)}
                        style={{
                          flex: 1,
                          padding: 12,
                          border: '1px solid var(--border-light)',
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
                        disabled={isBulking || !bulkFile}
                        style={{
                          flex: 1,
                          padding: 12,
                          border: 'none',
                          borderRadius: 8,
                          background: 'var(--primary-purple)',
                          color: 'white',
                          cursor: 'pointer',
                          fontWeight: 600,
                          opacity: bulkFile ? 1 : 0.6,
                        }}
                      >
                        {isBulking ? 'Parsing file...' : 'Preview CSV'}
                      </button>
                    </div>
                  </form>
                </>
              )
            ) : (
              // Report screen
              <div>
                <div style={{ display: 'flex', gap: 24, margin: '20px 0', justifyContent: 'space-around' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                      {bulkReport.successCount}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      SUCCESSFULLY SYNCED
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger-red)' }}>
                      {bulkReport.failureCount}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      FAILED RECORDS
                    </div>
                  </div>
                </div>

                {bulkReport.failureCount > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: 8, color: 'var(--danger-red)' }}>
                      Failure Log:
                    </h4>
                    <div
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: 8,
                        maxHeight: 150,
                        overflowY: 'auto',
                        padding: 10,
                        background: '#fff5f5',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      {bulkReport.results
                        .filter((r: any) => !r.success)
                        .map((r: any, idx: number) => (
                          <div key={idx} style={{ fontSize: '0.74rem', color: '#b91c1c' }}>
                            • <strong>{r.name}</strong> ({r.email}): {r.error}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowBulkModal(false)}
                  className="login-btn"
                  style={{
                    width: '100%',
                    marginTop: 24,
                    background: 'var(--primary-purple)',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
