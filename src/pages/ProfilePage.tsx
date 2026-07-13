import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useUpdateProfileMutation, useChangePasswordMutation } from '../store/api/profileApi';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  GraduationCap,
  BookOpen,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Edit3,
  Check,
  X,
  Key,
  ChevronDown,
  ChevronUp,
  Star,
  Globe,
} from 'lucide-react';

// ─── Role-based field config ──────────────────────────────────────────────────
interface FieldDef {
  key: string;
  label: string;
  icon: any;
  editable: boolean;
  type?: 'text' | 'date' | 'email';
  placeholder?: string;
  badge?: string;
  getValue?: (profile: any) => string; // optional resolver for nested/computed values
}

const roleFields: Record<string, { editable: FieldDef[]; readOnly: FieldDef[] }> = {
  SCHOOL: {
    editable: [
      { key: 'schoolName', label: 'School Name', icon: Building2, editable: true, type: 'text', placeholder: 'Enter school name' },
      { key: 'address', label: 'Address', icon: MapPin, editable: true, type: 'text', placeholder: 'Enter address' },
      { key: 'city', label: 'City', icon: MapPin, editable: true, type: 'text', placeholder: 'Enter city' },
      { key: 'state', label: 'State / County', icon: Globe, editable: true, type: 'text', placeholder: 'Enter state' },
      { key: 'postalCode', label: 'Postal Code', icon: MapPin, editable: true, type: 'text', placeholder: 'Enter postal code' },
    ],
    readOnly: [
      { key: 'region', label: 'Region', icon: Globe, editable: false, badge: 'Region' },
      { key: 'schoolKey', label: 'School Key', icon: Key, editable: false, badge: 'System ID' },
    ],
  },
  TEACHER: {
    editable: [
      { key: 'name', label: 'Full Name', icon: User, editable: true, type: 'text', placeholder: 'Enter your name' },
      { key: 'phone', label: 'Phone Number', icon: Phone, editable: true, type: 'text', placeholder: 'Enter phone number' },
      { key: 'qualification', label: 'Qualification', icon: GraduationCap, editable: true, type: 'text', placeholder: 'e.g. B.Ed, M.Sc' },
      { key: 'expertise', label: 'Expertise / Department', icon: Star, editable: true, type: 'text', placeholder: 'e.g. Mathematics' },
    ],
    readOnly: [
      {
        key: 'school',
        label: 'Assigned School',
        icon: Building2,
        editable: false,
        badge: 'Assigned',
        getValue: (p: any) => p?.school?.schoolName || '—',
      },
    ],
  },
  STUDENT: {
    editable: [
      { key: 'name', label: 'Full Name', icon: User, editable: true, type: 'text', placeholder: 'Enter your name' },
      { key: 'dateOfBirth', label: 'Date of Birth', icon: User, editable: true, type: 'date', placeholder: '' },
    ],
    readOnly: [
      { key: 'grade', label: 'Grade / Year', icon: GraduationCap, editable: false, badge: 'Grade' },
      {
        key: 'school',
        label: 'School',
        icon: Building2,
        editable: false,
        badge: 'Enrolled',
        getValue: (p: any) => p?.school?.schoolName || '—',
      },
    ],
  },
  PARENT: {
    editable: [
      { key: 'name', label: 'Full Name', icon: User, editable: true, type: 'text', placeholder: 'Enter your name' },
      { key: 'phone', label: 'Phone Number', icon: Phone, editable: true, type: 'text', placeholder: 'Enter phone number' },
      { key: 'region', label: 'Region', icon: Globe, editable: true, type: 'text', placeholder: 'Enter your region' },
    ],
    readOnly: [],
  },
  SAFEGUARD: {
    editable: [
      { key: 'name', label: 'Full Name', icon: User, editable: true, type: 'text', placeholder: 'Enter your name' },
      { key: 'phone', label: 'Phone Number', icon: Phone, editable: true, type: 'text', placeholder: 'Enter phone number' },
    ],
    readOnly: [
      {
        key: 'school',
        label: 'Assigned School',
        icon: Building2,
        editable: false,
        badge: 'Assigned',
        getValue: (p: any) => p?.school?.schoolName || '—',
      },
      { key: 'isGlobal', label: 'Global Access', icon: Shield, editable: false, badge: 'System' },
    ],
  },
  REGIONAL_ADMIN: {
    editable: [
      { key: 'name', label: 'Full Name', icon: User, editable: true, type: 'text', placeholder: 'Enter your name' },
      { key: 'phone', label: 'Phone Number', icon: Phone, editable: true, type: 'text', placeholder: 'Enter phone number' },
    ],
    readOnly: [
      { key: 'region', label: 'Region', icon: Globe, editable: false, badge: 'Assigned' },
      { key: 'product', label: 'Product', icon: BookOpen, editable: false, badge: 'System' },
    ],
  },
  SUPER_ADMIN: {
    editable: [
      { key: 'name', label: 'Full Name', icon: User, editable: true, type: 'text', placeholder: 'Enter your name' },
      { key: 'phone', label: 'Phone Number', icon: Phone, editable: true, type: 'text', placeholder: 'Enter phone number' },
    ],
    readOnly: [],
  },
};

