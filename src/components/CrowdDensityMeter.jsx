export default function CrowdDensityMeter({ value = 0, label = 'Campus Capacity', size = 160 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, value));
  const offset = circumference * (1 - pct);
  const color = pct > 0.85 ? '#ef4444' : pct > 0.65 ? '#f59e0b' : '#10b981';

  return (
    <div className="gauge-wrap" style={{ gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth={12}/>
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90, ${size/2}, ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s' }}
          filter={`drop-shadow(0 0 6px ${color}88)`}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={size * 0.16} fontWeight="800" fontFamily="Inter,sans-serif">
          {Math.round(pct * 100)}%
        </text>
        <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle"
          fill="#94a3b8" fontSize={size * 0.075} fontFamily="Inter,sans-serif">
          {label}
        </text>
      </svg>
    </div>
  );
}
