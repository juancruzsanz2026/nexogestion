import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading, error } = useAuth();

  // 1. Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // 2. Mostrar error si existe
  if (error) {
    return (
      <Navigate to="/login?error=auth_failed" replace />
    );
  }

  // 3. Si NO hay usuario → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 4. Si hay usuario → dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;