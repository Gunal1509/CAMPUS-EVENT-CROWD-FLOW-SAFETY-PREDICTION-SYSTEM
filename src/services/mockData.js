// ─── Mock data for Campus Event Crowd Flow & Safety Prediction System ───

export const CAMPUS_EVENTS = [
  { id: 'evt1', name: 'TechFest 2024', type: 'Cultural Fest', venue: 'Main Auditorium', date: '2024-03-22', startTime: '09:00', endTime: '20:00', status: 'live', expectedAttendees: 5000, currentAttendees: 3240, description: 'Annual technology & cultural festival' },
  { id: 'evt2', name: 'Placement Drive - TCS', type: 'Placement Drive', venue: 'CSE Block', date: '2024-03-22', startTime: '08:00', endTime: '17:00', status: 'live', expectedAttendees: 800, currentAttendees: 642, description: 'TCS placement drive for 2024 batch' },
  { id: 'evt3', name: 'Seminar: AI in HealthCare', type: 'Seminar', venue: 'Seminar Hall B', date: '2024-03-22', startTime: '10:00', endTime: '13:00', status: 'live', expectedAttendees: 300, currentAttendees: 287, description: 'Guest lecture by Dr. Priya Sharma, IIT Bombay' },
  { id: 'evt4', name: 'Sports Carnival', type: 'Sports', venue: 'Ground & Gym', date: '2024-03-23', startTime: '07:00', endTime: '18:00', status: 'upcoming', expectedAttendees: 2000, currentAttendees: 0, description: 'Inter-department sports competition' },
  { id: 'evt5', name: 'Alumni Meet 2024', type: 'Alumni', venue: 'Convention Center', date: '2024-03-20', startTime: '11:00', endTime: '21:00', status: 'completed', expectedAttendees: 1200, currentAttendees: 1147, description: 'Annual alumni networking event' },
];

export const GATES_BASE = [
  { id: 'g1', name: 'Main Gate',       location: 'North Campus',          capacity: 500, entered: 2450, exited: 1820, status: 'warning' },
  { id: 'g2', name: 'East Gate',       location: 'Academic Block',        capacity: 300, entered: 1230, exited: 980,  status: 'safe' },
  { id: 'g3', name: 'West Gate',       location: 'Hostel Side',           capacity: 200, entered: 890,  exited: 710,  status: 'critical' },
  { id: 'g4', name: 'South Gate',      location: 'Sports Complex',        capacity: 400, entered: 560,  exited: 490,  status: 'safe' },
  { id: 'g5', name: 'Admin Gate',      location: 'Administrative Block',  capacity: 150, entered: 340,  exited: 305,  status: 'safe' },
  { id: 'g6', name: 'Emergency Gate C',location: 'Lab Complex',           capacity: 100, entered: 180,  exited: 155,  status: 'warning' },
];

// ── ML: per-gate historical stats from crowd_training_data.csv (30-day baseline) ──
const TRAINING_STATS = {
  'g1': { mean: 112.6, std: 113.2 },  // Main Gate
  'g2': { mean: 84.5,  std: 87.3  },  // East Gate
  'g3': { mean: 48.5,  std: 51.9  },  // West Gate
  'g4': { mean: 130.0, std: 129.3 },  // South Gate
  'g5': { mean: 38.3,  std: 41.7  },  // Admin Gate
  'g6': { mean: 27.8,  std: 30.1  },  // Emergency Gate C
};

const ANOMALY_THRESHOLD = 2.5;

function computeZScore(gateId, occupancy) {
  const s = TRAINING_STATS[gateId];
  if (!s || s.std === 0) return 0;
  return parseFloat(((occupancy - s.mean) / s.std).toFixed(2));
}

export function generateGateData() {
  return GATES_BASE.map(g => {
    const variance = Math.floor((Math.random() - 0.5) * 20);
    const entered = Math.max(0, g.entered + variance);
    const inside  = Math.max(0, entered - g.exited);
    const density = inside / g.capacity;
    let status = 'safe';
    if (density > 0.85) status = 'critical';
    else if (density > 0.65) status = 'warning';

    // ── ML Anomaly Detection (Z-score vs 30-day training baseline) ──
    const zScore  = computeZScore(g.id, inside);
    const anomaly = zScore > ANOMALY_THRESHOLD;

    return {
      ...g,
      entered,
      inside,
      density: Math.min(1, density),
      status,
      anomaly,
      zScore,
      mlAlert: anomaly ? `Unusual crowd surge detected — Z-score ${zScore}` : null,
    };
  });
}

