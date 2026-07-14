import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setCredentials } from '../../store/slices/authSlice';
import { toast } from 'sonner';
import { Save, User, BookOpen } from 'lucide-react';
import { useUpdateProfileMutation } from '../../store/api/profileApi';

export default function TeacherSettings() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(user?.profile?.name || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '+44 7700 900077');
  const [qualification, setQualification] = useState(user?.profile?.qualification || 'B.Ed in Secondary Mathematics');
  const [expertise, setExpertise] = useState(user?.profile?.expertise || 'Algebra, Calculus, Primary Science');

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const response = await updateProfile({
        name,
        phone,
        qualification,
        expertise
      }).unwrap();

      if (user) {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            ...response.profile
          }
        };
        dispatch(setCredentials({ user: updatedUser }));
      }
      toast.success('Profile settings updated successfully!');
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="teacher-settings-wrapper">
      <style>{`
        .teacher-settings-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-card {
          background: white;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          padding: 24px;
          max-width: 650px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .settings-section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1.5px solid #f1f5f9;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .settings-section-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

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
          padding: 10px 12px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          font-size: 13.5px;
          outline: none;
          background: white;
        }

        .form-input:focus {
          border-color: #c06d48;
        }
      `}</style>

      <form onSubmit={handleUpdateProfile} className="settings-card">
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Educator Settings</h2>

        {/* Section 1: Personal Info */}
        <div>
          <div className="settings-section-header">
            <User size={16} style={{ color: '#c06d48' }} />
            <h3 className="settings-section-title">Personal Information</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-row">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-row">
                <label className="form-label">Email Address (Registered)</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-row">
                <label className="form-label">Phone Contact</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Qualifications & Expertises */}
        <div style={{ marginTop: '10px' }}>
          <div className="settings-section-header">
            <BookOpen size={16} style={{ color: '#059669' }} />
            <h3 className="settings-section-title">Professional Profile</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-row">
              <label className="form-label">Degrees & Qualifications</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. M.Sc in Mathematics, B.Ed"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Teaching Expertise Areas</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Algebra, Reading, Creative writing"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="action-btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={isLoading}>
          <Save size={16} /> {isLoading ? 'Saving Changes...' : 'Save Changes & Update Profile'}
        </button>
      </form>
    </div>
  );
}
