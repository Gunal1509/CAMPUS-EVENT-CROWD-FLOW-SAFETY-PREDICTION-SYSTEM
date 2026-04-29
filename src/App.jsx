import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CrowdDataProvider } from './context/CrowdDataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

import LoginPage      from './pages/LoginPage';
import Dashboard      from './pages/Dashboard';
import GateMonitorPage from './pages/GateMonitorPage';
import EventsPage     from './pages/EventsPage';
import AnalyticsPage  from './pages/AnalyticsPage';
import AssistantPage  from './pages/AssistantPage';
import AlertsPage     from './pages/AlertsPage';
import AdminPage      from './pages/AdminPage';

function AppShell() {
  return (
    <div className="app-layout">
      <Sidebar/>
      <div className="main-content">
        <Outlet/>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CrowdDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage/>}/>

            <Route element={<ProtectedRoute><AppShell/></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/gates"     element={<ProtectedRoute allowedRoles={['admin','security']}><GateMonitorPage/></ProtectedRoute>}/>
              <Route path="/events"    element={<ProtectedRoute allowedRoles={['admin','organizer']}><EventsPage/></ProtectedRoute>}/>
              <Route path="/analytics" element={<AnalyticsPage/>}/>
              <Route path="/alerts"    element={<ProtectedRoute allowedRoles={['admin','security']}><AlertsPage/></ProtectedRoute>}/>
              <Route path="/assistant" element={<AssistantPage/>}/>
              <Route path="/admin"     element={<ProtectedRoute allowedRoles={['admin']}><AdminPage/></ProtectedRoute>}/>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
          </Routes>
        </BrowserRouter>
      </CrowdDataProvider>
    </AuthProvider>
  );
}
