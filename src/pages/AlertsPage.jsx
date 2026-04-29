import { useState } from 'react';
import Header from '../components/Header';
import { useCrowdData } from '../context/CrowdDataContext';
import { acknowledgeAlert } from '../services/api';
import { CheckCircle, Download } from 'lucide-react';

const SEVERITIES = ['All', 'critical', 'warning', 'info'];
const STATUSES   = ['All', 'active', 'resolved'];

export default function AlertsPage() {
  const { alerts, acknowledgeLocalAlert } = useCrowdData();
  const [sevFilter, setSevFilter] = useState('All');
  const [statFilter, setStatFilter] = useState('All');

  const filtered = alerts
    .filter(a => sevFilter === 'All'  || a.severity === sevFilter)
    .filter(a => statFilter === 'All' || a.status === statFilter);

  async function handleAck(id) {
    await acknowledgeAlert(id);
    acknowledgeLocalAlert(id);
  }

  return (
    <div>
      <Header title="Alerts & Notifications" subtitle="Active and resolved crowd safety alerts"/>
      <div className="page-body">

        {/* KPI strip */}
        <div className="kpi-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:18 }}>
          {[
            { label:'Total Alerts',   val: alerts.length,                                        color:'var(--accent-blue)' },
            { label:'Critical',       val: alerts.filter(a=>a.severity==='critical').length,      color:'var(--accent-red)' },
            { label:'Active',         val: alerts.filter(a=>a.status==='active').length,          color:'var(--accent-yellow)' },
            { label:'Resolved',       val: alerts.filter(a=>a.status==='resolved').length,        color:'var(--accent-green)' },
          ].map(k => (
            <div key={k.label} className="kpi-card">
              <div className="kpi-info">
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value" style={{ color:k.color }}>{k.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:16, marginBottom:18, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>Severity</div>
            <div className="filter-bar" style={{ marginBottom:0 }}>
              {SEVERITIES.map(s => (
                <button key={s} className={`filter-btn ${sevFilter===s?'active':''}`} onClick={()=>setSevFilter(s)}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>Status</div>
            <div className="filter-bar" style={{ marginBottom:0 }}>
              {STATUSES.map(s => (
                <button key={s} className={`filter-btn ${statFilter===s?'active':''}`} onClick={()=>setStatFilter(s)}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'flex-end' }}>
            <button className="btn btn-secondary btn-sm">
              <Download size={13}/> Export CSV
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding:0 }}>
            {filtered.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">🔕</div>No alerts match the current filters</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Severity</th><th>Gate / Zone</th><th>Event</th>
                    <th>Message</th><th>Time</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} className={`alert-row-${a.severity}`}>
                      <td><span className={`badge ${a.severity==='critical'?'badge-critical':a.severity==='warning'?'badge-warning':'badge-info'}`}>{a.severity}</span></td>
                      <td style={{ fontWeight:600 }}>{a.gate}</td>
                      <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>{a.event}</td>
                      <td style={{ fontSize:'0.82rem' }}>{a.message}</td>
                      <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{a.time}</td>
                      <td><span className={`badge ${a.status==='active'?'badge-warning':'badge-safe'}`}>{a.status}</span></td>
                      <td>
                        {a.status === 'active' ? (
                          <button className="btn btn-success btn-sm" onClick={()=>handleAck(a.id)}>
                            <CheckCircle size={12}/> Acknowledge
                          </button>
                        ) : (
                          <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
