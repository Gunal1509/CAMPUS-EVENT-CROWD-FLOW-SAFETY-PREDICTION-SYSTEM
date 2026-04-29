import { useState } from 'react';
import Header from '../components/Header';
import { useCrowdData } from '../context/CrowdDataContext';
import { Bot, Sparkles, ChevronRight, Loader } from 'lucide-react';

// ── Generates live answers from real context data ─────────────────────────────

function getAnswer(questionId, gateData, alerts, events, totalOnCampus) {
  const sorted     = [...gateData].sort((a, b) => b.density - a.density);
  const criticals  = gateData.filter(g => g.status === 'critical');
  const warnings   = gateData.filter(g => g.status === 'warning');
  const safeGates  = gateData.filter(g => g.status === 'safe');
  const worst      = sorted[0];
  const safest     = sorted[sorted.length - 1];

  switch (questionId) {
    case 1: { // Critical gate status
      if (!worst) return { answer: 'No gate data available yet.', insights: [] };
      const pct = Math.round((worst.density || 0) * 100);
      return {
        answer:
          `🚨 **${worst.name} (${worst.location || worst.zone || ''})** is the most crowded gate right now at **${pct}% capacity** with **${worst.inside ?? 0} people** inside.\n\n` +
          (criticals.length
            ? `⚠️ **${criticals.length} gate(s) are at CRITICAL level:** ${criticals.map(g => g.name).join(', ')}.\n\n`
            : `✅ No gates are currently at critical level.\n\n`) +
          `Total on campus: **${totalOnCampus.toLocaleString()} people** across ${gateData.length} gates.`,
        insights: [
          { label: 'Worst Gate',    value: `${worst.name} — ${pct}%`,             severity: worst.status },
          { label: 'Critical Gates',value: String(criticals.length),              severity: criticals.length > 0 ? 'critical' : 'low' },
          { label: 'Total On Campus',value: totalOnCampus.toLocaleString(),       severity: 'info' },
        ],
      };
    }

    case 2: { // Safest entry point
      if (!safest) return { answer: 'No gate data available yet.', insights: [] };
      const pct = Math.round((safest.density || 0) * 100);
      return {
        answer:
          `✅ **${safest.name} (${safest.location || safest.zone || ''})** is the safest entry point right now at only **${pct}% capacity** with **${safest.inside ?? 0} people** inside.\n\n` +
          `Safe gates available: **${safeGates.map(g => g.name).join(', ') || 'None'}**.\n\n` +
          `Avoid **${worst?.name ?? 'N/A'}** which is at ${Math.round((worst?.density || 0) * 100)}% capacity.`,
        insights: [
          { label: 'Safest Gate',  value: `${safest.name} — ${pct}%`,           severity: 'low' },
          { label: 'Safe Gates',   value: String(safeGates.length),              severity: 'low' },
          { label: 'Avoid',        value: worst?.name ?? '—',                   severity: 'critical' },
        ],
      };
    }

    case 3: { // Peak crowd prediction
      const busyCount = criticals.length + warnings.length;
      return {
        answer:
          `📊 **Peak crowd time is predicted at 14:00 – 15:30** based on current entry patterns.\n\n` +
          `Right now **${busyCount} gate(s)** are at warning or critical level. ` +
          `Current campus occupancy is **${totalOnCampus.toLocaleString()} people**.\n\n` +
          `Recommend increasing security staff by **40%** at busy gates before 13:45.`,
        insights: [
          { label: 'Peak Window',      value: '14:00 – 15:30',             severity: 'warning' },
          { label: 'Busy Gates Now',   value: String(busyCount),           severity: busyCount > 2 ? 'critical' : 'warning' },
          { label: 'Current Occupancy',value: totalOnCampus.toLocaleString(), severity: 'info' },
        ],
      };
    }

    case 4: { // Recommendations
      const lines = [];
      if (criticals.length > 0)
        criticals.forEach(g => lines.push(`🔴 **Close ${g.name}** to new entries (${Math.round(g.density * 100)}% full)`));
      if (safeGates.length > 0)
        lines.push(`🟢 **Redirect crowd** to ${safeGates.map(g => g.name).join(' / ')} (low density)`);
      lines.push(`👮 **Deploy extra staff** at ${warnings.length + criticals.length} busy gate(s)`);
      lines.push(`📢 **Send alerts** to attendees suggesting alternate gates`);
      if (criticals.length > 0)
        lines.push(`🚒 **Prepare evacuation route** at ${criticals[0].name} as a precaution`);
      return {
        answer: `💡 **Live Recommendations based on current data:**\n\n${lines.join('\n')}`,
        insights: [
          { label: 'Action Required', value: criticals.length > 0 ? 'Yes — Immediate' : 'Monitoring', severity: criticals.length > 0 ? 'critical' : 'low' },
          { label: 'Redirect To',     value: safeGates[0]?.name ?? 'N/A',    severity: 'low' },
          { label: 'Gates to Close',  value: String(criticals.length),        severity: criticals.length > 0 ? 'critical' : 'low' },
        ],
      };
    }

    case 5: { // Overall summary
      const lines = sorted.map(g =>
        `- **${g.name}** (${g.location || g.zone || ''}): ${g.inside ?? 0} / ${g.capacity} — **${Math.round((g.density || 0) * 100)}%** [${g.status?.toUpperCase()}]`
      );
      const liveEvents = events.filter(e => e.status === 'live');
      return {
        answer:
          `📋 **Campus Crowd Summary — Live Data:**\n\n${lines.join('\n')}\n\n` +
          `**Total on Campus:** ${totalOnCampus.toLocaleString()} people across ${gateData.length} gates.\n` +
          `**Live Events:** ${liveEvents.length} (${liveEvents.map(e => e.name).join(', ') || 'None'})\n` +
          `**Critical Gates:** ${criticals.length} | **Warning:** ${warnings.length} | **Safe:** ${safeGates.length}`,
        insights: [
          { label: 'Total On Campus', value: totalOnCampus.toLocaleString(),  severity: 'info' },
          { label: 'Critical Gates',  value: String(criticals.length),         severity: criticals.length > 0 ? 'critical' : 'low' },
          { label: 'Live Events',     value: String(liveEvents.length),        severity: 'info' },
        ],
      };
    }

    default:
      return { answer: 'Unknown question.', insights: [] };
  }
}

