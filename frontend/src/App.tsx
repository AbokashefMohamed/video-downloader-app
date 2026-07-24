import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import { Layout } from "./components/layout/Layout";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AdminPage } from "./pages/AdminPage";
import { ProfilePage } from "./pages/ProfilePage";


// redirects to login if user is not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  if (isLoading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// redirects to home if user is not an admin
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
