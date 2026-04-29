export default function GateCard({ gate, large = false }) {
  const { name, location, entered = 0, exited = 0, inside = 0, density = 0, status = 'safe', capacity = 100 } = gate;

  const pct = Math.round(density * 100);

  return (
    <div className={`gate-card ${status}`}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: 10 }}>
        <div>
          <div className="gate-name">{name}</div>
          <div className="gate-location">{location}</div>
        </div>
        <span className={`badge badge-${status}`}>
          {status === 'critical' ? '🔴' : status === 'warning' ? '🟡' : '🟢'} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="gate-counts">
        <div className="gate-count-item">
          <div className="gate-count-label">Entered</div>
          <div className="gate-count-value">{entered.toLocaleString()}</div>
        </div>
        <div className="gate-count-item">
          <div className="gate-count-label">Exited</div>
          <div className="gate-count-value">{exited.toLocaleString()}</div>
        </div>
        <div className="gate-count-item">
          <div className="gate-count-label">Inside</div>
          <div className="gate-count-value" style={{ color: status === 'critical' ? 'var(--accent-red)' : status === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-green)' }}>
            {inside.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="fill-bar-wrap">
        <div className="fill-bar-header">
          <span>Density</span>
          <span style={{ fontWeight: 700, color: status === 'critical' ? 'var(--accent-red)' : status === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-green)' }}>
            {pct}% of {capacity}
          </span>
        </div>
        <div className="fill-bar-track">
          <div className={`fill-bar-fill ${status}`} style={{ width: `${pct}%` }}/>
        </div>
      </div>

      {gate.anomaly && (
        <div style={{
          marginTop: 10,
          padding: '6px 10px',
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.5)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: '#ef4444',
          animation: 'pulse 2s infinite',
        }}>
          <span>⚡</span>
          <span><strong>ML Anomaly Detected</strong> — Z-score: {gate.zScore}</span>
        </div>
      )}
    </div>
  );
}
