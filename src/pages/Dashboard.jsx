import { useCrowdData } from '../context/CrowdDataContext';
import Header from '../components/Header';
import GateCard from '../components/GateCard';
import AlertBanner from '../components/AlertBanner';
import CrowdDensityMeter from '../components/CrowdDensityMeter';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { HOURLY_CROWD, CAMPUS_ZONES } from '../services/mockData';
import { Users, DoorOpen, ShieldAlert, TrendingUp, Zap } from 'lucide-react';

function zoneColor(density) {
  if (density > 0.85) return `rgba(239,68,68,${0.4 + density * 0.4})`;
  if (density > 0.65) return `rgba(245,158,11,${0.4 + density * 0.4})`;
  return `rgba(16,185,129,${0.2 + density * 0.5})`;
}

export default function Dashboard() {
  const { gateData, alerts, totalOnCampus, criticalCount, activeEvents, loading } = useCrowdData();
  const avgDensity = gateData.length ? gateData.reduce((s, g) => s + g.density, 0) / gateData.length : 0;
  const mlAnomalyCount = gateData.filter(g => g.anomaly).length;
  const anomalyGates   = gateData.filter(g => g.anomaly);

  return (
    <div>
      <Header title="Dashboard" subtitle="Real-time campus crowd overview"/>
      <div className="page-body">
        <AlertBanner alerts={alerts}/>

        {/* KPI Row */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon blue"><Users size={22}/></div>
            <div className="kpi-info">
              <div className="kpi-label">On-Campus Now</div>
              <div className="kpi-value">{loading ? '—' : totalOnCampus.toLocaleString()}</div>
              <div className="kpi-sub">Across all monitored zones</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon cyan"><DoorOpen size={22}/></div>
            <div className="kpi-info">
              <div className="kpi-label">Active Gates</div>
              <div className="kpi-value">{gateData.length}</div>
              <div className="kpi-sub">All gates operational</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon red"><ShieldAlert size={22}/></div>
            <div className="kpi-info">
              <div className="kpi-label">Critical Alerts</div>
              <div className="kpi-value" style={{ color: criticalCount > 0 ? 'var(--accent-red)' : undefined }}>
                {criticalCount}
              </div>
              <div className="kpi-sub kpi-trend up">{criticalCount === 0 ? 'All clear' : 'Requires attention'}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon green"><TrendingUp size={22}/></div>
            <div className="kpi-info">
              <div className="kpi-label">Live Events</div>
              <div className="kpi-value">{activeEvents}</div>
              <div className="kpi-sub">Events in progress today</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className={`kpi-icon ${mlAnomalyCount > 0 ? 'red' : 'green'}`}><Zap size={22}/></div>
            <div className="kpi-info">
              <div className="kpi-label">ML Anomalies</div>
              <div className="kpi-value" style={{ color: mlAnomalyCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {loading ? '—' : mlAnomalyCount}
              </div>
              <div className={`kpi-sub ${mlAnomalyCount > 0 ? 'kpi-trend down' : 'kpi-trend up'}`}>
                {mlAnomalyCount === 0 ? 'No surges detected' : `Z-score > 2.5 threshold`}
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="page-grid cols-2-1" style={{ marginBottom: 20 }}>
          {/* Crowd Flow Chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Today's Crowd Flow</span>
              <span style={{ fontSize: '0.73rem', color:'var(--text-muted)' }}>Entry vs Exit per hour</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={HOURLY_CROWD} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <defs>
                    <linearGradient id="entryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="exitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)"/>
                  <XAxis dataKey="hour" tick={{ fill:'#64748b', fontSize:10 }} tickLine={false}/>
                  <YAxis tick={{ fill:'#64748b', fontSize:10 }} tickLine={false} axisLine={false}/>
                  <Tooltip contentStyle={{ background:'#0d1626', border:'1px solid rgba(148,163,184,0.15)', borderRadius:8, fontSize:12 }} labelStyle={{ color:'#f1f5f9' }}/>
                  <Legend wrapperStyle={{ fontSize:12, color:'#94a3b8' }}/>
                  <Area type="monotone" dataKey="entry" stroke="#3b82f6" fill="url(#entryGrad)" strokeWidth={2} name="Entry"/>
                  <Area type="monotone" dataKey="exit"  stroke="#10b981" fill="url(#exitGrad)"  strokeWidth={2} name="Exit"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Campus density gauge */}
          <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 16, padding: 24 }}>
            <div style={{ fontSize: '0.75rem', color:'var(--text-secondary)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Overall Campus</div>
            <CrowdDensityMeter value={avgDensity} label="Avg Density" size={170}/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, width:'100%' }}>
              {[
                { label:'Safe Gates',    val: gateData.filter(g=>g.status==='safe').length,     color:'var(--accent-green)' },
                { label:'Warning',       val: gateData.filter(g=>g.status==='warning').length,  color:'var(--accent-yellow)' },
                { label:'Critical',      val: gateData.filter(g=>g.status==='critical').length, color:'var(--accent-red)' },
                { label:'Total Zones',   val: gateData.length,                                  color:'var(--accent-blue)' },
              ].map(s => (
                <div key={s.label} style={{ background:'rgba(148,163,184,0.05)', borderRadius:8, padding:'8px 10px', textAlign:'center' }}>
                  <div style={{ fontSize:'1.2rem', fontWeight:800, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap + Alerts */}
        <div className="page-grid cols-1-2" style={{ marginBottom: 20 }}>
          {/* Campus zone heatmap */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Zone Density Heatmap</span>
              <span style={{ fontSize: '0.73rem', color:'var(--text-muted)' }}>Live campus map</span>
            </div>
            <div className="card-body">
              <div className="heatmap-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                {CAMPUS_ZONES.map(z => (
                  <div
                    key={z.id}
                    className="heatmap-cell"
                    style={{ background: zoneColor(z.density), borderRadius:8, padding:'10px 4px', flexDirection:'column', gap:2 }}
                    title={`${z.name}: ${Math.round(z.density*100)}%`}
                  >
                    <div style={{ fontSize:'0.6rem', textAlign:'center', lineHeight:1.2, color:'rgba(255,255,255,0.85)', fontWeight:600 }}>
                      {z.name.split(' ').slice(0,2).join('\n')}
                    </div>
                    <div style={{ fontSize:'0.7rem', fontWeight:800, color:'#fff' }}>{Math.round(z.density*100)}%</div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:16, marginTop:14, fontSize:'0.72rem', color:'var(--text-muted)' }}>
                <span>🟢 Safe (&lt;65%)</span>
                <span>🟡 Warning (65-85%)</span>
                <span>🔴 Critical (&gt;85%)</span>
              </div>
            </div>
          </div>

          {/* Gate grid mini */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Gate Status</span>
              <span className="badge badge-live"><span className="live-dot" style={{width:6,height:6}}/>Live</span>
            </div>
            <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {gateData.map(g => (
                <div key={g.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', marginBottom:3 }}>
                      <span style={{ fontWeight:600 }}>{g.name}</span>
                      <span style={{ color: g.status==='critical'?'var(--accent-red)':g.status==='warning'?'var(--accent-yellow)':'var(--accent-green)', fontSize:'0.75rem', fontWeight:700 }}>
                        {Math.round(g.density*100)}%
                      </span>
                    </div>
                    <div className="fill-bar-track">
                      <div className={`fill-bar-fill ${g.status}`} style={{ width:`${Math.round(g.density*100)}%` }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ML Anomaly Panel ── */}
        <div className="anomaly-panel" style={{ display: anomalyGates.length === 0 && !loading ? 'none' : undefined }}>
          <div className="anomaly-panel-header">
            <Zap size={17} style={{ flexShrink: 0 }}/>
            <span>
              {loading
                ? 'Scanning for anomalies…'
                : anomalyGates.length === 0
                  ? '✅ No ML anomalies detected — all gates within normal range'
                  : `ML Anomaly Alert — ${anomalyGates.length} gate${anomalyGates.length > 1 ? 's' : ''} flagged by Z-score model`
              }
            </span>
            <span className="anomaly-model-tag">Z-Score · threshold 2.5σ</span>
          </div>

          {anomalyGates.length > 0 && (
            <div className="anomaly-items-grid">
              {anomalyGates.map(g => (
                <div key={g.id} className="anomaly-item">
                  <div className="anomaly-item-left">
                    <div className="anomaly-gate-name">{g.name}</div>
                    <div className="anomaly-gate-loc">{g.location ?? g.zone ?? ''}</div>
                  </div>
                  <div className="anomaly-item-mid">
                    <div className="anomaly-stat">
                      <span className="anomaly-stat-label">Occupancy</span>
                      <span className="anomaly-stat-val">{(g.inside ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="anomaly-stat">
                      <span className="anomaly-stat-label">Z-Score</span>
                      <span className="anomaly-stat-val" style={{ color: '#f87171' }}>{g.zScore}</span>
                    </div>
                    <div className="anomaly-stat">
                      <span className="anomaly-stat-label">Density</span>
                      <span className="anomaly-stat-val">{Math.round((g.density ?? 0) * 100)}%</span>
                    </div>
                  </div>
                  <div className="anomaly-item-right">
                    <span className="anomaly-badge-pulse">⚡ Anomaly</span>
                    <div className="anomaly-action">↗ Redirect crowd</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {anomalyGates.length === 0 && !loading && (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '4px 0' }}>
              All gate occupancies are within 2.5 standard deviations of the 30-day training baseline.
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Alerts</span>
            <a href="/alerts" style={{ fontSize:'0.78rem', color:'var(--accent-blue)', textDecoration:'none' }}>View all →</a>
          </div>
          <div className="card-body" style={{ padding:0 }}>
            <table className="data-table">
              <thead>
                <tr><th>Severity</th><th>Gate / Zone</th><th>Event</th><th>Message</th><th>Time</th><th>Status</th></tr>
              </thead>
              <tbody>
                {alerts.slice(0,5).map(a => (
                  <tr key={a.id} className={`alert-row-${a.severity}`}>
                    <td><span className={`badge badge-${a.severity==='critical'?'critical':a.severity==='warning'?'warning':'info'}`}>{a.severity}</span></td>
                    <td style={{ fontWeight:600 }}>{a.gate}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>{a.event}</td>
                    <td style={{ fontSize:'0.82rem' }}>{a.message}</td>
                    <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'var(--text-muted)' }}>{a.time}</td>
                    <td><span className={`badge ${a.status==='active'?'badge-critical':'badge-safe'}`}>{a.status}</span></td>
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
