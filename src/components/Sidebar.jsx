import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Radio, Calendar, DoorOpen,
  BarChart2, MessageSquare, ShieldAlert, Settings, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: <LayoutDashboard size={18}/>, label: 'Dashboard',    roles: ['admin','organizer','security'] },
  { to: '/gates',     icon: <DoorOpen size={18}/>,        label: 'Gate Monitor', roles: ['admin','security']             },
  { to: '/events',    icon: <Calendar size={18}/>,         label: 'Events',       roles: ['admin','organizer']            },
  { to: '/analytics', icon: <BarChart2 size={18}/>,        label: 'Analytics',    roles: ['admin','organizer','security'] },
  { to: '/alerts',    icon: <ShieldAlert size={18}/>,      label: 'Alerts',       roles: ['admin','security']             },
  { to: '/assistant', icon: <MessageSquare size={18}/>,    label: 'AI Assistant', roles: ['admin','organizer','security'] },
  { to: '/admin',     icon: <Settings size={18}/>,         label: 'Admin Panel',  roles: ['admin']                       },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const visibleItems = NAV_ITEMS.filter(n => user && n.roles.includes(user.role));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏛️</div>
        <div>
          <div className="sidebar-brand">CrowdSafe</div>
          <div className="sidebar-brand-sub">Campus Monitor</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>

        {visibleItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={handleLogout} title="Logout">
          <div className="sidebar-avatar">{user?.initials || 'U'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {user?.email || 'user@campus.edu'}
            </div>
            <div className="sidebar-user-role">{user?.label || user?.role}</div>
          </div>
          <LogOut size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }}/>
        </div>
      </div>
    </aside>
  );
}
