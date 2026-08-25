import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

import Login from './pages/Login.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Coaches from './pages/admin/Coaches.jsx';
import Admins from './pages/admin/Admins.jsx';
import Athletes from './pages/admin/Athletes.jsx';
import Categories from './pages/admin/Categories.jsx';
import AdminAttendanceHistory from './pages/admin/AttendanceHistory.jsx';
import Folders from './pages/admin/Folders.jsx';
import DocumentTracking from './pages/admin/DocumentTracking.jsx';

import CoachDashboard from './pages/coach/CoachDashboard.jsx';
import StartAttendance from './pages/coach/StartAttendance.jsx';
import CoachAttendanceHistory from './pages/coach/AttendanceHistory.jsx';
import AthleteList from './pages/coach/AthleteList.jsx';
import DocumentChecklist from './pages/coach/DocumentChecklist.jsx';

export default function App() {
  const { isAuthenticated, profile, loading } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          loading ? null : isAuthenticated ? (
            <Navigate to={profile.role === 'admin' ? '/admin' : '/coach'} replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="coaches" element={<Coaches />} />
        <Route path="admins" element={<Admins />} />
        <Route path="athletes" element={<Athletes />} />
        <Route path="categories" element={<Categories />} />
        <Route path="attendance" element={<AdminAttendanceHistory />} />
        <Route path="folders" element={<Folders />} />
        <Route path="documents" element={<DocumentTracking />} />
      </Route>

      <Route
        path="/coach"
        element={
          <ProtectedRoute allowedRoles={['coach']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CoachDashboard />} />
        <Route path="attendance/start" element={<StartAttendance />} />
        <Route path="attendance/history" element={<CoachAttendanceHistory />} />
        <Route path="athletes" element={<AthleteList />} />
        <Route path="documents" element={<DocumentChecklist />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
