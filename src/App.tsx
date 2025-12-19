import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { ROUTES } from './config/routes.config';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import FactureDetail from './components/features/factures/FactureDetail';
import CreateFacture from './components/features/factures/CreateFacture';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { UpdatePrompt } from './components/UpdatePrompt';

const Login = lazy(() => import('./pages/auth/Login'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const DossiersList = lazy(() => import('./pages/dossiers/DossiersList'));
const DossierDetail = lazy(() => import('./pages/dossiers/DossierDetail'));
const ClientsList = lazy(() => import('./pages/clients/ClientsList'));
const ClientDetail = lazy(() => import('./pages/clients/ClientDetail'));
const TachesList = lazy(() => import('./pages/taches/TachesList'));
const FacturesList = lazy(() => import('./pages/factures/FacturesList'));
const DocumentsList = lazy(() => import('./pages/documents/DocumentsList'));
const Calendrier = lazy(() => import('./pages/calendrier/Calendrier'));
const UtilisateursList = lazy(() => import('./pages/utilisateurs/Utilisateurslist'));

function LoadingScreen() {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`min-h-screen ${currentTheme.colors.bgPrimary} flex items-center justify-center`}>
      <div className="text-center">
        <div className={`w-16 h-16 border-4 ${currentTheme.colors.accentStart} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className={currentTheme.colors.textMuted}>Chargement...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
            <Route path="dossiers/:id" element={<DossierDetail />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="clients/:id" element={<ClientDetail />} />
            <Route path="taches" element={<TachesList />} />
            <Route path="factures" element={<FacturesList />} />
            <Route path="factures/:id" element={<FactureDetail />} />
            <Route path="factures/new" element={<CreateFacture />} />
            <Route path="documents" element={<DocumentsList />} />
            <Route path="calendrier" element={<Calendrier />} />
            <Route path="utilisateurs" element={<UtilisateursList />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UpdatePrompt />  
      <AppContent />
    </ThemeProvider>
  );
}

export default App;