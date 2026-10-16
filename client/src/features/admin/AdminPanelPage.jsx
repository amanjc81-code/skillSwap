import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api.js';
import { useToast } from '../../app/ToastContext.jsx';
import { LoadingSpinner } from '../../components/LoadingSpinner.jsx';
import { Modal } from '../../components/Modal.jsx';
import {
  ShieldAlert,
  Users,
  AlertOctagon,
  Search,
  CheckCircle,
  XCircle,
  Activity,
  UserCheck,
  UserX
} from 'lucide-react';

export const AdminPanelPage = () => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'reports' | 'health'
  const [loading, setLoading] = useState(true);

  // Users state
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Reports state
  const [reports, setReports] = useState([]);

  // System Health state
  const [health, setHealth] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);

      const [usersRes, reportsRes, healthRes] = await Promise.all([
        api.get(`/admin/users?${params.toString()}`),
        api.get('/admin/reports'),
        api.get('/health')
      ]);

      setUsers(usersRes.users || []);
      setReports(reportsRes.reports || []);
      setHealth(healthRes);
    } catch (err) {
      console.error(err);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      addToast(`User account status updated to ${newStatus}.`, 'success');
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      addToast(`User role updated to ${newRole}.`, 'success');
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      await api.post(`/admin/reports/${reportId}/resolve`, {
        status,
        resolutionNotes: `Resolved by administrator on ${new Date().toLocaleDateString()}`
      });
      addToast(`Content report marked as ${status}.`, 'success');
      fetchData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading administrative controls..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            System Administration Panel
          </h1>
          <span className="badge badge-indigo">
            <ShieldAlert size={13} /> Protected Role
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Platform security, student accounts moderation, role delegations, and service health
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={16} /> User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`btn btn-sm ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <AlertOctagon size={16} /> Moderation Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`btn btn-sm ${activeTab === 'health' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Activity size={16} /> Operational Health
        </button>
      </div>

      {/* User Accounts Management Tab */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by student name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">
                <Search size={16} />
              </button>
            </form>

            <select
              className="form-select"
              style={{ width: '160px' }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="coordinator">Coordinators</option>
              <option value="admin">Administrators</option>
            </select>

            <select
              className="form-select"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>College Email</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Department</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Account Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {u.name}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                        {u.department} ({u.academicYear})
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                        >
                          <option value="student">Student</option>
                          <option value="coordinator">Coordinator</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          className={`badge ${u.accountStatus === 'active' ? 'badge-success' : 'badge-danger'}`}
                          style={{ textTransform: 'capitalize' }}
                        >
                          {u.accountStatus}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUserStatus(u._id, u.accountStatus)}
                            className={`btn btn-sm ${u.accountStatus === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ fontSize: '0.75rem' }}
                          >
                            {u.accountStatus === 'active' ? (
                              <>
                                <UserX size={12} /> Suspend
                              </>
                            ) : (
                              <>
                                <UserCheck size={12} /> Activate
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Reports Tab */}
      {activeTab === 'reports' && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Community Content & Safety Reports
          </h3>

          {reports.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No active content reports or flags. Community conduct is in good standing.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reports.map((r) => (
                <div
                  key={r._id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-warning" style={{ textTransform: 'uppercase' }}>
                      {r.reason}
                    </span>
                    <span className="badge badge-neutral">{r.status}</span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Reporter: <strong>{r.reporter?.name}</strong> → Reported:{' '}
                    <strong>{r.reportedUser?.name}</strong>
                  </p>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    "{r.details || 'No additional details provided'}"
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleResolveReport(r._id, 'resolved')}
                      className="btn btn-primary btn-sm"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleResolveReport(r._id, 'dismissed')}
                      className="btn btn-secondary btn-sm"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Operational Health Tab */}
      {activeTab === 'health' && (
        <div className="card" style={{ maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            SkillMesh API Health Status
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Service API Status</span>
              <strong style={{ color: 'var(--color-success)' }}>{health?.status?.toUpperCase()}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Database Connection</span>
              <strong style={{ color: 'var(--accent-primary)' }}>{health?.database?.toUpperCase()}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>System Version</span>
              <span>{health?.version}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Server Heartbeat</span>
              <span>{new Date(health?.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