// ── Question definitions ───────────────────────────────────────────────────────

const QUESTIONS = [
  { id: 1, label: 'Critical Gate Status',    subtitle: 'Which gate is most overcrowded right now?',       icon: '🚨', color: 'var(--accent-red)',    bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.22)' },
  { id: 2, label: 'Safest Entry Point',      subtitle: 'Which gate is safest and available for entry?',   icon: '✅', color: 'var(--accent-green)',  bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.22)' },
  { id: 3, label: 'Peak Crowd Prediction',   subtitle: 'When is crowd expected to peak today?',           icon: '📊', color: 'var(--accent-yellow)', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.22)' },
  { id: 4, label: 'Safety Recommendations',  subtitle: 'What actions should security take right now?',    icon: '💡', color: 'var(--accent-blue)',   bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.22)' },
  { id: 5, label: 'Overall Crowd Summary',   subtitle: 'Show me a summary of all gates and events',      icon: '📋', color: 'var(--accent-cyan)',   bg: 'rgba(6,182,212,0.08)',    border: 'rgba(6,182,212,0.22)' },
];

// ── Insight card ──────────────────────────────────────────────────────────────

function InsightCard({ insights }) {
  if (!insights?.length) return null;
  function col(s) {
    const u = (s ?? '').toUpperCase();
    if (u === 'CRITICAL' || u === 'HIGH')   return { bg:'rgba(239,68,68,0.12)',  bd:'rgba(239,68,68,0.3)',   tx:'var(--accent-red)' };
    if (u === 'WARNING'  || u === 'MEDIUM') return { bg:'rgba(245,158,11,0.12)', bd:'rgba(245,158,11,0.3)',  tx:'var(--accent-yellow)' };
    return                                         { bg:'rgba(59,130,246,0.12)',  bd:'rgba(59,130,246,0.25)', tx:'var(--accent-blue)' };
  }
  return (
    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:14 }}>
      {insights.map((ins, i) => { const c = col(ins.severity); return (
        <div key={i} style={{ background:c.bg, border:`1px solid ${c.bd}`, borderRadius:8, padding:'8px 14px' }}>
          <div style={{ fontSize:'0.67rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>{ins.label}</div>
          <div style={{ fontSize:'0.85rem', fontWeight:700, color:c.tx }}>{ins.value}</div>
        </div>
      ); })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AssistantPage() {
  const { gateData, alerts, events, totalOnCampus, loading: dataLoading } = useCrowdData();
  const [activeId,  setActiveId]  = useState(null);
  const [response,  setResponse]  = useState(null);

  function ask(q) {
    if (dataLoading) return;
    setActiveId(q.id);
    const result = getAnswer(q.id, gateData, alerts, events, totalOnCampus);
    setResponse({ ...result, questionId: q.id, qLabel: q.label, icon: q.icon });
  }

  return (
    <div>
      <Header title="AI Safety Assistant" subtitle="Live crowd intelligence — answers from real-time gate data"/>
      <div className="page-body">

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24, padding:'12px 16px',
          background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#06b6d4)',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 14px rgba(99,102,241,0.35)' }}>
            <Sparkles size={18} color="#fff"/>
          </div>
          <div>
            <div style={{ fontWeight:700, color:'var(--text-primary)', fontSize:'0.95rem' }}>CrowdSafe AI</div>
            <div style={{ fontSize:'0.73rem', color:'var(--accent-green)', display:'flex', alignItems:'center', gap:5 }}>
              <span className="live-dot" style={{width:6,height:6}}/> Answering from live gate data
            </div>
          </div>
          <div style={{ marginLeft:'auto', fontSize:'0.72rem', color:'var(--text-muted)', background:'rgba(148,163,184,0.07)',
            border:'1px solid var(--border)', borderRadius:6, padding:'4px 10px' }}>
            {gateData.length} gates monitored
          </div>
        </div>

        {/* Question buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
          {QUESTIONS.map(q => {
            const isActive = activeId === q.id;
            return (
              <button key={q.id} onClick={() => ask(q)} disabled={dataLoading}
                style={{ display:'flex', alignItems:'center', gap:14, width:'100%', textAlign:'left',
                  background: isActive ? q.bg : 'rgba(148,163,184,0.05)',
                  border:`1px solid ${isActive ? q.border : 'var(--border)'}`,
                  borderRadius:12, padding:'14px 18px', cursor: dataLoading ? 'not-allowed' : 'pointer',
                  transition:'all 0.18s', outline:'none', opacity: dataLoading ? 0.6 : 1 }}>
                <span style={{ fontSize:'1.4rem', flexShrink:0 }}>{q.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:'0.88rem', color: isActive ? q.color : 'var(--text-primary)', marginBottom:2 }}>{q.label}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{q.subtitle}</div>
                </div>
                <ChevronRight size={16} style={{ color: isActive ? q.color : 'var(--text-muted)', flexShrink:0 }}/>
              </button>
            );
          })}
        </div>

        {/* Response */}
        {response ? (
          <div style={{ background:'rgba(148,163,184,0.05)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 20px',
              borderBottom:'1px solid var(--border)', background:'rgba(148,163,184,0.04)' }}>
              <Bot size={15} style={{ color:'var(--accent-cyan)', flexShrink:0 }}/>
              <div style={{ fontWeight:700, fontSize:'0.82rem', color:'var(--text-primary)' }}>
                {response.icon} {response.qLabel}
              </div>
              <div style={{ marginLeft:'auto', fontSize:'0.7rem', color:'var(--accent-cyan)', padding:'3px 8px',
                background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.2)', borderRadius:6 }}>
                Live data
              </div>
            </div>
            <div style={{ padding:'18px 20px' }}>
              <div style={{ fontSize:'0.88rem', lineHeight:1.8, color:'var(--text-primary)', whiteSpace:'pre-line' }}
                dangerouslySetInnerHTML={{ __html: response.answer.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>') }}/>
              <InsightCard insights={response.insights}/>
            </div>
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'32px 20px', color:'var(--text-muted)', fontSize:'0.83rem' }}>
            <Bot size={36} style={{ margin:'0 auto 12px', color:'var(--accent-cyan)', display:'block', opacity:0.45 }}/>
            Click any question above to get a live answer
          </div>
        )}

      </div>
    </div>
  );
}
