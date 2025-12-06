import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { ROUTES } from './config/routes.config';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import { useTranslation } from 'react-i18next';

const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const DossiersList = lazy(() => import('./pages/dossiers/DossiersList'));
const ClientsList = lazy(() => import('./pages/clients/ClientsList'));
const TachesList = lazy(() => import('./pages/taches/TachesList'));
const FacturesList = lazy(() => import('./pages/factures/FacturesList'));
const DocumentsList = lazy(() => import('./pages/documents/DocumentsList'));
const Calendrier = lazy(() => import('./pages/calendrier/Calendrier'));

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Chargement...</p>
      </div>
    </div>
  );
}

function App() {
  const { checkAuth } = useAuthStore();
  const { i18n } = useTranslation();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // useEffect(() => {
  //   document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  // }, [i18n.language]);
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dossiers" element={<DossiersList />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="taches" element={<TachesList />} />
            <Route path="factures" element={<FacturesList />} />
            <Route path="documents" element={<DocumentsList />} />
            <Route path="calendrier" element={<Calendrier />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;