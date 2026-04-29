import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchLiveCrowdData, fetchEvents, fetchAlerts } from '../services/api';

const CrowdDataContext = createContext(null);

export function CrowdDataProvider({ children }) {
  const [gateData,  setGateData]  = useState([]);
  const [events,    setEvents]    = useState([]);
  const [alerts,    setAlerts]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [gates, evts, alts] = await Promise.all([
        fetchLiveCrowdData(),
        fetchEvents(),
        fetchAlerts(),
      ]);
      setGateData(Array.isArray(gates) ? gates : []);
      setEvents(Array.isArray(evts)   ? evts   : []);
      setAlerts(Array.isArray(alts)   ? alts   : []);
      setLastUpdate(new Date());
    } catch (e) {
      console.error('Crowd data fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [refresh]);

  function acknowledgeLocalAlert(id) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
  }

  const totalOnCampus = gateData.reduce((s, g) => s + (g.inside || 0), 0);
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const activeEvents  = events.filter(e => e.status === 'live').length;

  return (
    <CrowdDataContext.Provider value={{
      gateData, events, alerts, loading, lastUpdate,
      totalOnCampus, criticalCount, activeEvents,
      refresh, acknowledgeLocalAlert,
    }}>
      {children}
    </CrowdDataContext.Provider>
  );
}

export function useCrowdData() {
  return useContext(CrowdDataContext);
}
