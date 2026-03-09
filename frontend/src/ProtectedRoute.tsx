import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-violet-600" />
          Loading…
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