// 24-hour hourly crowd data (today)
export const HOURLY_CROWD = [
  { hour: '08:00', entry: 120, exit: 10 },
  { hour: '09:00', entry: 380, exit: 45 },
  { hour: '10:00', entry: 620, exit: 110 },
  { hour: '11:00', entry: 790, exit: 180 },
  { hour: '12:00', entry: 540, exit: 430 },
  { hour: '13:00', entry: 310, exit: 680 },
  { hour: '14:00', entry: 480, exit: 240 },
  { hour: '15:00', entry: 760, exit: 190 },
  { hour: '16:00', entry: 820, exit: 210 },
  { hour: '17:00', entry: 650, exit: 480 },
  { hour: '18:00', entry: 230, exit: 710 },
  { hour: '19:00', entry: 140, exit: 520 },
];

// 7-day historical crowd trend
export const WEEKLY_TREND = [
  { day: 'Mon 18', peak: 1240, total: 4500 },
  { day: 'Tue 19', peak: 1560, total: 5200 },
  { day: 'Wed 20', peak: 2100, total: 8900 },
  { day: 'Thu 21', peak: 1800, total: 6700 },
  { day: 'Fri 22', peak: 2640, total: 9200 },
  { day: 'Sat 23', peak: 3200, total: 11000 },
  { day: 'Sun 24', peak: 1100, total: 3800 },
];

// Event-wise attendance comparison
export const EVENT_ATTENDANCE = [
  { name: 'TechFest', attendance: 3240, expected: 5000 },
  { name: 'TCS Drive', attendance: 642, expected: 800 },
  { name: 'AI Seminar', attendance: 287, expected: 300 },
  { name: 'Sports', attendance: 0, expected: 2000 },
  { name: 'Alumni Meet', attendance: 1147, expected: 1200 },
];

// Heatmap zones
export const CAMPUS_ZONES = [
  { id: 'z1', name: 'Main Gate',      density: 0.78, x: 0, y: 0 },
  { id: 'z2', name: 'Parking',        density: 0.35, x: 1, y: 0 },
  { id: 'z3', name: 'Admin Block',    density: 0.45, x: 2, y: 0 },
  { id: 'z4', name: 'CSE Dept',       density: 0.82, x: 3, y: 0 },
  { id: 'z5', name: 'Auditorium',     density: 0.95, x: 0, y: 1 },
  { id: 'z6', name: 'Canteen',        density: 0.88, x: 1, y: 1 },
  { id: 'z7', name: 'Library',        density: 0.62, x: 2, y: 1 },
  { id: 'z8', name: 'Lab Complex',    density: 0.71, x: 3, y: 1 },
  { id: 'z9', name: 'ECE Dept',       density: 0.55, x: 0, y: 2 },
  { id: 'z10',name: 'Seminar Hall',   density: 0.93, x: 1, y: 2 },
  { id: 'z11',name: 'Sports Ground',  density: 0.28, x: 2, y: 2 },
  { id: 'z12',name: 'Hostel A',       density: 0.42, x: 3, y: 2 },
  { id: 'z13',name: 'Hostel B',       density: 0.38, x: 0, y: 3 },
  { id: 'z14',name: 'Medical',        density: 0.2,  x: 1, y: 3 },
  { id: 'z15',name: 'East Gate',      density: 0.65, x: 2, y: 3 },
  { id: 'z16',name: 'West Gate',      density: 0.91, x: 3, y: 3 },
];

export const ALERTS = [
  { id: 'a1', severity: 'critical', gate: 'West Gate',      event: 'TechFest 2024',         time: '09:42 AM', message: 'Crowd density exceeded 90% capacity', status: 'active' },
  { id: 'a2', severity: 'warning',  gate: 'Main Gate',      event: 'TechFest 2024',         time: '09:38 AM', message: 'Unusual crowd flow pattern detected',  status: 'active' },
  { id: 'a3', severity: 'critical', gate: 'Seminar Hall',   event: 'AI in HealthCare',      time: '09:30 AM', message: 'Zone at maximum capacity (>95%)',        status: 'active' },
  { id: 'a4', severity: 'warning',  gate: 'Emergency Gate C',event: 'TechFest 2024',        time: '09:15 AM', message: 'Entry rate 3x above normal baseline',    status: 'active' },
  { id: 'a5', severity: 'info',     gate: 'East Gate',      event: 'TCS Placement Drive',   time: '08:55 AM', message: 'Peak arrival period started',            status: 'resolved' },
  { id: 'a6', severity: 'info',     gate: 'South Gate',     event: 'Sports Carnival',       time: '08:30 AM', message: 'Gate opened for sports complex access',   status: 'resolved' },
];

