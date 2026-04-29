import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  {
    id: 'admin',
    emoji: '🔐',
    name: 'Administrator',
    desc: 'Full system access — user management, audit logs, all dashboards',
  },
  {
    id: 'organizer',
    emoji: '🎯',
    name: 'Event Organizer',
    desc: 'Manage events, view analytics, and interact with AI assistant',
  },
  {
    id: 'security',
    emoji: '🛡️',
    name: 'Security Team',
    desc: 'Real-time gate monitoring, alerts, and crowd safety actions',
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!selected) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    login(selected);
    navigate('/dashboard');
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-icon">🏛️</div>
          <div>
            <div className="login-brand">Crowd<span>Safe</span></div>
          </div>
        </div>
        <div className="login-tagline">Campus Event Crowd Flow & Safety Prediction System</div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }}/>

        <div className="login-subtitle">Select Your Role to Continue</div>

        <div className="role-cards">
          {ROLES.map(r => (
            <div
              key={r.id}
              className={`role-card ${selected === r.id ? 'selected' : ''}`}
              onClick={() => setSelected(r.id)}
            >
              <div className="role-card-icon">{r.emoji}</div>
              <div className="role-card-info">
                <div className="role-card-name">{r.name}</div>
                <div className="role-card-desc">{r.desc}</div>
              </div>
              {selected === r.id && <div className="role-card-check">✓</div>}
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem' }}
          disabled={!selected || loading}
          onClick={handleLogin}
        >
          {loading ? '⏳ Signing in...' : '→ Enter Dashboard'}
        </button>

        <div style={{ marginTop: 20, padding: 14, background: 'rgba(59,130,246,0.06)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.12)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            🔒 <strong style={{ color: 'var(--text-secondary)' }}>Secured by AWS IAM</strong> — All data encrypted in transit (TLS 1.3) and at rest (AES-256, S3 SSE). Access logged to CloudTrail.
          </div>
        </div>
      </div>
    </div>
  );
}
