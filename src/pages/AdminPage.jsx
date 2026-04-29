import { useState } from 'react';
import Header from '../components/Header';
import { USERS, AUDIT_LOGS } from '../services/mockData';
import { Shield, Server, Database, Zap } from 'lucide-react';

const HEALTH_SERVICES = [
  { name:'API Gateway',    status:'ok',      metric:'12ms avg latency',      icon:<Zap size={13}/> },
  { name:'Lambda',         status:'ok',      metric:'3 invocations/s',        icon:<Server size={13}/> },
  { name:'S3 Storage',     status:'ok',      metric:'2.4 GB used',            icon:<Database size={13}/> },
  { name:'Athena Queries', status:'ok',      metric:'Avg 1.8s query time',    icon:<Database size={13}/> },
  { name:'CloudWatch',     status:'ok',      metric:'All metrics flowing',     icon:<Shield size={13}/> },
  { name:'Bedrock (GenAI)',status:'ok',      metric:'Claude 3 online',         icon:<Zap size={13}/> },
];

export default function AdminPage() {
  const [users, setUsers] = useState(USERS);

  function changeRole(id, newRole) {
    setUsers(prev => prev.map(u => u.id===id ? { ...u, role:newRole } : u));
  }

  return (
    <div>
      <Header title="Admin Panel" subtitle="User management, audit logs, and system health"/>
      <div className="page-body">

        {/* System Health */}
        <div className="card" style={{ marginBottom:20 }}>
          <div className="card-header">
            <span className="card-title">AWS Services Health</span>
            <span className="badge badge-safe">✓ All Systems Operational</span>
          </div>
          <div className="card-body">
            <div className="system-health">
              {HEALTH_SERVICES.map(s => (
                <div key={s.name} className="health-item">
                  <div className="health-service" style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ color:'var(--accent-cyan)' }}>{s.icon}</span>{s.name}
                  </div>
                  <div className={`health-status ${s.status}`}>
                    {s.status === 'ok' ? '● Online' : s.status === 'degraded' ? '● Degraded' : '● Offline'}
                  </div>
                  <div className="health-metric">{s.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="card" style={{ marginBottom:20 }}>
          <div className="card-header">
            <span className="card-title">User Management</span>
            <button className="btn btn-primary btn-sm">+ Add User</button>
          </div>
          <div className="card-body" style={{ padding:0 }}>
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Last Login</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight:600 }}>{u.name}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>{u.email}</td>
                    <td>
                      <select
                        className="form-select"
                        value={u.role}
                        style={{ width:'auto', padding:'5px 10px', fontSize:'0.78rem', borderRadius:6 }}
                        onChange={e=>changeRole(u.id, e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="organizer">Organizer</option>
                        <option value="security">Security</option>
                      </select>
                    </td>
                    <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'var(--text-muted)' }}>{u.lastLogin}</td>
                    <td>
                      <span className={`badge ${u.status==='active'?'badge-safe':'badge-completed'}`}>{u.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Audit Log</span>
            <span style={{ fontSize:'0.73rem', color:'var(--text-muted)' }}>Exported to AWS CloudTrail</span>
          </div>
          <div className="card-body" style={{ padding:0 }}>
            <table className="data-table">
              <thead>
                <tr><th>Action</th><th>User</th><th>Resource</th><th>IP Address</th><th>Time</th></tr>
              </thead>
              <tbody>
                {AUDIT_LOGS.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight:600 }}>{l.action}</td>
                    <td style={{ color:'var(--text-secondary)', fontSize:'0.82rem' }}>{l.user}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>{l.resource}</td>
                    <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'var(--accent-cyan)' }}>{l.ip}</td>
                    <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'var(--text-muted)' }}>{l.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