// ─── Role label & gradient map ────────────────────────────────────────────────
const roleDisplay: Record<string, { label: string; gradient: string; color: string }> = {
  SCHOOL: { label: 'School Admin', gradient: 'linear-gradient(135deg, #3d5248 0%, #6b8c7a 100%)', color: '#3d5248' },
  TEACHER: { label: 'Teacher', gradient: 'linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%)', color: '#1e3a5f' },
  STUDENT: { label: 'Student', gradient: 'linear-gradient(135deg, #6b3d87 0%, #a855f7 100%)', color: '#6b3d87' },
  PARENT: { label: 'Parent', gradient: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)', color: '#92400e' },
  SAFEGUARD: { label: 'Safeguard Officer', gradient: 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)', color: '#991b1b' },
  REGIONAL_ADMIN: { label: 'Regional Admin', gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%)', color: '#1e3a5f' },
  SUPER_ADMIN: { label: 'Super Admin', gradient: 'linear-gradient(135deg, #111827 0%, #374151 100%)', color: '#111827' },
};

// ─── Helper: Get display name from profile ────────────────────────────────────
function getDisplayName(role: string, profile: any, email: string): string {
  if (!profile) return email;
  if (role === 'SCHOOL') return profile.schoolName || email;
  return profile.name || email;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role || 'TEACHER';
  const profile = user?.profile || {};
  const email = user?.email || '';

  const fields = roleFields[role] || { editable: [], readOnly: [] };
  const roleInfo = roleDisplay[role] || roleDisplay['TEACHER'];

  // Form state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Password section state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPw }] = useChangePasswordMutation();

  // Populate form from profile on mount / role change
  useEffect(() => {
    const initial: Record<string, string> = {};
    fields.editable.forEach((f) => {
      let val = profile?.[f.key];
      if (f.type === 'date' && val) {
        val = new Date(val).toISOString().split('T')[0];
      }
      initial[f.key] = val ?? '';
    });
    setFormData(initial);
  }, [user]);

  const handleCancel = () => {
    const reset: Record<string, string> = {};
    fields.editable.forEach((f) => {
      let val = profile?.[f.key];
      if (f.type === 'date' && val) val = new Date(val).toISOString().split('T')[0];
      reset[f.key] = val ?? '';
    });
    setFormData(reset);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    try {
      await changePassword({
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      }).unwrap();
      toast.success('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
    } catch (err: any) {
      toast.error(err?.data?.error || 'Failed to change password');
    }
  };

  const displayName = getDisplayName(role, profile, email);
  const initials = getInitials(displayName);

  // Build the 2-column pairs for editable fields
  const editableFields = fields.editable;
  const readOnlyFields = fields.readOnly;

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '8px 0 48px' }}>

      {/* ─── Profile Card ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Gradient Banner */}
        <div
          style={{
            height: 120,
            background: roleInfo.gradient,
            position: 'relative',
          }}
        >
          {/* Subtle pattern overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)`,
            }}
          />
        </div>

        {/* Profile Header Row */}
        <div style={{ padding: '0 36px 28px', position: 'relative' }}>
          {/* Avatar */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: roleInfo.color,
              border: '4px solid #fff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-1px',
              position: 'absolute',
              top: -44,
              left: 36,
              fontFamily: 'var(--font-title)',
            }}
          >
            {initials}
          </div>

          {/* Name + role + edit button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingTop: 54,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.2,
                  marginBottom: 4,
                }}
              >
                {displayName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '0.83rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Mail size={13} />
                  {email}
                </span>
                <span
                  style={{
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: 20,
                    background: roleInfo.color + '18',
                    color: roleInfo.color,
                    border: `1px solid ${roleInfo.color}30`,
                  }}
                >
                  {roleInfo.label}
                </span>
              </div>
            </div>

            {/* Edit / Save / Cancel buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '9px 18px',
                      border: '1px solid var(--border-light)',
                      borderRadius: 10,
                      background: '#fafbfc',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.18s',
                    }}
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '9px 22px',
                      border: 'none',
                      borderRadius: 10,
                      background: roleInfo.color,
                      color: '#fff',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      opacity: isSaving ? 0.7 : 1,
                      transition: 'all 0.18s',
                    }}
                  >
                    <Check size={14} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '9px 22px',
                    border: 'none',
                    borderRadius: 10,
                    background: roleInfo.color,
                    color: '#fff',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                  }}
                >
                  <Edit3 size={14} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Divider ──────────────────────────────────────────────────────── */}
        <div style={{ height: 1, background: 'var(--border-light)', margin: '0 36px' }} />

        {/* ─── Fields Section ────────────────────────────────────────────────── */}
        <div style={{ padding: '28px 36px 36px' }}>

          {/* Editable Fields in 2-column grid */}
          {editableFields.length > 0 && (
            <>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  marginBottom: 16,
                }}
              >
                Profile Information
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '18px 24px',
                  marginBottom: 28,
                }}
              >
                {editableFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.73rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: 'var(--text-secondary)',
                          marginBottom: 6,
                        }}
                      >
                        <Icon size={12} />
                        {field.label}
                      </label>
                      {editMode ? (
                        <input
                          type={field.type || 'text'}
                          value={formData[field.key] || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.key]: e.target.value })
                          }
                          placeholder={field.placeholder}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            border: '1.5px solid var(--primary)',
                            borderRadius: 10,
                            fontSize: '0.88rem',
                            color: 'var(--text-main)',
                            background: '#fff',
                            outline: 'none',
                            boxShadow: '0 0 0 3px rgba(61,82,72,0.07)',
                            transition: 'border 0.18s',
                            fontFamily: 'var(--font-sans)',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            padding: '10px 14px',
                            border: '1px solid var(--border-light)',
                            borderRadius: 10,
                            fontSize: '0.88rem',
                            color: formData[field.key] ? 'var(--text-main)' : 'var(--text-muted)',
                            background: 'var(--bg-portal)',
                            minHeight: 40,
                          }}
                        >
                          {formData[field.key] || (
                            <span style={{ fontStyle: 'italic', fontSize: '0.82rem' }}>Not set</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Read-only Fields */}
          {readOnlyFields.length > 0 && (
            <>
              <p
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  marginBottom: 16,
                }}
              >
                System Information
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'none',
                    letterSpacing: 0,
                  }}
                >
                  — These fields are managed by your administrator
                </span>
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px 24px',
                  marginBottom: 28,
                }}
              >
                {readOnlyFields.map((field) => {
                  const Icon = field.icon;
                  const val = profile?.[field.key];
                  return (
                    <div key={field.key}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.73rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: 'var(--text-muted)',
                          marginBottom: 6,
                        }}
                      >
                        <Icon size={12} />
                        {field.label}
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          border: '1px dashed var(--border-light)',
                          borderRadius: 10,
                          fontSize: '0.88rem',
                          color: 'var(--text-secondary)',
                          background: '#f9fafb',
                        }}
                      >
                        <span>
                          {val === true ? 'Yes' : val === false ? 'No' : val || '—'}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 12,
                            background: 'var(--border-light)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {field.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Email Section */}
          <div
            style={{
              padding: '18px 20px',
              border: '1px solid var(--border-light)',
              borderRadius: 12,
              background: 'var(--bg-portal)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: roleInfo.color + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: roleInfo.color,
                flexShrink: 0,
              }}
            >
              <Mail size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {email}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Primary email address · Cannot be changed here
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Change Password Card ─────────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          marginTop: 20,
          overflow: 'hidden',
        }}
      >
        {/* Header / Toggle */}
        <button
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 36px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(61,82,72,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Lock size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Change Password
              </div>
              <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', marginTop: 1 }}>
                Update your account security credentials
              </div>
            </div>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            {showPasswordSection ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* Collapsible form */}
        {showPasswordSection && (
          <>
            <div style={{ height: 1, background: 'var(--border-light)' }} />
            <form onSubmit={handleChangePassword} style={{ padding: '24px 36px 28px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '16px 20px',
                  marginBottom: 20,
                }}
              >
                {/* Current Password */}
                {[
                  {
                    key: 'oldPassword',
                    label: 'Current Password',
                    show: showOldPw,
                    toggle: () => setShowOldPw(!showOldPw),
                  },
                  {
                    key: 'newPassword',
                    label: 'New Password',
                    show: showNewPw,
                    toggle: () => setShowNewPw(!showNewPw),
                  },
                  {
                    key: 'confirmPassword',
                    label: 'Confirm New Password',
                    show: showConfirmPw,
                    toggle: () => setShowConfirmPw(!showConfirmPw),
                  },
                ].map(({ key, label, show, toggle }) => (
                  <div key={key}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-secondary)',
                        marginBottom: 6,
                      }}
                    >
                      {label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={show ? 'text' : 'password'}
                        required
                        value={pwForm[key as keyof typeof pwForm]}
                        onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 14px',
                          border: '1.5px solid var(--border-light)',
                          borderRadius: 10,
                          fontSize: '0.88rem',
                          color: 'var(--text-main)',
                          outline: 'none',
                          fontFamily: 'var(--font-sans)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={toggle}
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          padding: 0,
                        }}
                      >
                        {show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isChangingPw}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 24px',
                  border: 'none',
                  borderRadius: 10,
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: isChangingPw ? 0.7 : 1,
                  transition: 'all 0.18s',
                }}
              >
                <Key size={14} />
                {isChangingPw ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
