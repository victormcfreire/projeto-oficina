
import { Navigate, Outlet } from "react-router-dom";
import { getUserSession } from "../services/authService";

const PrivateRoute = () => {
  const user = getUserSession();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
