import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Loading from "../utils/Loading";

// User protected route
export default function ProtectedRoute() {
  const { user, authLoading } = useUser();

  if (authLoading) return <Loading />;

  if (!user.userId) { return <Navigate to="/" replace />; }

  return <Outlet />;
}
