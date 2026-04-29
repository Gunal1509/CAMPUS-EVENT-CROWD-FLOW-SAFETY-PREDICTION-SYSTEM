import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function AlertBanner({ alerts = [] }) {
  const [dismissed, setDismissed] = useState(new Set());
  const active = alerts.filter(a => a.severity === 'critical' && a.status === 'active' && !dismissed.has(a.id));

  if (active.length === 0) return null;

  return (
    <div style={{ marginBottom: 4 }}>
      {active.slice(0, 2).map(alert => (
        <div key={alert.id} className="alert-banner">
          <AlertTriangle size={15} className="alert-banner-icon"/>
          <div className="alert-banner-text">
            <strong>{alert.gate}</strong>: {alert.message}
            <span style={{ marginLeft: 6, color:'var(--text-muted)', fontSize:'0.72rem' }}>• {alert.time}</span>
          </div>
          <X
            size={14}
            className="alert-banner-close"
            onClick={() => setDismissed(prev => new Set([...prev, alert.id]))}
          />
        </div>
      ))}
    </div>
  );
}
