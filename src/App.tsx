import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoginPage } from './modules/Auth/LoginPage';
import { MainLayout } from './modules/Layout/MainLayout';
import { ReportEquipment } from './modules/Tickets/ReportEquipment/ReportEquipment';
import { EquipmentStand } from './modules/Inventory/EquipmentStand/EquipmentStand';
import { MyRequests } from './modules/Tickets/MyRequests/MyRequests';
import { MyEquipment } from './modules/Inventory/MyEquipment/MyEquipment';
import { AdminPanel } from './modules/Admin/AdminPanel/AdminPanel';
import type { RootState } from './api/store/store';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Auth Route wrapper (redirects to app if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (token) {
    return <Navigate to="/app/report" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />

        {/* Protected App Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="report" element={<ReportEquipment />} />
          <Route path="stand" element={<EquipmentStand />} />
          <Route path="stand/:category" element={<EquipmentStand />} />
          <Route path="requests" element={<MyRequests />} />
          <Route path="equipment" element={<MyEquipment />} />
          <Route path="admin/:section" element={<AdminPanel />} />
          <Route index element={<Navigate to="report" replace />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App