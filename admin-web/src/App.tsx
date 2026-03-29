import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const OverviewPage = lazy(() => import("./routes/overview-page").then((module) => ({ default: module.OverviewPage })));
const ProductsPage = lazy(() => import("./routes/products-page").then((module) => ({ default: module.ProductsPage })));
const ImportPage = lazy(() => import("./routes/import-page").then((module) => ({ default: module.ImportPage })));
const RemindersPage = lazy(() => import("./routes/reminders-page").then((module) => ({ default: module.RemindersPage })));
const FollowUpPage = lazy(() => import("./routes/follow-up-page").then((module) => ({ default: module.FollowUpPage })));
const MessagesPage = lazy(() => import("./routes/messages-page").then((module) => ({ default: module.MessagesPage })));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <Routes>
        <Route element={<OverviewPage />} path="/" />
        <Route element={<ProductsPage />} path="/products" />
        <Route element={<ImportPage />} path="/import" />
        <Route element={<RemindersPage />} path="/reminders" />
        <Route element={<FollowUpPage />} path="/follow-up" />
        <Route element={<MessagesPage />} path="/messages" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Suspense>
  );
}
