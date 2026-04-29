import { useState, useEffect } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import { useCrowdData } from '../context/CrowdDataContext';
import { format } from 'date-fns';

export default function Header({ title, subtitle }) {
  const { criticalCount, lastUpdate, refresh } = useCrowdData();
  const [clock, setClock] = useState(format(new Date(), 'HH:mm:ss'));

  useEffect(() => {
    const t = setInterval(() => setClock(format(new Date(), 'HH:mm:ss')), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="page-header">
      <div className="page-header-left">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="page-header-right">
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', color:'var(--accent-green)', fontWeight:600 }}>LIVE</span>
        </div>

        <div className="header-clock">{clock}</div>

        {lastUpdate && (
          <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>
            Updated {format(lastUpdate, 'HH:mm:ss')}
          </div>
        )}

        <button className="btn btn-secondary btn-sm btn-icon" onClick={refresh} title="Refresh data">
          <RefreshCw size={14}/>
        </button>

        <button className="notif-btn" title="Alerts">
          <Bell size={16}/>
          {criticalCount > 0 && (
            <div className="notif-badge">{criticalCount}</div>
          )}
        </button>
      </div>
    </header>
  );
}
