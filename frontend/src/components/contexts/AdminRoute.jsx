import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Loading from "../utils/Loading";

// Admin Protected route
export default function AdminRoute() {
  const { user, authLoading } = useUser();

  if (authLoading) return <Loading />;

  if (!user.userId) { return <Navigate to="/" replace />; }

  return user.role === "admin" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
