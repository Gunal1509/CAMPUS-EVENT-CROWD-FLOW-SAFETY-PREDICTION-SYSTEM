import { useState } from 'react';
import Header from '../components/Header';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { HOURLY_CROWD, WEEKLY_TREND, EVENT_ATTENDANCE } from '../services/mockData';
import { Brain, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const RANGE_OPTS = ['Today', '7 Days', '30 Days'];

export default function AnalyticsPage() {
  const [range, setRange] = useState('7 Days');

  return (
    <div>
      <Header title="Analytics & Trends" subtitle="Historical crowd data, predictions, and ML insights"/>
      <div className="page-body">

        {/* Range filter */}
        <div className="filter-bar" style={{ marginBottom:20 }}>
          {RANGE_OPTS.map(r => (
            <button key={r} className={`filter-btn ${range===r?'active':''}`} onClick={()=>setRange(r)}>{r}</button>
          ))}
        </div>

        {/* Charts row */}
        <div className="page-grid cols-2" style={{ marginBottom:20 }}>
          {/* Weekly peak trend */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Peak Crowd per Day</span>
              <span style={{ fontSize:'0.73rem', color:'var(--text-muted)' }}>Last 7 days</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={WEEKLY_TREND} margin={{top:5,right:10,bottom:5,left:-10}}>
                  <defs>
                    <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)"/>
                  <XAxis dataKey="day" tick={{fill:'#64748b',fontSize:10}} tickLine={false}/>
                  <YAxis tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false}/>
                  <Tooltip contentStyle={{background:'#0d1626',border:'1px solid rgba(148,163,184,0.15)',borderRadius:8,fontSize:11}} labelStyle={{color:'#f1f5f9'}}/>
                  <Line type="monotone" dataKey="peak" stroke="#8b5cf6" strokeWidth={2.5} dot={{fill:'#8b5cf6',strokeWidth:0,r:4}} name="Peak Crowd" activeDot={{r:6}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Event attendance comparison */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Event Attendance vs Expected</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={EVENT_ATTENDANCE} margin={{top:5,right:10,bottom:5,left:-10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)"/>
                  <XAxis dataKey="name" tick={{fill:'#64748b',fontSize:10}} tickLine={false}/>
                  <YAxis tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false}/>
                  <Tooltip contentStyle={{background:'#0d1626',border:'1px solid rgba(148,163,184,0.15)',borderRadius:8,fontSize:11}} labelStyle={{color:'#f1f5f9'}}/>
                  <Legend wrapperStyle={{fontSize:11,color:'#94a3b8'}}/>
                  <Bar dataKey="expected"   fill="rgba(59,130,246,0.25)"  radius={[4,4,0,0]} name="Expected"/>
                  <Bar dataKey="attendance" fill="#06b6d4"                radius={[4,4,0,0]} name="Actual"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hourly area + Prediction */}
        <div className="page-grid cols-2-1" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Hourly Crowd Flow (Today)</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={HOURLY_CROWD} margin={{top:5,right:10,bottom:5,left:-10}}>
                  <defs>
                    <linearGradient id="areaGrad3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)"/>
                  <XAxis dataKey="hour" tick={{fill:'#64748b',fontSize:10}} tickLine={false}/>
                  <YAxis tick={{fill:'#64748b',fontSize:10}} tickLine={false} axisLine={false}/>
                  <Tooltip contentStyle={{background:'#0d1626',border:'1px solid rgba(148,163,184,0.15)',borderRadius:8,fontSize:11}} labelStyle={{color:'#f1f5f9'}}/>
                  <Area type="monotone" dataKey="entry" stroke="#06b6d4" fill="url(#areaGrad3)" strokeWidth={2.5} name="Entry"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ML Prediction Panel */}
          <div className="prediction-card">
            <div className="prediction-title"><Brain size={16}/> ML Predictions</div>
            <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:14 }}>
              Based on historical patterns, event schedule, and real-time sensor data:
            </p>
            {[
              { icon:<Clock size={13}/>,         label:'Peak crowd window', value:'3:00 – 4:00 PM today' },
              { icon:<AlertTriangle size={13}/>,  label:'Overcrowding risk', value:'West Gate (91% → 100%)' },
              { icon:<TrendingUp size={13}/>,     label:'Entry rate surge',  value:'Expected +67% at 2:30 PM' },
              { icon:<Brain size={13}/>,          label:'Model confidence',  value:'87% (XGBoost ensemble)' },
            ].map((p,i) => (
              <div key={i} className="prediction-item">
                <span className="prediction-item-icon">{p.icon}</span>
                <div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:1 }}>{p.label}</div>
                  <div style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-primary)' }}>{p.value}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop:16, padding:'10px 12px', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8 }}>
              <div style={{ fontSize:'0.72rem', color:'var(--accent-red)', fontWeight:600, marginBottom:4 }}>⚠ Recommended Action</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-secondary)' }}>Deploy 2 additional security personnel at West Gate and open Emergency Gate C by 2:30 PM.</div>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="card">
          <div className="card-header"><span className="card-title">7-Day Summary Statistics</span></div>
          <div className="card-body">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
              {[
                { label:'Total Footfall', value:'49,300', sub:'Past 7 days' },
                { label:'Avg Daily Peak',  value:'1,934',  sub:'People/day' },
                { label:'Busiest Day',     value:'Sat 23',  sub:'3,200 peak' },
                { label:'Avg Gate Utilisation', value:'68%', sub:'Across all gates' },
                { label:'Critical Incidents', value:'14',   sub:'Resolved: 12' },
                { label:'Events Covered',  value:'5',      sub:'All event types' },
              ].map(s => (
                <div key={s.label} style={{ background:'rgba(148,163,184,0.05)', borderRadius:10, padding:'14px 16px', textAlign:'center', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--accent-cyan)', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text-primary)', margin:'6px 0 2px' }}>{s.label}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
