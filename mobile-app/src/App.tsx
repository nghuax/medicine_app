import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppData } from "@shared/data/app-provider";

const LoginPage = lazy(() => import("./routes/login-page").then((module) => ({ default: module.LoginPage })));
const VerifyPage = lazy(() => import("./routes/verify-page").then((module) => ({ default: module.VerifyPage })));
const ProfileSetupPage = lazy(() => import("./routes/profile-setup-page").then((module) => ({ default: module.ProfileSetupPage })));
const HomePage = lazy(() => import("./routes/home-page").then((module) => ({ default: module.HomePage })));
const MedicinePage = lazy(() => import("./routes/medicine-page").then((module) => ({ default: module.MedicinePage })));
const MedicineDetailPage = lazy(() => import("./routes/medicine-detail-page").then((module) => ({ default: module.MedicineDetailPage })));
const DailyPage = lazy(() => import("./routes/daily-page").then((module) => ({ default: module.DailyPage })));
const ScanPage = lazy(() => import("./routes/scan-page").then((module) => ({ default: module.ScanPage })));
const ProductInsightPage = lazy(() => import("./routes/product-insight-page").then((module) => ({ default: module.ProductInsightPage })));
const StatusPage = lazy(() => import("./routes/status-page").then((module) => ({ default: module.StatusPage })));
const NotificationsPage = lazy(() => import("./routes/notifications-page").then((module) => ({ default: module.NotificationsPage })));

function GuardedRoute({ children }: { children: ReactNode }) {
  const { state } = useAppData();
  const location = useLocation();

  if (!state.session.isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return children;
}

export default function App() {
  const { state } = useAppData();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <Routes>
        <Route
          element={<Navigate replace to={state.session.isAuthenticated ? "/home" : "/login"} />}
          path="/"
        />
        <Route element={<LoginPage />} path="/login" />
        <Route
          element={
            <GuardedRoute>
              <VerifyPage />
            </GuardedRoute>
          }
          path="/verify"
        />
        <Route
          element={
            <GuardedRoute>
              <ProfileSetupPage />
            </GuardedRoute>
          }
          path="/profile"
        />
        <Route
          element={
            <GuardedRoute>
              <HomePage />
            </GuardedRoute>
          }
          path="/home"
        />
        <Route
          element={
            <GuardedRoute>
              <MedicinePage />
            </GuardedRoute>
          }
          path="/medicine"
        />
        <Route
          element={
            <GuardedRoute>
              <MedicineDetailPage />
            </GuardedRoute>
          }
          path="/medicine/:medicineId"
        />
        <Route
          element={
            <GuardedRoute>
              <DailyPage />
            </GuardedRoute>
          }
          path="/daily"
        />
        <Route
          element={
            <GuardedRoute>
              <ScanPage />
            </GuardedRoute>
          }
          path="/scan"
        />
        <Route
          element={
            <GuardedRoute>
              <ProductInsightPage />
            </GuardedRoute>
          }
          path="/scan/product/:barcode"
        />
        <Route
          element={
            <GuardedRoute>
              <StatusPage />
            </GuardedRoute>
          }
          path="/status"
        />
        <Route
          element={
            <GuardedRoute>
              <NotificationsPage />
            </GuardedRoute>
          }
          path="/notifications"
        />
        <Route element={<Navigate replace to="/login" />} path="*" />
      </Routes>
    </Suspense>
  );
}
