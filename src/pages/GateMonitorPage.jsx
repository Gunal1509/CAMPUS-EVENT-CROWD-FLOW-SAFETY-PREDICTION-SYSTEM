import { useState } from 'react';
import Header from '../components/Header';
import GateCard from '../components/GateCard';
import AlertBanner from '../components/AlertBanner';
import { useCrowdData } from '../context/CrowdDataContext';
import { RefreshCw } from 'lucide-react';

export default function GateMonitorPage() {
  const { gateData, alerts, refresh } = useCrowdData();
  const [autoRefresh, setAutoRefresh] = useState(true);

  const sorted = [...gateData].sort((a,b) => b.density - a.density);

  return (
    <div>
      <Header title="Gate Monitor" subtitle="Real-time gate-wise crowd density tracking"/>
      <div className="page-body">
        <AlertBanner alerts={alerts}/>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div style={{ display:'flex', gap:8 }}>
            <span className="badge badge-critical">🔴 Critical: {gateData.filter(g=>g.status==='critical').length}</span>
            <span className="badge badge-warning">🟡 Warning: {gateData.filter(g=>g.status==='warning').length}</span>
            <span className="badge badge-safe">🟢 Safe: {gateData.filter(g=>g.status==='safe').length}</span>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <label style={{ fontSize:'0.8rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
              <input type="checkbox" checked={autoRefresh} onChange={e=>setAutoRefresh(e.target.checked)} style={{ accentColor:'var(--accent-cyan)' }}/>
              Auto-refresh (5s)
            </label>
            <button className="btn btn-secondary btn-sm" onClick={refresh}>
              <RefreshCw size={13}/> Refresh Now
            </button>
          </div>
        </div>

        {/* Gate Grid */}
        <div className="gates-grid" style={{ marginBottom: 24 }}>
          {sorted.map(g => <GateCard key={g.id} gate={g}/>)}
        </div>

        {/* Ranking table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Overcrowding Risk Ranking</span>
            <span style={{ fontSize:'0.73rem', color:'var(--text-muted)' }}>Ranked by density (high → low)</span>
          </div>
          <div className="card-body" style={{ padding:0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Gate</th><th>Location</th><th>Inside</th>
                  <th>Capacity</th><th>Density</th><th>Entry Rate</th><th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((g,i) => (
                  <tr key={g.id}>
                    <td style={{ fontWeight:800, color:'var(--text-muted)', fontFamily:'monospace' }}>{i+1}</td>
                    <td style={{ fontWeight:700 }}>{g.name}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>{g.location}</td>
                    <td style={{ fontFamily:'monospace', fontWeight:600 }}>{(g.inside||0).toLocaleString()}</td>
                    <td style={{ fontFamily:'monospace', color:'var(--text-muted)' }}>{g.capacity}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div className="fill-bar-track" style={{ flex:1, minWidth:60 }}>
                          <div className={`fill-bar-fill ${g.status}`} style={{ width:`${Math.round(g.density*100)}%` }}/>
                        </div>
                        <span style={{ fontFamily:'monospace', fontWeight:700, fontSize:'0.82rem',
                          color: g.status==='critical'?'var(--accent-red)':g.status==='warning'?'var(--accent-yellow)':'var(--accent-green)' }}>
                          {Math.round(g.density*100)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ fontFamily:'monospace', fontSize:'0.8rem' }}>
                      {(Math.floor(Math.random()*150+30))}/hr
                    </td>
                    <td><span className={`badge badge-${g.status}`}>{g.status}</span></td>
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
