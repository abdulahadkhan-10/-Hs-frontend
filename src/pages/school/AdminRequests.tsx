import { useState } from 'react';
import { toast } from 'sonner';
import { 
  FileCheck, 
  Check, 
  X, 
  User, 
  Clock, 
  UserCheck, 
  UserX,
  Search
} from 'lucide-react';

interface AdminRequest {
  id: string;
  name: string;
  role: string;
  email: string;
  date: string;
  type: 'Registration' | 'Role Change' | 'Licence Renewal';
  details: string;
  status: 'pending' | 'approved' | 'rejected';
}

const initialRequests: AdminRequest[] = [
  {
    id: 'req-1',
    name: 'Robert Chen',
    role: 'Teacher',
    email: 'robert.chen@lsa.edu',
    date: '12 July 2026',
    type: 'Registration',
    details: 'Wishes to register as a teacher for Computing (Key Stage 2/3).',
    status: 'pending'
  },
  {
    id: 'req-2',
    name: 'Sarah Jenkins',
    role: 'Teacher',
    email: 'sarah.j@lsa.edu',
    date: '10 July 2026',
    type: 'Role Change',
    details: 'Requesting permission increase to manage and draft new curriculum tracks.',
    status: 'pending'
  },
  {
    id: 'req-3',
    name: 'Arthur Pendelton',
    role: 'Student',
    email: 'arthur.p@gmail.com',
    date: '08 July 2026',
    type: 'Registration',
    details: 'Enrolling in Year 5. Transferred from Windsor Primary.',
    status: 'pending'
  },
  {
    id: 'req-4',
    name: 'David Miller',
    role: 'Teacher',
    email: 'david.m@lsa.edu',
    date: '01 July 2026',
    type: 'Licence Renewal',
    details: 'Annual system account licence renewal request.',
    status: 'approved'
  },
  {
    id: 'req-5',
    name: 'Marcus Brody',
    role: 'Guest Educator',
    email: 'm.brody@museum.org',
    date: '28 June 2026',
    type: 'Registration',
    details: 'Requested student roster view access for archaeological modules.',
    status: 'rejected'
  }
];

export default function AdminRequests() {
  const [requests, setRequests] = useState<AdminRequest[]>(initialRequests);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: action };
      }
      return req;
    }));
    
    if (action === 'approved') {
      toast.success('Request approved successfully!');
    } else {
      toast.error('Request rejected.');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesSearch = req.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="sd-page">
      {/* Page Header */}
      <div className="sd-topbar" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="sd-title" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
            <FileCheck size={26} />
            Admin Requests
          </h1>
          <p className="sd-subtitle" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Review, approve, or decline system access requests and profile modifications.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#ffffff', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
          {['pending', 'approved', 'rejected', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              style={{
                padding: '6px 16px',
                border: 'none',
                background: filter === status ? '#eae2d5' : 'transparent',
                color: filter === status ? 'var(--text-main)' : 'var(--text-secondary)',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="sd-section-card" style={{ flex: 1, minWidth: '240px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: '30px', background: '#ffffff', boxShadow: 'none' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, email, or request type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', color: 'var(--text-main)', background: 'transparent' }}
          />
        </div>
      </div>

      {/* Requests Content Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredRequests.map(req => (
          <div 
            key={req.id} 
            className="sd-section-card" 
            style={{ 
              padding: '24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderRadius: '12px',
              borderLeft: req.status === 'pending' ? '4px solid var(--warning-orange)' : req.status === 'approved' ? '4px solid var(--accent-green)' : '4px solid var(--danger-red)',
              background: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div 
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  background: 'var(--primary-light)', 
                  color: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 700 
                }}
              >
                {req.name.charAt(0)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{req.name}</span>
                  <span style={{ fontSize: '0.72rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{req.role}</span>
                  <span 
                    style={{ 
                      fontSize: '0.72rem', 
                      background: req.status === 'pending' ? 'var(--warning-orange-bg)' : req.status === 'approved' ? 'var(--accent-green-bg)' : 'var(--danger-red-bg)', 
                      color: req.status === 'pending' ? 'var(--warning-orange)' : req.status === 'approved' ? 'var(--accent-green)' : 'var(--danger-red)', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontWeight: 700,
                      textTransform: 'capitalize' 
                    }}
                  >
                    {req.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {req.email} • Received on {req.date}
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <strong style={{ color: 'var(--text-main)', marginRight: '6px' }}>{req.type}:</strong>
                  {req.details}
                </div>
              </div>
            </div>

            {/* Actions */}
            {req.status === 'pending' && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleAction(req.id, 'rejected')}
                  style={{
                    background: 'var(--danger-red-bg)',
                    color: 'var(--danger-red)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Reject"
                >
                  <X size={18} />
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'approved')}
                  style={{
                    background: 'var(--accent-green-bg)',
                    color: 'var(--accent-green)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Approve"
                >
                  <Check size={18} />
                </button>
              </div>
            )}
            
            {req.status === 'approved' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 700 }}>
                <UserCheck size={16} />
                Approved
              </div>
            )}

            {req.status === 'rejected' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger-red)', fontSize: '0.8rem', fontWeight: 700 }}>
                <UserX size={16} />
                Declined
              </div>
            )}
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="sd-section-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', background: '#ffffff' }}>
            <Clock size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3>No requests found</h3>
            <p style={{ fontSize: '0.84rem', marginTop: 4 }}>All requests matching this filter have been processed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
