import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function AdminRoute() {
  const { user } = useUser();

  if (!user.userId) { return <Navigate to="/" replace />; }

  if (user.role !== "admin") { return <Navigate to="/unauthorized" replace />; }

  return <Outlet />;
}