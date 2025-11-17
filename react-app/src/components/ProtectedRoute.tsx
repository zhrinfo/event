import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredRole }: { requiredRole: string }) => {
  const role = localStorage.getItem('role');
  
  if (role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