export const USERS = [
  { id: 'u1', name: 'Dr. Rajesh Kumar',   role: 'admin',     email: 'rajesh.k@campus.edu',   lastLogin: '2024-03-22 08:30', status: 'active' },
  { id: 'u2', name: 'Priya Nair',         role: 'organizer', email: 'priya.n@campus.edu',     lastLogin: '2024-03-22 08:45', status: 'active' },
  { id: 'u3', name: 'Sgt. Arun Mehta',    role: 'security',  email: 'arun.m@security.edu',    lastLogin: '2024-03-22 07:00', status: 'active' },
  { id: 'u4', name: 'Kavya Reddy',        role: 'organizer', email: 'kavya.r@campus.edu',     lastLogin: '2024-03-21 18:22', status: 'active' },
  { id: 'u5', name: 'Insp. Suresh Babu',  role: 'security',  email: 'suresh.b@security.edu',  lastLogin: '2024-03-22 06:50', status: 'active' },
  { id: 'u6', name: 'Meera Iyer',         role: 'organizer', email: 'meera.i@campus.edu',     lastLogin: '2024-03-20 14:00', status: 'inactive' },
];

export const AUDIT_LOGS = [
  { id: 'l1', action: 'Alert Acknowledged',  user: 'Sgt. Arun Mehta',   time: '09:44 AM', ip: '10.0.1.42',  resource: 'Alert #a6' },
  { id: 'l2', action: 'Event Created',       user: 'Priya Nair',        time: '09:30 AM', ip: '10.0.1.15',  resource: 'Sports Carnival' },
  { id: 'l3', action: 'User Role Updated',   user: 'Dr. Rajesh Kumar',  time: '09:15 AM', ip: '10.0.1.1',   resource: 'Meera Iyer → inactive' },
  { id: 'l4', action: 'Report Exported',     user: 'Kavya Reddy',       time: '08:58 AM', ip: '10.0.1.33',  resource: 'Analytics CSV' },
  { id: 'l5', action: 'Gate Config Changed', user: 'Dr. Rajesh Kumar',  time: '08:30 AM', ip: '10.0.1.1',   resource: 'West Gate capacity: 200' },
  { id: 'l6', action: 'Login',               user: 'Sgt. Arun Mehta',   time: '07:00 AM', ip: '10.0.1.42',  resource: 'Security Dashboard' },
];

export const AI_RESPONSES = {
  overcrowded: {
    answer: "Based on current crowd flow analytics and ML predictions, **Gate 3 (West Gate)** is highly likely to become overcrowded within the next 20–30 minutes. Current density is at **91%** of capacity. I recommend opening **Emergency Gate C** and redirecting crowds to **East Gate** which is only at 42% capacity.",
    insights: [
      { label: "West Gate Density", value: "91%", severity: "critical" },
      { label: "Predicted Peak", value: "10:15 AM", severity: "warning" },
      { label: "Recommended Action", value: "Open alternate gate", severity: "info" },
    ]
  },
  peakTime: {
    answer: "Today's crowd density is predicted to peak at **3:00 PM – 4:00 PM** based on TechFest event schedule analysis and historical patterns from similar events. The previous year's TechFest showed a 67% attendance surge between 2:30 PM and 4:30 PM. Ensure all 6 gates are fully operational by 2:00 PM.",
    insights: [
      { label: "Peak Window", value: "3:00 – 4:00 PM", severity: "warning" },
      { label: "Expected Surge", value: "820+ entry/hr", severity: "warning" },
      { label: "Current Avg Entry Rate", value: "380/hr", severity: "info" },
    ]
  },
  default: {
    answer: "I have analysed the current crowd flow data and real-time sensor readings. All monitored gates are operational. **3 events are currently live** with a combined attendance of **4,169 people** on campus. The average crowd density is **68%** across all monitored zones. Would you like a detailed breakdown by gate or event?",
    insights: [
      { label: "Active Events", value: "3", severity: "info" },
      { label: "Total On-Campus", value: "4,169", severity: "info" },
      { label: "Avg Density", value: "68%", severity: "warning" },
    ]
  }
};

export function getAIResponse(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('overcrowd') || lower.includes('gate') || lower.includes('entry')) return AI_RESPONSES.overcrowded;
  if (lower.includes('peak') || lower.includes('time') || lower.includes('when')) return AI_RESPONSES.peakTime;
  return AI_RESPONSES.default;
}
