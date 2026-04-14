import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute() {
  const { user } = useUser();

  if (!user.userId) { return <Navigate to="/" replace />; }

  return <Outlet />;
}