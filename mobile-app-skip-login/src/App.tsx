import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
const ProfileSetupPage = lazy(() => import("./routes/profile-setup-page").then((module) => ({ default: module.ProfileSetupPage })));
const HomePage = lazy(() => import("./routes/home-page").then((module) => ({ default: module.HomePage })));
const MedicinePage = lazy(() => import("./routes/medicine-page").then((module) => ({ default: module.MedicinePage })));
const MedicineDetailPage = lazy(() => import("./routes/medicine-detail-page").then((module) => ({ default: module.MedicineDetailPage })));
const DailyPage = lazy(() => import("./routes/daily-page").then((module) => ({ default: module.DailyPage })));
const ScanPage = lazy(() => import("./routes/scan-page").then((module) => ({ default: module.ScanPage })));
const ProductInsightPage = lazy(() => import("./routes/product-insight-page").then((module) => ({ default: module.ProductInsightPage })));
const StatusPage = lazy(() => import("./routes/status-page").then((module) => ({ default: module.StatusPage })));
const NotificationsPage = lazy(() => import("./routes/notifications-page").then((module) => ({ default: module.NotificationsPage })));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <Routes>
        <Route element={<Navigate replace to="/home" />} path="/" />
        <Route element={<Navigate replace to="/home" />} path="/login" />
        <Route element={<Navigate replace to="/home" />} path="/verify" />
        <Route element={<ProfileSetupPage />} path="/profile" />
        <Route element={<HomePage />} path="/home" />
        <Route element={<MedicinePage />} path="/medicine" />
        <Route element={<MedicineDetailPage />} path="/medicine/:medicineId" />
        <Route element={<DailyPage />} path="/daily" />
        <Route element={<ScanPage />} path="/scan" />
        <Route element={<ProductInsightPage />} path="/scan/product/:barcode" />
        <Route element={<StatusPage />} path="/status" />
        <Route element={<NotificationsPage />} path="/notifications" />
        <Route element={<Navigate replace to="/home" />} path="*" />
      </Routes>
    </Suspense>
  );
}
