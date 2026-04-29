/**
 * API Service — Campus Crowd Safety System
 *
 * CPPE Coverage:
 *   Cloud  : API Gateway (all endpoints) + Lambda (each function)
 *   Data   : S3 (raw storage) + Glue/Spark (ETL) + Athena (analytics queries)
 *   GenAI  : AWS Bedrock Claude 3 (assistant endpoint)
 *   Security: IAM roles per request, KMS-encrypted S3, CloudWatch audit logs
 *
 * Set VITE_API_BASE_URL in .env to your API Gateway Invoke URL to use live AWS.
 * When the env var is absent the app falls back to mock data automatically.
 */
import axios from 'axios';
import { generateGateData, CAMPUS_EVENTS, HOURLY_CROWD, ALERTS, getAIResponse } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = BASE_URL
  ? axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } })
  : null;

function delay(ms = 600) {
  return new Promise(r => setTimeout(r, ms));
}

function unwrap(res) {
  const raw = res.data;
  // Already direct data (no Lambda wrapper)
  if (!raw || typeof raw.body === 'undefined') return raw;
  const body = typeof raw.body === 'string' ? JSON.parse(raw.body) : raw.body;
  return body;
}

export async function fetchLiveCrowdData() {
  if (api) {
    const res = await api.get('/crowd/live');
    const data = unwrap(res);
    const rawGates = Array.isArray(data) ? data : (data?.gates ?? []);
    return rawGates.map(g => {
      const capacity = g.capacity ?? 500;
      const entry    = g.entry  ?? g.entered ?? 0;
      const exit_    = g.exit   ?? g.exited  ?? 0;
      const inside   = g.inside ?? g.occupancy ?? Math.max(0, entry - exit_);
      const density  = g.density ?? (inside / capacity);
      // Handle uppercase status values from Lambda (HIGH, MEDIUM, LOW, CRITICAL)
      const rawStatus = (g.status ?? 'safe').toUpperCase();
      let status = 'safe';
      if      (rawStatus === 'CRITICAL' || rawStatus === 'HIGH')             status = 'critical';
      else if (rawStatus === 'MEDIUM'   || rawStatus === 'WARNING')          status = 'warning';
      else if (rawStatus === 'LOW'      || rawStatus === 'SAFE')             status = 'safe';
      return {
        ...g,
        inside,
        capacity,
        density: Math.min(1, density),
        status,
        location: g.location ?? g.zone ?? '',
        entered:  entry,
        exited:   exit_,
      };
    });
  }
  await delay(400);
  return generateGateData();
}

// Events (Lambda: /events)
// API event fields: id, name, date, venue, status ("active"/"upcoming"), totalAttendees, capacity, gates[]
// Missing from API: description, startTime, endTime, type
export async function fetchEvents() {
  if (api) {
    const res = await api.get('/events');
    const data = unwrap(res);
    const events = Array.isArray(data) ? data : (data?.events ?? data?.data ?? []);
    return events.map(e => {
      // API uses "active" where the UI expects "live"
      let status = e.status ?? 'upcoming';
      if (status === 'active') status = 'live';
      return {
        ...e,
        status,
        currentAttendees:  e.currentAttendees  ?? e.totalAttendees  ?? 0,
        expectedAttendees: e.expectedAttendees  ?? e.capacity        ?? 0,
        // Fields not provided by API — use safe defaults
        description: e.description ?? e.details ?? `${e.name ?? 'Event'} at ${e.venue ?? 'campus'}`,
        startTime:   e.startTime   ?? e.start_time ?? '—',
        endTime:     e.endTime     ?? e.end_time   ?? '—',
        type:        e.type        ?? e.eventType  ?? 'Event',
        venue:       e.venue       ?? e.location   ?? '',
      };
    });
  }
  await delay(300);
  return CAMPUS_EVENTS;
}

// Hourly Trend (Lambda: /analytics/hourly + Athena)
// Response body: { hourly: [...], peakHour, peakCount, ... }
export async function fetchHourlyTrend() {
  if (api) {
    const res = await api.get('/analytics/hourly');
    const data = unwrap(res);
    return Array.isArray(data) ? data : (data?.hourly ?? data?.data ?? []);
  }
  await delay(500);
  return HOURLY_CROWD;
}

// Alerts (Lambda: /alerts)
// API alert fields: id, severity, gate, zone, message, timestamp, acknowledged
// Missing from API: event, time (uses timestamp instead)
export async function fetchAlerts() {
  if (api) {
    const res = await api.get('/alerts');
    const data = unwrap(res);
    const alerts = Array.isArray(data) ? data : (data?.alerts ?? data?.data ?? []);
    return alerts.map(a => {
      // Format ISO timestamp to readable time e.g. "09:42 AM"
      let time = a.time ?? '';
      if (!time && a.timestamp) {
        try {
          time = new Date(a.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } catch { time = a.timestamp; }
      }
      return {
        ...a,
        status:   a.status   ?? (a.acknowledged ? 'resolved' : 'active'),
        severity: a.severity ?? 'info',
        gate:     a.gate     ?? a.zone ?? 'Unknown',
        zone:     a.zone     ?? a.gate ?? '',
        message:  a.message  ?? a.description ?? '',
        // API has no "event" field — derive from zone or leave blank
        event:    a.event    ?? a.zone ?? '',
        time,
      };
    });
  }
  await delay(300);
  return ALERTS;
}

// Acknowledge alert (Lambda: POST /alerts/{id}/ack)
export async function acknowledgeAlert(id) {
  if (api) {
    const res = await api.post(`/alerts/${id}/ack`);
    return unwrap(res);
  }
  await delay(200);
  return { success: true, id };
}

// GenAI Assistant (Lambda: POST /assistant/query → Bedrock)
export async function queryAssistant(prompt) {
  if (api) {
    const res = await api.post('/assistant/query', { prompt });
    return unwrap(res);
  }
  await delay(900 + Math.random() * 500);
  return getAIResponse(prompt);
}
