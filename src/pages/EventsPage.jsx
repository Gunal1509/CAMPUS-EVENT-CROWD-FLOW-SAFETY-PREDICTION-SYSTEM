import { useState } from 'react';
import Header from '../components/Header';
import { useCrowdData } from '../context/CrowdDataContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Calendar, MapPin, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';

const FILTERS = ['All', 'live', 'upcoming', 'completed'];

export default function EventsPage() {
  const { events } = useCrowdData();
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === 'All' ? events : events.filter(e => e.status === filter);

  return (
    <div>
      <Header title="Events" subtitle="Campus event management and crowd breakdown"/>
      <div className="page-body">
        {/* Filters */}
        <div className="filter-bar">
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {f === 'All' ? 'All Events' : f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary strip */}
        <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          {[
            { label:'Live',      count: events.filter(e=>e.status==='live').length,      color:'var(--accent-green)' },
            { label:'Upcoming',  count: events.filter(e=>e.status==='upcoming').length,  color:'var(--accent-blue)'  },
            { label:'Completed', count: events.filter(e=>e.status==='completed').length, color:'var(--text-muted)'   },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(148,163,184,0.06)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 16px', display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ fontSize:'1.1rem', fontWeight:800, color:s.color }}>{s.count}</span>
              <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="event-cards-grid">
          {filtered.map(evt => {
            const fill = evt.currentAttendees / evt.expectedAttendees;
            const isOpen = expanded === evt.id;
            return (
              <div key={evt.id} className="event-card" onClick={()=>setExpanded(isOpen?null:evt.id)}>
                <div className="event-card-header">
                  <div>
                    <div className="event-card-name">{evt.name}</div>
                    <div className="event-card-venue">
                      <MapPin size={11} style={{ display:'inline', marginRight:3 }}/>{evt.venue}
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                    <span className={`badge badge-${evt.status}`}>{evt.status}</span>
                    {isOpen ? <ChevronUp size={14} style={{color:'var(--text-muted)'}}/> : <ChevronDown size={14} style={{color:'var(--text-muted)'}}/> }
                  </div>
                </div>
                <div className="event-card-body">
                  <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:12 }}>{evt.description}</div>
                  <div style={{ display:'flex', gap:12, marginBottom:12, flexWrap:'wrap' }}>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}>
                      <Calendar size={11}/>{evt.date}
                    </span>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}>
                      <Clock size={11}/>{evt.startTime} – {evt.endTime}
                    </span>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}>
                      <Users size={11}/>{evt.type}
                    </span>
                  </div>
                  {/* Attendance fill bar */}
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.73rem', marginBottom:4, color:'var(--text-muted)' }}>
                      <span>Attendance</span>
                      <span style={{ fontWeight:700, color:'var(--text-primary)' }}>
                        {evt.currentAttendees.toLocaleString()} / {evt.expectedAttendees.toLocaleString()}
                      </span>
                    </div>
                    <div className="fill-bar-track">
                      <div className={`fill-bar-fill ${fill>0.9?'critical':fill>0.7?'warning':'safe'}`} style={{ width:`${Math.round(fill*100)}%` }}/>
                    </div>
                  </div>
                </div>

                {/* Expanded chart */}
                {isOpen && (
                  <div style={{ padding:'0 18px 18px' }} onClick={e=>e.stopPropagation()}>
                    <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Gate-wise Attendance</div>
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={[
                        { gate:'Main', count: Math.floor(evt.currentAttendees*0.35) },
                        { gate:'East', count: Math.floor(evt.currentAttendees*0.22) },
                        { gate:'West', count: Math.floor(evt.currentAttendees*0.18) },
                        { gate:'South',count: Math.floor(evt.currentAttendees*0.15) },
                        { gate:'Admin',count: Math.floor(evt.currentAttendees*0.1) },
                      ]} margin={{top:0,right:0,bottom:0,left:-20}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)"/>
                        <XAxis dataKey="gate" tick={{fill:'#64748b',fontSize:10}} tickLine={false}/>
                        <YAxis tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false}/>
                        <Tooltip contentStyle={{background:'#0d1626',border:'1px solid rgba(148,163,184,0.15)',borderRadius:8,fontSize:11}}/>
                        <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} name="Attendees"/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
