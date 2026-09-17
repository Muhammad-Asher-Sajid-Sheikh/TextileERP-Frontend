import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import MerchandiseDashboard from './pages/merchandiseDashboard/MerchandiseDashboard';
import PreApprovedSamplesDashboard from "./pages/merchandiseDashboard/PreApprovedSamplesDashboard.jsx";
import ProductionDashboard from "./pages/productionDashboard/ProductionDashboard.jsx";
import AssemblyDashboard from "./pages/assemblyDashboard/AssemblyDashboard.jsx";
import SurfaceDecorationsDashboard from "./pages/SurfaceDecorationsDashboard/SurfaceDecorationsDashboard.jsx";

import PartyServiceDashboard from './pages/marketingDashboard/PartyServiceDashboard.jsx';
import InquiryServiceDashboard from './pages/marketingDashboard/InquiryServiceDashboard.jsx';
import BaselineServiceDashboard from './pages/marketingDashboard/BaselineServiceDashboard.jsx';
import CostSheetDashboard from './pages/marketingDashboard/CostSheetDashboard.jsx';
import SamplesDashboard from './pages/marketingDashboard/SamplesDashboard.jsx';
import SalesServicesDashboard from './pages/marketingDashboard/SalesContractServiceDashboard.jsx';
import SalesOrdersDashboard from "./pages/marketingDashboard/SalesOrdersDashboard.jsx";

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-secondary)',
        gap: '16px'
      }}>
        <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }}></div>
        <div style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.5px' }}>Securing ERP connection...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public-only route wrapper component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-secondary)',
        gap: '16px'
      }}>
        <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }}></div>
        <div style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.5px' }}>Checking session details...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/marketing/party" element={<PartyServiceDashboard />} />
          <Route path="/marketing/inquiry" element={<InquiryServiceDashboard />} />
          <Route path="/marketing/baseline" element={<BaselineServiceDashboard />} />
          <Route path="/marketing/cost-sheet" element={<CostSheetDashboard />} />
          <Route path="/marketing/samples" element={<SamplesDashboard />} />
          <Route path="/marketing/sales" element={<SalesServicesDashboard />} />
          <Route
            path="/marketing/sales-orders"
            element={<SalesOrdersDashboard />}
          />


          <Route path="production/assembly" element={<AssemblyDashboard />} />
          <Route path="production/surface-decorations" element={<SurfaceDecorationsDashboard />} />
          <Route path="/production/scratch" element={<ProductionDashboard />} />


          <Route path="/pre-approved-samples" element={<PreApprovedSamplesDashboard />} />

          <Route path="/merchandise" element={<MerchandiseDashboard />} />
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Default Redirections */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
